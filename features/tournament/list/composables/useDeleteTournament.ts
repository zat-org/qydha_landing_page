export function useDeleteTournament() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}`, { method: "DELETE" });
    });
  };

  return { pending, status, error, fetchREQ };
}
