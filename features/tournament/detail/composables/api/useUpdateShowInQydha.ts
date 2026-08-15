export function useUpdateShowInQydha() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string, showInQydha: boolean) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/show-in-qydha`, {
        method: "PUT",
        body: { showInQydha },
      });
      await refreshAppData(appKeys.tournament(tournamentId));
    });
  };

  return { pending, status, error, fetchREQ };
}
