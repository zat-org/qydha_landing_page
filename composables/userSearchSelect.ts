import { refDebounced } from "@vueuse/core";
import type { User } from "~/models/user";
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";

/**
 * Debounced user search backed by useUsers().getAllUsers().
 * When `enabled` is false, no network requests are made.
 */
export async function useUserSearchSelect(enabled: MaybeRefOrGetter<boolean>) {
  const getusers = await useUsers().getAllUsers();
  const searchTerm = ref("");
  const searchTermDebounced = refDebounced(searchTerm, 500);

  const items = computed<User[]>(() => getusers.data.value?.data.items ?? []);
  const loading = computed(() => getusers.status.value === "pending");

  watch(
    [() => toValue(enabled), searchTermDebounced],
    async ([isEnabled, q]) => {
      if (!isEnabled) return;
      await getusers.fetchREQ(q ?? "");
    },
    { immediate: true }
  );

  return {
    searchTerm,
    items,
    loading,
  };
}
