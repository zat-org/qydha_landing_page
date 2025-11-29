import type { ITeam, ITeamCreate } from "~/models/tournamentTeam";
import { PlayerState } from "~/models/Player";

export const useTourrnamentTeam = () => {
  const { $api } = useNuxtApp();

  const getAllTourTeams = async () => {
    const tourId = ref();
    const page = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{
        data: { items: ITeam[]; totalCount: number; currentPage: number };
        message: string;
      }>(
        "getAllTourTeams",
        () =>
          $api(`/tournaments/${tourId.value}/teams`, {
            query: { PageNumber: page.value },
          }),
        { immediate: false }
      );
    const fetchREQ = async (tour_id: string, _page: number = 1) => {
      page.value = _page;
      tourId.value = tour_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addTourTeam = async () => {
    const tourId = ref();
    const body = ref<ITeamCreate[]>([]);
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<
        {},
        { code: string; message: string; traceId: string }
      >(
        "addTourTeam",
        () =>
          $api(`/tournaments/${tourId.value}/teams`, {
            method: "post",
            body: body.value,
          }),
        { immediate: false }
      );
    const fetchREQ = async (tour_id: string, newTeam: ITeamCreate) => {
      body.value = [];
      tourId.value = tour_id;
      body.value.push(newTeam);

      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const deleteTourTeam = async () => {
    const tourId = ref();
    const teamId = ref();

    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "deleteTourTeam",
        () =>
          $api(`/tournaments/${tourId.value}/teams/${teamId.value}`, {
            method: "delete",
          }),
        { immediate: false }
      );

    const fetchREQ = async (tour_id: string, team_id: string) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const updateTourTeamName = async () => {
    const tourId = ref();
    const teamId = ref();
    const body = ref<{ name: string }>();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "updateTourTeamName",
        () =>
          $api(`/tournaments/${tourId.value}/teams/${teamId.value}`, {
            method: "put",
            body: body.value,
          }),
        { immediate: false }
      );
    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      { name }: { name: string }
    ) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      body.value = { name };
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const updateTourTeamStatus = async () => {
    const tourId = ref();
    const teamId = ref();
    const body = ref<{ status: PlayerState }>();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "updateTourTeamStatus",
        () =>
          $api(`/tournaments/${tourId.value}/teams/${teamId.value}/status`, {
            method: "patch",
            body: body.value,
          }),
        { immediate: false }
      );
    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      teamStatus: PlayerState
    ) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      body.value = { status: teamStatus };
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const acceptTourTeam = async () => {
    const tourId = ref();
    const teamId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "acceptTourTeam",
        () =>
          $api(`/tournaments/${tourId.value}/teams/${teamId.value}/accept`, {
            method: "post",
          }),
        { immediate: false }
      );
    const fetchREQ = async (tour_id: string, team_id: string) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const refuseTourTeam = async () => {
    const tourId = ref();
    const teamId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "refuseTourTeam",
        () =>
          $api(`/tournaments/${tourId.value}/teams/${teamId.value}/refuse`, {
            method: "post",
          }),
        { immediate: false }
      );
    const fetchREQ = async (tour_id: string, team_id: string) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addPlayerToTeam = async () => {
    const tourId = ref();
    const teamId = ref();
    const playerId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        ()=>["addPlayerToTeam",tourId.value,teamId.value,playerId.value].join("-"),
        () =>
          $api(
            `/tournaments/${tourId.value}/teams/${teamId.value}/players/${playerId.value}`,
            { method: "post" }
          ),
        { immediate: false }
      );
    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      player_id: string
    ) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      playerId.value = player_id;
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const removePlayerFromTeam = async () => {
    const tourId = ref();
    const teamId = ref();
    const playerId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        ()=>["removePlayerToTeam",tourId.value,teamId.value,playerId.value].join("-"),
        () =>
          $api(
            `/tournaments/${tourId.value}/teams/${teamId.value}/players/${playerId.value}`,
            { method: "delete" }
          ),
        { immediate: false }
      );
    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      player_id: string
    ) => {
      tourId.value = tour_id;
      teamId.value = team_id;
      playerId.value = player_id;
      await execute();
      if (status.value == "success") {
        refreshNuxtData("getAllTourTeams");
      }
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const imprtTeamsFromExcel = async () => {
    const tourId = ref();
    const body = ref(new FormData())
    // const file = ref<File>();
    const result =
      await useAsyncData(
        "imprtTeamsFromExcel",
        () => $api(`/tournaments/${tourId.value}/teams/import`, { method: "post", body: body.value }),
        {immediate:false},
      );
      const fetchREQ = async (tour_id: string, file: File) => {
        tourId.value = tour_id;
        body.value = new FormData()
        body.value.append("file", file)
        await result.execute();
        if (result.status.value == "success") {
          refreshNuxtData("getAllTourTeams");
        }
      }
      return { result, fetchREQ };
  };
  

  return {
    getAllTourTeams,
    addTourTeam,
    deleteTourTeam,
    updateTourTeamName,
    updateTourTeamStatus,
    acceptTourTeam,
    refuseTourTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    imprtTeamsFromExcel,
  };
};
