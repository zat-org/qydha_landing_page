import {
  type GetTournamentParams,
  OrderByStartAtDirection,
  type getTournamentResponse,
  TournamentState,
} from "~/features/tournament/models/tournament";

export function useAllTournament() {
  const { $api } = useNuxtApp();

  const tournamentStateLabel: Record<TournamentState, string> = {
    [TournamentState.Upcoming]: "القادمة",
    [TournamentState.Running]: "الجارية",
    [TournamentState.Finished]: "المنتهية",
  };

  const tournamentStateColor: Record<
    TournamentState,
    "warning" | "success" | "neutral"
  > = {
    [TournamentState.Upcoming]: "warning",
    [TournamentState.Running]: "success",
    [TournamentState.Finished]: "neutral",
  };

  const tournamentOrderStartAt: Record<OrderByStartAtDirection, string> = {
    [OrderByStartAtDirection.ASC]: "من الاقدم الي الاحدث",
    [OrderByStartAtDirection.DESC]: "من الاحدث الي الاقدم ",
  };

  const getTournamnetStateOptions = () =>
    Object.values(TournamentState).map((value) => ({
      label: tournamentStateLabel[value],
      color: tournamentStateColor[value],
      value,
    }));

  const getTournamnetOrderStartAtOptions = () =>
    Object.values(OrderByStartAtDirection).map((value) => ({
      label: tournamentOrderStartAt[value],
      value,
    }));

  const getAllTournament = async (params: Ref<GetTournamentParams>) => {
    const param = ref(unref(params));
    watch(
      [() => param.value.States, () => param.value.OrderByStartAtDirection],
      () => {
        param.value.PageNumber = 1;
      },
    );

    const { data, pending, error, refresh, status } =
      await useAppLazyData<getTournamentResponse>(
        () => buildAppDataKey("getAllTournament", unref(param)),
        () => $api("/tournaments/dashboard", { query: unref(param) }),
        { watch: [param], server: false },
      );

    return { data, pending, error, refresh, status };
  };

  return {
    getAllTournament,
    getTournamnetStateOptions,
    getTournamnetOrderStartAtOptions,
  };
}
