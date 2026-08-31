import { appKeys } from "~/composables/queryKeys";

export function useSetupTournament(tournamentId: string) {
  const toast = useToast();
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async () => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/setup-stages`, {
        method: "POST",
      });
      await refreshAppData(
        appKeys.tournament(tournamentId),
        appKeys.tournamentGroups(tournamentId),
      );
    });

    if (status.value === "success") {
      toast.add({
        title: "تم بدء تنظيم البطولة",
        description: "تم بدء تنظيم مراحل ومجموعات البطولة بنجاح",
        color: "success",
      });
    }
  };

  return { pending, status, error, fetchREQ };
}
