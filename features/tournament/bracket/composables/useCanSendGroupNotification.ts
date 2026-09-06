import { Privilege } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";

export function useCanSendGroupNotification() {
  const authStore = useMyAuthStore();
  const tourStore = useTournamentBracketStore();

  const canSend = computed(() => {
    if (!authStore.user) return false;
    if (authStore.isAdmin) return true;
    if (authStore.privilege === Privilege.Owner) return true;
    if (authStore.permissions.includes("SendMessage")) return true;
    return Boolean(tourStore.selectedGroup?.data.isRequesterPlaceModerator);
  });

  return { canSend };
}
