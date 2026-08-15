import type {
  ITeam,
  ITeamCreate,
} from "~/features/tournament/models/tournamentTeam";
import { PlayerState } from "~/features/tournament/models/Player";

/** جلب أكبر عدد ممكن من الفرق غير المرتبطة بالمجموعة في طلب واحد (قد يفرض الخادم حداً أقصى أقل) */
const NOT_IN_GROUP_TEAMS_PAGE_SIZE = 10_000;

type TeamsPage = {
  items: ITeam[];
  totalCount: number;
  currentPage: number;
};

export const useTourrnamentTeam = () => {
  const { $api } = useNuxtApp();

  const getAllTourTeams = async () => {
    const tourId = ref();
    const page = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<TeamsPage>(
        appKeys.tournamentTeams,
        () =>
          $api(`/tournaments/${tourId.value}/teams`, {
            query: { PageNumber: page.value },
          }),
        { immediate: false },
      );
    const fetchREQ = async (tour_id: string, _page: number = 1) => {
      page.value = _page;
      tourId.value = tour_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getNotInGroupTourTeams = async () => {
    const tourId = ref<string>();
    const page = ref<number>();
    const groupId = ref<string>();
    const pageSize = ref<number>(NOT_IN_GROUP_TEAMS_PAGE_SIZE);
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<TeamsPage>(
        appKeys.tournamentNotInGroupTeams,
        () =>
          $api(`/tournaments/${tourId.value}/teams`, {
            query: {
              PageNumber: page.value,
              PageSize: pageSize.value,
              notInGroupId: groupId.value,
              playersCount: 2,
            },
          }),
        { immediate: false },
      );
    const fetchREQ = async (
      tour_id: string,
      _groupId: string,
      _page: number = 1,
      _pageSize: number = NOT_IN_GROUP_TEAMS_PAGE_SIZE,
    ) => {
      page.value = _page;
      tourId.value = tour_id;
      groupId.value = _groupId;
      pageSize.value = _pageSize;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addTourTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, newTeam: ITeamCreate) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams`, {
          method: "post",
          body: [newTeam],
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteTourTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, team_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams/${team_id}`, {
          method: "delete",
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateTourTeamName = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      { name }: { name: string },
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams/${team_id}`, {
          method: "put",
          body: { name },
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateTourTeamStatus = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      teamStatus: PlayerState,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams/${team_id}/status`, {
          method: "patch",
          body: { status: teamStatus },
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const acceptTourTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, team_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams/${team_id}/accept`, {
          method: "post",
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const refuseTourTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, team_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/teams/${team_id}/refuse`, {
          method: "post",
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const addPlayerToTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      player_id: string,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/teams/${team_id}/players/${player_id}`,
          { method: "post" },
        );
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const removePlayerFromTeam = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      team_id: string,
      player_id: string,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/teams/${team_id}/players/${player_id}`,
          { method: "delete" },
        );
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const imprtTeamsFromExcel = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const result = { pending, status, error };

    const fetchREQ = async (tour_id: string, file: File) => {
      await execute(async () => {
        const body = new FormData();
        body.append("file", file);
        await $api(`/tournaments/${tour_id}/teams/import`, {
          method: "post",
          body,
        });
        await refreshAppData(appKeys.tournamentTeams);
      });
    };

    return { result, fetchREQ };
  };

  const linkTeamToGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      group_id: string,
      team_ids: string[],
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/groups/${group_id}/teams-links`,
          { method: "post", body: { teamsIds: team_ids } },
        );
        await refreshAppData(
          appKeys.tournamentGroupDetails(tour_id, group_id),
        );
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const unlinkTeamFromGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      group_id: string,
      team_ids: string[],
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/groups/${group_id}/teams-links`,
          { method: "delete", body: { teamsIds: team_ids } },
        );
        await refreshAppData(
          appKeys.tournamentGroupDetails(tour_id, group_id),
          appKeys.tournamentNotInGroupTeams,
        );
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    getAllTourTeams,
    getNotInGroupTourTeams,
    addTourTeam,
    deleteTourTeam,
    updateTourTeamName,
    updateTourTeamStatus,
    acceptTourTeam,
    refuseTourTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    imprtTeamsFromExcel,
    linkTeamToGroup,
    unlinkTeamFromGroup,
  };
};
