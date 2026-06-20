export function useFinishTournament() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/finish`, { method: "POST" });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });
  };

  return { pending, status, error, fetchREQ };
}
