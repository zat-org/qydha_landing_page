import { GroupType } from "~/features/tournament/models/group";
import type { DetailGroup, Match } from "~/features/tournament/models/group";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { ITeam } from "~/features/tournament/models/tournamentTeam";
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import {
  TeamJoinRequestWorkflowState,
  type GetTeamJoinRequestsParams,
} from "~/features/tournament/models/TournamentJoinRequest";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
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

type TeamsPage = {
  items: ITeam[];
  totalCount: number;
};

export function useTournamentLifecycleSummary(
  tour: Ref<DetailTournament | null | undefined>,
) {
  const { $api } = useNuxtApp();
  const tournamentId = computed(() => tour.value?.tournament.id ?? "");

  const { places } = useTournamentPlaces(() => tour.value);

  const teams = ref<ITeam[]>([]);
  const totalTeams = ref(0);
  const teamsPending = ref(false);
  const finalGroupTeamsLinked = ref(0);

  async function loadTeams() {
    const id = tournamentId.value;
    if (!id) {
      teams.value = [];
      totalTeams.value = 0;
      return;
    }

    teamsPending.value = true;
    try {
      const page = await $api<TeamsPage>(`/tournaments/${id}/teams`, {
        query: { PageNumber: 1, PageSize: 10_000 },
      });
      teams.value = page?.items ?? [];
      totalTeams.value = page?.totalCount ?? 0;
    } catch {
      teams.value = [];
      totalTeams.value = 0;
    } finally {
      teamsPending.value = false;
    }
  }
  const expectedTeams = computed(
    () => tour.value?.tournament.expectedTeamsCount ?? 0,
  );

  const teamsByPlace = computed<TeamsByPlaceRow[]>(() =>
    buildTeamsByPlace(places.value, teams.value),
  );

  const unassignedTeamsCount = computed(() => {
    if (!places.value.length) return 0;
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
      const finalGroup = groups.find((g) => g.type === GroupType.Final);
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
          $api<Match[]>(`/tournaments/${id}/groups/${group.id}/matches`).catch(
            () => [] as Match[],
          ),
        ),
      ]);

      finalGroupTeamsLinked.value = finalDetail?.teams?.length ?? 0;

      const entries = groups.map((group, index) => {
        const matches = matchResults[index] as Match[];
        return [group.id, aggregateMatches(matches ?? [])] as const;
      });
      matchMap.value = new Map(entries);
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
      places.value,
      tour.value?.tournament.groups ?? [],
      teams.value,
      matchMap.value,
    ),
  );

  const finalGroupSummary = computed<FinalGroupSummary | null>(() =>
    buildFinalGroupSummary(
      tour.value?.tournament.groups ?? [],
      finalGroupTeamsLinked.value,
      matchMap.value,
    ),
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
        ...placeCounts
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
        ...targetPlaces.flatMap((place) => [
          fetchJoinRequestCount(id, {
            getOnlyStates: [
              TeamJoinRequestWorkflowState.WaitingOrganizerConsideration,
            ],
            useSelectedQualificationsPlaceIdFilter: true,
            selectedQualificationsPlaceId: place.id,
          }),
          fetchJoinRequestCount(id, {
            getOnlyStates: [
              TeamJoinRequestWorkflowState.WaitingOrganizerApproval,
            ],
            assignedPlaceId: place.id,
          }),
        ]),
      ]);

      const total = pending + underReview + accepted + waitingList + canceled;

      const placeRows: JoinRequestPlaceSummaryRow[] = targetPlaces.map(
        (place, index) => {
          const choseCount = placeCounts[index * 2] ?? 0;
          const assignedCount = placeCounts[index * 2 + 1] ?? 0;
          return {
            placeId: place.id,
            isNoPreference: false,
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
        },
      );

      if (noPreferenceWaiting > 0) {
        placeRows.push({
          placeId: null,
          isNoPreference: true,
          label: "بدون تفضيل مكان",
          capacity: null,
          choseCount: noPreferenceWaiting,
          assignedCount: null,
          remaining: null,
        });
      }

      const start = t.joinRequestStartAt
        ? new Date(t.joinRequestStartAt).toLocaleDateString("ar-EG")
        : "—";
      const end = t.joinRequestEndAt
        ? new Date(t.joinRequestEndAt).toLocaleDateString("ar-EG")
        : "—";

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
    totalTeams,
    expectedTeams,
    teamsByPlace,
    unassignedTeamsCount,
    placesTree,
    groupsHierarchyPending,
    finalGroupSummary,
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
