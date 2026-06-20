export function useUpdateShowInQydha() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string, showInQydha: boolean) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/show-in-qydha`, {
        method: "PUT",
        body: { showInQydha },
      });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });
  };

  return { pending, status, error, fetchREQ };
}
