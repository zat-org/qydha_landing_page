export function useStartTournament(tournamentId: string) {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async () => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/start`, { method: "POST" });
    });
  };

  return { pending, status, error, fetchREQ };
}
