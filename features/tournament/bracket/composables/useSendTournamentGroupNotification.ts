import type { ApiResponse } from "~/composables/useAppData";
import type { GroupNotificationActionType } from "~/features/tournament/bracket/constants/groupNotification";

export type SendTournamentGroupNotificationPayload = {
  title: string;
  description: string;
  actionPath: string;
  actionType: GroupNotificationActionType;
  templateValues?: Record<string, string>;
  popUpImage?: File | null;
};

export function useSendTournamentGroupNotification() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();
  const recipientCount = ref<number | null>(null);

  const fetchREQ = async (
    tournamentId: string,
    groupId: string,
    payload: SendTournamentGroupNotificationPayload,
  ) => {
    recipientCount.value = null;
    await execute(async () => {
      const body = new FormData();
      body.append("title", payload.title);
      body.append("description", payload.description);
      body.append("actionPath", payload.actionPath);
      body.append("actionType", payload.actionType);

      if (payload.popUpImage instanceof File) {
        body.append("popUpImage", payload.popUpImage);
      }

      for (const [key, value] of Object.entries(payload.templateValues ?? {})) {
        if (!value.trim()) continue;
        body.append(`templateValues[${key}]`, value);
      }

      const response = await $api<ApiResponse<number>>(
        `/tournaments/${tournamentId}/groups/${groupId}/notifications`,
        {
          method: "POST",
          body,
        },
      );

      recipientCount.value = response.data ?? 0;
    });
  };

  return { pending, status, error, recipientCount, fetchREQ };
}
