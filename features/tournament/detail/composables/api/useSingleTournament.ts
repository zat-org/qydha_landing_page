import type { DetailTournament } from "~/features/tournament/models/tournament";

export function useSingleTournament() {
  const { $api } = useNuxtApp();

  const getSingelTournament = (
    tournamentId: string,
    options?: { immediate?: boolean },
  ) => {
    return useAppLazyApiData<DetailTournament>(
      `getSingelTournament-${tournamentId}`,
      () => $api(`/tournaments/${tournamentId}/dashboard`),
      { immediate: options?.immediate ?? true },
    );
  };

  return { getSingelTournament };
}
