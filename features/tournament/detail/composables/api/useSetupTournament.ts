import type { SetupQualificationGroup } from "~/features/tournament/models/place";

export type SetupTournamentPayload =
  | { type: "direct" }
  | { type: "qualifications"; groups: SetupQualificationGroup[] };

export function useSetupTournament(tournamentId: string) {
  const toast = useToast();
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (payload: SetupTournamentPayload) => {
    await execute(async () => {
      const body =
        payload.type === "direct"
          ? {
              hasQualificationsStage: false,
              qualificationsStageData: null,
            }
          : {
              hasQualificationsStage: true,
              qualificationsStageData: {
                groups: payload.groups,
              },
            };

      await $api(`/tournaments/${tournamentId}/setup-stages`, {
        method: "POST",
        body,
      });
      await refreshAppData(appKeys.tournament(tournamentId));
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
