export function useApproveTournamentPlan() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/confirm-final-group-bracket`, {
        method: "POST",
      });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });
  };

  return { pending, status, error, fetchREQ };
}
