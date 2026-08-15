export function useFinishTournament() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/finish`, { method: "POST" });
      await refreshAppData(appKeys.tournament(tournamentId));
    });
  };

  return { pending, status, error, fetchREQ };
}
