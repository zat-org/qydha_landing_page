import { appKeys } from "~/composables/queryKeys";

export function useConfirmFinalStageTeams() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (tournamentId: string) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/confirm-final-stage-teams`, {
        method: "POST",
      });
      await refreshAppData(
        appKeys.tournament(tournamentId),
        appKeys.tournamentGroups(tournamentId),
      );
    });
  };

  return { pending, status, error, fetchREQ };
}
