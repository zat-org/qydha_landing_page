export function useResumeFinalGroupAfterFinish() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/resume-final-group-matches`, {
        method: "POST",
      });
      await refreshAppData(appKeys.tournament(tournamentId));
    });
  };

  return { pending, status, error, fetchREQ };
}
