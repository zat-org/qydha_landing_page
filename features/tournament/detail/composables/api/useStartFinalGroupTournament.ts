export function useStartFinalGroupTournament(tournamentId: string) {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async () => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/start-final-group-matches`, {
        method: "POST",
      });
      await refreshAppData(appKeys.tournament(tournamentId));
    });
  };

  return { pending, status, error, fetchREQ };
}
