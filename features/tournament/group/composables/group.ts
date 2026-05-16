import type {
  CreateMatch,
  DetailGroup,
  Group,
  Match,
  RoundGroupDetails,
  Team,
} from "~/features/tournament/models/group";
import type { Node, Edge } from "@vue-flow/core";
import { useMyAuthStore } from "~/store/Auth";
import type { Privilege } from "~/models/user";
import type { TournamentRoundUpdate } from "~/features/tournament/models/tournamentRound";

interface GraphData {
  nodes: Node<any, any, string>[];
  edges: Edge<any, any, string>[];
}

export const useGroup = () => {
  const userStore = useMyAuthStore();
  const { $api } = useNuxtApp();
  const getGroups = (tourid: string) => {
    const { data, pending, error, refresh, status, execute } =
      useAsyncData<{
        message: string;
        data: {
          groups: Group[];
          requesterPrivilege: {
            permissions: string[] | null;
            privilege: Privilege;
          };
        };
      }>(
        () => ["getGroups", tourid].join("-"),
        () => $api(`/tournaments/${tourid}/groups`),
      );
    watch(status, () => {
      if (status.value == "success" && data.value && data.value.data) {
        userStore.permissions =
          data.value?.data.requesterPrivilege.permissions ?? [];
        userStore.privilege = data.value?.data.requesterPrivilege.privilege;
      }
    });

    return { data, pending, error, refresh, status, execute };
  };
  const getGroupDetails = async (tour_id: string, group_id: string) => {
    return await useAsyncData<{ message: string; data: DetailGroup }>(
      () => ["getGroupDetails", tour_id, group_id].join("-"),
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

    const result = await useAsyncData<{
      message: string;
      data: RoundGroupDetails;
    }>(
      () => ["getRoundsGroupDetails", tour_id, group_id].join("-"),
      () => $api(`tournaments/${TOURID.value}/groups/${GROUPID.value}/rounds`),
    {immediate: options.immediate});
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
      await useAsyncData<{ message: string; data: Match[] }>(
        "getGroupMatch",

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

  const addAvailableTeamsToFinalGroup = async () => {
    const tour_id = ref();
    const result = await useAsyncData<{ message: string; data: Match[] }>(
      () => ["addAvailableTeamsToFinalGroup", tour_id.value].join("-"),
      () =>
        $api(`tournaments/${tour_id.value}/groups/final/teams-links`, {
          method: "post",
        }),
      { immediate: false },
    );
    const fetchREQ = async (_tour_id: string) => {
      tour_id.value = _tour_id;
      await result.execute();
    };
    return { result, fetchREQ };
  };

  const updateTournamentRound = () => {
    const tour_id = ref();
    const round_id = ref();
    const group_id = ref();
    const body = ref<TournamentRoundUpdate>();
    const result = useAsyncData<{
      message: string;
      data: TournamentRoundUpdate;
    }>(
      "updateTournamentRound",
      () =>
        $api(
          `tournaments/${tour_id.value}/groups/${group_id.value}/rounds/${round_id.value}`,
          { method: "put", body: body.value },
        ),
      { immediate: false },
    );

    const fetchREQ = async (
      _tour_id: string,
      _round_id: string,
      _group_id: string,
      _body: TournamentRoundUpdate,
    ) => {
      tour_id.value = _tour_id;
      round_id.value = _round_id;
      group_id.value = _group_id;
      body.value = _body;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(
          ["getRoundsGroupDetails", _tour_id, _group_id].join("-"),
        );
      }
    };
    return { result, fetchREQ };
  };

  const ceateMatchesForGroup = () => {
    const tour_id = ref();
    const group_id = ref();
    const body = ref<CreateMatch>();
    const result = useAsyncData<{ message: string; data: Match[] }>(
      () => ["ceateMatchesForGroup", tour_id.value, group_id.value].join("-"),
      () =>
        $api(`tournaments/${tour_id.value}/groups/${group_id.value}/matches`, {
          method: "post",
          body: body.value,
        }),
      { immediate: false },
    );
    const fetchREQ = async (
      _tour_id: string,
      _group_id: string,
      _body: CreateMatch,
    ) => {
      tour_id.value = _tour_id;
      group_id.value = _group_id;
      body.value = _body;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(["getGroups", tour_id.value].join("-"));
      }
    };
    return { result, fetchREQ };
  };

  const ceateMatchesForFinalGroup = () => {
    const tour_id = ref();
    const body = ref<CreateMatch>();
    const result = useAsyncData<{ message: string; data: Match[] }>(
      () => ["ceateMatchesForFinalGroup", tour_id.value].join("-"),
      () =>
        $api(`tournaments/${tour_id.value}/generate-final-group-matches`, {
          method: "post",
          body: body.value,
        }),
      { immediate: false },
    );
    const fetchREQ = async (
      _tour_id: string,
      _body: CreateMatch,
      _group_id?: string,
    ) => {
      tour_id.value = _tour_id;
      body.value = _body;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(["getGroups", tour_id.value].join("-"));
        if (_group_id) {
          refreshNuxtData(
            ["getRoundsGroupDetails", _tour_id, _group_id].join("-"),
          );
        }
      }
    };
    return { result, fetchREQ };
  };

  const unlinkTeamFromGroup = async () => {
    const tourId = ref();
    const groupId = ref();
    const body = ref<{ teamsId: string[] }>({ teamsId: [] });
    const result = await useAsyncData(
      "unlinkTeam",
      () =>
        $api(
          `/tournaments/${tourId.value}/groups/${groupId.value}/teams-links`,
          { method: "delete", body: body.value },
        ),
      { immediate: false },
    );
    const fetchREQ = async (
      tour_id: string,
      group_id: string,
      teams_id: string[],
    ) => {
      tourId.value = tour_id;
      groupId.value = group_id;
      body.value.teamsId = teams_id;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(["getGroupDetails", tour_id, group_id].join("-"));
      }
    };
    return { result, fetchREQ };
  };

  const revertGroupToLinkingState = async () => {
    const tourId = ref();
    const groupId = ref();
    const result = await useAsyncData(
      "revertGroupToLinkingState",
      () =>
        $api(`/tournaments/${tourId.value}/groups/${groupId.value}/matches`, {
          method: "delete",
        }),
      { immediate: false },
    );
    const fetchREQ = async (tour_id: string, group_id: string) => {
      tourId.value = tour_id;
      groupId.value = group_id;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(["getGroupDetails", tour_id, group_id].join("-"));
        refreshNuxtData(["getGroups", tour_id].join("-"));
      }
    };
    return { ...result, fetchREQ };
  };
  const revertFinalGroupGeneratedMatches = async () => {
    const tourId = ref();
    const result = await useAsyncData(
      "revertFinalGroupGeneratedMatches",
      () =>
        $api(
          `/tournaments/${tourId.value}/revert-final-group-generated-matches`,
          { method: "post" },
        ),
      { immediate: false },
    );
    const fetchREQ = async (tour_id: string, group_id: string) => {
      tourId.value = tour_id;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(["getGroupDetails", tour_id, group_id].join("-"));
        refreshNuxtData(["getGroups", tour_id].join("-"));
      }
    };
    return { ...result, fetchREQ };
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
