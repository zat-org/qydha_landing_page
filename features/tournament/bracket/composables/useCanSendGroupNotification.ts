import { useMyAuthStore } from "~/store/Auth";

export function useCanSendGroupNotification() {
  const authStore = useMyAuthStore();

  const canSend = computed(
    () =>
      Boolean(
        authStore.user && (authStore.isSuperAdmin || authStore.isStaffAdmin),
      ),
  );

  return { canSend };
}
