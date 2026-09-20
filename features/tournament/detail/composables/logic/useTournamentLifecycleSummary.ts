import { formatDateTime } from "~/utils/formatDate";
import { GroupType, parseGroupMatchesPayload } from "~/features/tournament/models/group";
import type { DetailGroup } from "~/features/tournament/models/group";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import {
  TeamJoinRequestWorkflowState,
  type GetTeamJoinRequestsParams,
} from "~/features/tournament/models/TournamentJoinRequest";
import {
  buildTeamJoinRequestsQuery,
  pagedListTotal,
  unwrapApiData,
} from "~/features/tournament/join-request/composables/joinRequestQuery.utils";
import {
  getJoinRequestTargetPlaces,
  placeOptionLabel,
} from "~/features/tournament/join-request/composables/joinRequestPlaces.utils";
import {
  aggregateMatches,
  buildFinalGroupSummary,
  buildPlacesTree,
  buildTeamsByPlace,
  type FinalGroupSummary,
  computePlaceRemaining,
  type JoinRequestPlaceSummaryRow,
  type JoinRequestsSummary,
  type PlaceTreeRow,
  type TeamsByPlaceRow,
} from "./tournamentLifecycleSummary.utils";

export function useTournamentLifecycleSummary(
  tour: Ref<DetailTournament | null | undefined>,
) {
  const { $api } = useNuxtApp();
  const tournamentId = computed(() => tour.value?.tournament.id ?? "");

  /** Places from GET /places (Final + Qualification) for teams / groups summary. */
  const teamsPlaces = ref<GetTournamentPlace[]>([]);
  const totalTeams = ref(0);
  const teamsPending = ref(false);
  const finalGroupTeamsLinked = ref(0);

  async function loadTeams() {
    const id = tournamentId.value;
    if (!id) {
      totalTeams.value = 0;
      teamsPlaces.value = [];
      return;
    }

    teamsPending.value = true;
    try {
      const [placesRes, teamsRes] = await Promise.all([
        $api(`/tournaments/${id}/places`),
        $api(`/tournaments/${id}/teams`, {
          query: { PageNumber: 1, PageSize: 1 },
        }),
      ]);

      const allPlaces = unwrapApiData<GetTournamentPlace[]>(placesRes) ?? [];
      teamsPlaces.value = allPlaces.filter(
        (p) => p.stageType === "Qualification" || p.stageType === "Final",
      );
      totalTeams.value = pagedListTotal(teamsRes);
    } catch {
      totalTeams.value = 0;
      teamsPlaces.value = [];
    } finally {
      teamsPending.value = false;
    }
  }

  const expectedTeams = computed(
    () => tour.value?.tournament.expectedTeamsCount ?? 0,
  );

  const teamsByPlace = computed<TeamsByPlaceRow[]>(() =>
    buildTeamsByPlace(teamsPlaces.value),
  );

  const unassignedTeamsCount = computed(() => {
    if (!teamsPlaces.value.length) return 0;
    const assigned = teamsByPlace.value.reduce(
      (sum, row) => sum + row.teamsCount,
      0,
    );
    return Math.max(0, totalTeams.value - assigned);
  });

  const matchMap = ref(new Map<string, ReturnType<typeof aggregateMatches>>());
  const matchesPending = ref(false);

  async function loadGroupMatches() {
    const id = tournamentId.value;
    const groups = tour.value?.tournament.groups ?? [];
    if (!id || !groups.length) {
      matchMap.value = new Map();
      finalGroupTeamsLinked.value = 0;
      return;
    }

    matchesPending.value = true;
    try {
      const finalGroup = groups.find(
        (g) => g.type === GroupType.Final || g.stageType === "Final",
      );
      const detailPromises = finalGroup
        ? [
            $api<DetailGroup>(
              `/tournaments/${id}/groups/${finalGroup.id}`,
            ).catch(() => null),
          ]
        : [Promise.resolve(null)];

      const [finalDetail, ...matchResults] = await Promise.all([
        ...detailPromises,
        ...groups.map((group) =>
          $api(`/tournaments/${id}/groups/${group.id}/matches`).catch(
            () => ({ matches: [], requesterMatchIds: [] }),
          ),
        ),
      ]);

      const unwrappedFinal = unwrapApiData<DetailGroup>(finalDetail);
      finalGroupTeamsLinked.value = unwrappedFinal?.teams?.length ?? 0;

      const entries = groups.map((group, index) => {
        const payload = parseGroupMatchesPayload(
          unwrapApiData(matchResults[index]),
        );
        return [group.id, aggregateMatches(payload.matches)] as const;
      });
      matchMap.value = new Map(entries);
    } catch {
      matchMap.value = new Map();
      finalGroupTeamsLinked.value = 0;
    } finally {
      matchesPending.value = false;
    }
  }

  watch(
    () => tour.value?.tournament.groups?.map((g) => g.id).join(","),
    () => {
      void loadGroupMatches();
    },
    { immediate: true },
  );

  watch(tournamentId, () => void loadTeams(), { immediate: true });

  const placesTree = computed<PlaceTreeRow[]>(() =>
    buildPlacesTree(
      teamsPlaces.value.filter((p) => p.stageType === "Qualification"),
      tour.value?.tournament.groups ?? [],
      matchMap.value,
    ),
  );

  const finalGroup = computed(
    () =>
      tour.value?.tournament.groups?.find(
        (g) => g.type === GroupType.Final || g.stageType === "Final",
      ) ?? null,
  );

  const finalGroupSummary = computed<FinalGroupSummary | null>(() =>
    buildFinalGroupSummary(
      tour.value?.tournament.groups ?? [],
      finalGroupTeamsLinked.value,
      matchMap.value,
    ),
  );

  const detailedState = computed(
    () => tour.value?.tournament.detailedState,
  );

  const joinSummary = ref<JoinRequestsSummary | null>(null);
  const joinPending = ref(false);
  const joinRequestPlaces = ref<GetTournamentPlace[]>([]);

  const canMutateJoinRequests = computed(
    () =>
      tour.value?.tournament.detailedState ===
      TournamentDetailedState.ManagingJoinRequests,
  );

  async function fetchJoinRequestCount(
    id: string,
    query: Omit<GetTeamJoinRequestsParams, "pageNumber" | "pageSize">,
  ) {
    const qs = buildTeamJoinRequestsQuery({
      pageNumber: 1,
      pageSize: 1,
      ...query,
    });
    const res = await $api(
      `/tournaments/${id}/tournament-team-join-requests?${qs}`,
    );
    return pagedListTotal(res);
  }

  async function loadJoinSummary() {
    const id = tournamentId.value;
    const t = tour.value?.tournament;
    if (!id || !t) {
      joinSummary.value = null;
      joinRequestPlaces.value = [];
      return;
    }

    joinPending.value = true;
    try {
      const placesRes = await $api(`/tournaments/${id}/places`);
      const allPlaces = unwrapApiData<GetTournamentPlace[]>(placesRes) ?? [];
      joinRequestPlaces.value = allPlaces;

      const targetPlaces = getJoinRequestTargetPlaces(allPlaces);
      const isManagingJoinRequests =
        t.detailedState === TournamentDetailedState.ManagingJoinRequests;

      const [
        pending,
        underReview,
        accepted,
        waitingList,
        canceled,
        noPreferenceWaiting,
      ] = await Promise.all([
        fetchJoinRequestCount(id, {
          getOnlyStates: [
            TeamJoinRequestWorkflowState.WaitingOrganizerConsideration,
          ],
        }),
        fetchJoinRequestCount(id, {
          getOnlyStates: [
            TeamJoinRequestWorkflowState.WaitingOrganizerApproval,
          ],
        }),
        fetchJoinRequestCount(id, {
          getOnlyStates: [TeamJoinRequestWorkflowState.ApprovedByOrganizer],
        }),
        fetchJoinRequestCount(id, {
          getOnlyStates: [TeamJoinRequestWorkflowState.InWaitingList],
        }),
        fetchJoinRequestCount(id, {
          getOnlyStates: [TeamJoinRequestWorkflowState.CanceledByOrganizer],
        }),
        fetchJoinRequestCount(id, {
          getOnlyStates: [
            TeamJoinRequestWorkflowState.WaitingOrganizerConsideration,
          ],
          useSelectedQualificationsPlaceIdFilter: true,
          selectedQualificationsPlaceId: null,
        }),
      ]);

      const total = pending + underReview + accepted + waitingList + canceled;

      const placeRows: JoinRequestPlaceSummaryRow[] = [
        ...targetPlaces.map((place) => {
          const choseCount = place.selectedJoinRequestsCount ?? 0;
          const assignedCount = place.assignedJoinRequestsCount ?? 0;
          return {
            placeId: place.id,
            label: placeOptionLabel(place),
            capacity: place.competingTeamsCount,
            choseCount,
            assignedCount,
            remaining: computePlaceRemaining(
              place.competingTeamsCount,
              choseCount,
              assignedCount,
              isManagingJoinRequests,
            ),
          };
        }),
        {
          placeId: null,
          label: "بدون تفضيل مكان",
          isNoPreference: true,
          capacity: null,
          choseCount: noPreferenceWaiting,
          assignedCount: null,
          remaining: null,
        },
      ];

      const start = formatDateTime(t.joinRequestStartAt);
      const end = formatDateTime(t.joinRequestEndAt);

      joinSummary.value = {
        total,
        max: t.joinRequestMaxCount,
        pending,
        underReview,
        accepted,
        waitingList,
        canceled,
        noPreferenceWaiting,
        placeRows,
        joinWindow: `${start} – ${end}`,
        isManagingJoinRequests,
      };
    } catch {
      joinSummary.value = null;
    } finally {
      joinPending.value = false;
    }
  }

  watch(tournamentId, () => void loadJoinSummary(), { immediate: true });

  const groupsHierarchyPending = computed(
    () => teamsPending.value || matchesPending.value,
  );

  async function refresh() {
    await Promise.all([loadTeams(), loadGroupMatches(), loadJoinSummary()]);
  }

  return {
    tournamentId,
    teamsPending,
    matchesPending,
    totalTeams,
    expectedTeams,
    teamsByPlace,
    unassignedTeamsCount,
    placesTree,
    groupsHierarchyPending,
    finalGroup,
    finalGroupSummary,
    detailedState,
    joinSummary,
    joinPending,
    joinRequestPlaces,
    canMutateJoinRequests,
    refresh,
  };
}

export type TournamentLifecycleSummary = ReturnType<
  typeof useTournamentLifecycleSummary
>;
