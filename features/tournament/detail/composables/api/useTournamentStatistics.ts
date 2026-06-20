import type { TournamentStatistics } from "~/features/tournament/models/tournament";

export function useTournamentStatistics(tournamentId: string) {
  const { $qaydhaapi } = useNuxtApp();

  return useAsyncData<{ data: TournamentStatistics }>(
    `getTournamentStatistics-${tournamentId}`,
    () => $qaydhaapi(`/tournaments/${tournamentId}/statistics`),
  );
}
