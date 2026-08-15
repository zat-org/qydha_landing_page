import type {
  IPlayer,
  IPlayerCreate,
} from "~/features/tournament/models/tournamentTeam";

type PlayersPage = {
  items: IPlayer[];
  totalCount: number;
  currentPage: number;
};

export const useTournamentPlayer = () => {
  const { $api } = useNuxtApp();

  const addPlayer = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, new_player: IPlayerCreate) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/players`, {
          method: "post",
          body: new_player,
        });
        await refreshAppData(appKeys.tournamentPlayers);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getPlayer = async () => {
    const tourId = ref();
    const hasTeam = ref<boolean | null>();
    const page = ref<number>();
    const searchtoken = ref<string>();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<PlayersPage>(
        appKeys.tournamentPlayers,
        () =>
          $api(`/tournaments/${tourId.value}/players`, {
            query: {
              HasTeam: hasTeam.value,
              PageNumber: page.value,
              SearchToken: searchtoken.value,
            },
          }),
        { immediate: false },
      );
    const fetchREQ = async (
      tour_id: string,
      has_team: boolean | null = null,
      _page: number = 1,
      _searchtoken: string = "",
    ) => {
      tourId.value = tour_id;
      hasTeam.value = has_team;
      page.value = _page;
      searchtoken.value = _searchtoken;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const deletePlayer = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, player_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/players/${player_id}`, {
          method: "delete",
        });
        await refreshAppData(appKeys.tournamentPlayers);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updatePlayer = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      player_id: string,
      new_player: IPlayerCreate,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/players/${player_id}`, {
          method: "put",
          body: new_player,
        });
        await refreshAppData(appKeys.tournamentPlayers);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { addPlayer, getPlayer, deletePlayer, updatePlayer };
};
