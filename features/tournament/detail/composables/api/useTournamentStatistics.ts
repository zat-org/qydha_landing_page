import type { TournamentStatistics } from "~/features/tournament/models/tournament";

export function useTournamentStatistics(tournamentId: string) {
  const { $qaydhaapi } = useNuxtApp();

  return useAppApiData<TournamentStatistics>(
    appKeys.tournamentStatistics(tournamentId),
    () => $qaydhaapi(`/tournaments/${tournamentId}/statistics`),
  );
}
