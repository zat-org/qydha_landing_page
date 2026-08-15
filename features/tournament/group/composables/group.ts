import type {
  CreateMatch,
  DetailGroup,
  Group,
  Match,
  RoundGroupDetails,
} from "~/features/tournament/models/group";
import { useMyAuthStore } from "~/store/Auth";
import type { Privilege } from "~/models/user";
import type { TournamentRoundUpdate } from "~/features/tournament/models/tournamentRound";

type GroupsPayload = {
  groups: Group[];
  requesterPrivilege: {
    permissions: string[] | null;
    privilege: Privilege;
  };
};

export const useGroup = () => {
  const userStore = useMyAuthStore();
  const { $api } = useNuxtApp();

  const getGroups = (tourid: string) => {
    const { data, pending, error, refresh, status, execute } =
      useAppApiData<GroupsPayload>(appKeys.tournamentGroups(tourid), () =>
        $api(`/tournaments/${tourid}/groups`),
      );

    watch(status, () => {
      if (status.value == "success" && data.value) {
        userStore.permissions =
          data.value.requesterPrivilege.permissions ?? [];
        userStore.privilege = data.value.requesterPrivilege.privilege;
      }
    });

    return { data, pending, error, refresh, status, execute };
  };

  const getGroupDetails = async (tour_id: string, group_id: string) => {
    return await useAppApiData<DetailGroup>(
      appKeys.tournamentGroupDetails(tour_id, group_id),
      () => $api(`tournaments/${tour_id}/groups/${group_id}`),
    );
  };

  const getRoundsGroupDetails = async (
    tour_id: string,
    group_id: string,
    options: { immediate: boolean } = { immediate: true },
  ) => {
    const TOURID = ref(tour_id);
    const GROUPID = ref(group_id);

    const result = await useAppApiData<RoundGroupDetails>(
      () => appKeys.match("getRoundsGroupDetails", TOURID.value, GROUPID.value),
      () => $api(`tournaments/${TOURID.value}/groups/${GROUPID.value}/rounds`),
      { immediate: options.immediate },
    );
    const fetchREQ = async (_tour_id: string, _group_id: string) => {
      TOURID.value = _tour_id;
      GROUPID.value = _group_id;
      await result.execute();
    };
    return { ...result, fetchREQ };
  };

  const getGroupMatches = async () => {
    const tour_id = ref();
    const group_id = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<Match[]>(
        appKeys.match("getGroupMatch"),
        () =>
          $api(`tournaments/${tour_id.value}/groups/${group_id.value}/matches`),
        { immediate: false },
      );

    const fetchREQ = async (_tour_id: string, _group_id: string) => {
      group_id.value = _group_id;
      tour_id.value = _tour_id;
      await execute();
    };
    return {
      data,
      pending,
      error,
      refresh,
      status,
      fetchREQ,
    };
  };

  const addAvailableTeamsToFinalGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_tour_id: string) => {
      await execute(async () => {
        await $api(`tournaments/${_tour_id}/groups/final/teams-links`, {
          method: "post",
        });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const updateTournamentRound = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _round_id: string,
      _group_id: string,
      _body: TournamentRoundUpdate,
    ) => {
      await execute(async () => {
        await $api(
          `tournaments/${_tour_id}/groups/${_group_id}/rounds/${_round_id}`,
          { method: "put", body: _body },
        );
        await refreshAppData(
          appKeys.match("getRoundsGroupDetails", _tour_id, _group_id),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const ceateMatchesForGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _group_id: string,
      _body: CreateMatch,
    ) => {
      await execute(async () => {
        await $api(`tournaments/${_tour_id}/groups/${_group_id}/matches`, {
          method: "post",
          body: _body,
        });
        await refreshAppData(
          appKeys.tournamentGroups(_tour_id),
          appKeys.tournament(_tour_id),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const ceateMatchesForFinalGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _body: CreateMatch,
      _group_id?: string,
    ) => {
      await execute(async () => {
        await $api(`tournaments/${_tour_id}/generate-final-group-matches`, {
          method: "post",
          body: _body,
        });
        const keys = [
          appKeys.tournamentGroups(_tour_id),
          appKeys.tournament(_tour_id),
        ];
        if (_group_id) {
          keys.push(
            appKeys.tournamentGroupDetails(_tour_id, _group_id),
            appKeys.match("getRoundsGroupDetails", _tour_id, _group_id),
          );
        }
        await refreshAppData(...keys);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const unlinkTeamFromGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      group_id: string,
      teams_id: string[],
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/groups/${group_id}/teams-links`, {
          method: "delete",
          body: { teamsId: teams_id },
        });
        await refreshAppData(
          appKeys.tournamentGroupDetails(tour_id, group_id),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const revertGroupToLinkingState = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, group_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/groups/${group_id}/matches`, {
          method: "delete",
        });
        await refreshAppData(
          appKeys.tournamentGroupDetails(tour_id, group_id),
          appKeys.tournamentGroups(tour_id),
          appKeys.tournament(tour_id),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const revertFinalGroupGeneratedMatches = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, group_id: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/revert-final-group-generated-matches`,
          { method: "post" },
        );
        await refreshAppData(
          appKeys.tournamentGroupDetails(tour_id, group_id),
          appKeys.tournamentGroups(tour_id),
          appKeys.tournament(tour_id),
        );
      });
    };
    return { pending, status, error, fetchREQ };
  };

  return {
    getGroups,
    getGroupMatches,
    addAvailableTeamsToFinalGroup,
    getGroupDetails,
    unlinkTeamFromGroup,
    ceateMatchesForGroup,
    ceateMatchesForFinalGroup,
    getRoundsGroupDetails,
    updateTournamentRound,
    revertGroupToLinkingState,
    revertFinalGroupGeneratedMatches,
  };
};
