import type { ApiResponse } from "~/composables/useAppData";
import type { GroupNotificationActionType } from "~/features/tournament/bracket/constants/groupNotification";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export type SendTournamentGroupNotificationPayload = {
  title: string;
  description: string;
  actionPath: string;
  actionType: GroupNotificationActionType;
  targetedGroupIds?: string[];
  popUpImage?: File | null;
};

export function useSendTournamentGroupNotification() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();
  const recipientCount = ref<number | null>(null);

  const fetchREQ = async (
    tournamentId: string,
    payload: SendTournamentGroupNotificationPayload,
  ) => {
    recipientCount.value = null;
    await execute(async () => {
      const body = new FormData();
      body.append("Title", payload.title);
      body.append("Description", payload.description);
      body.append("ActionPath", payload.actionPath);
      body.append("ActionType", payload.actionType);

      if (payload.popUpImage instanceof File) {
        body.append("PopUpImage", payload.popUpImage);
      }

      const groupIds = [
        ...new Set(
          (payload.targetedGroupIds ?? []).filter(
            (id) => id && id !== EMPTY_GUID,
          ),
        ),
      ];
      for (const id of groupIds) {
        body.append("TargetedGroupIds", id);
      }

      const response = await $api<ApiResponse<number>>(
        `/tournaments/${tournamentId}/groups/notifications`,
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
