export function useSetupTournament(tournamentId: string) {
  const toast = useToast();
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (type: string) => {
    await execute(async () => {
      const body =
        type === "direct"
          ? {
              hasQualificationsStage: false,
              qualificationsStageData: null,
            }
          : undefined;

      await $api(`/tournaments/${tournamentId}/setup-stages`, {
        method: "POST",
        body,
      });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });

    if (status.value === "success") {
      toast.add({
        title: "تم بدء تنظيم البطولة",
        description: "تم بدء تنظيم البطولة بنجاح",
        color: "success",
      });
    }
  };

  return { pending, status, error, fetchREQ };
}
