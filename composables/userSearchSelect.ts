import { refDebounced } from "@vueuse/core";
import type { User } from "~/models/user";
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";

export type UseUserSearchSelectOptions = {
  /** Passed to `/users` as `Role` (defaults to `"User"`). */
  roleFilter?: MaybeRefOrGetter<string>;
};

/**
 * Debounced user search backed by useUsers().getAllUsers().
 * Accumulates pages when loading more; resets on new search or role change.
 */
export async function useUserSearchSelect(
  enabled: MaybeRefOrGetter<boolean>,
  options?: UseUserSearchSelectOptions,
) {
  const getusers = await useUsers().getAllUsers();
  const searchTerm = ref("");
  const searchTermDebounced = refDebounced(searchTerm, 500);

  const accumulatedItems = ref<User[]>([]);
  const currentPage = ref(1);
  const hasNext = ref(false);
  const loadingMore = ref(false);

  const loading = computed(() => getusers.status.value === "pending");

  async function fetchPage(page: number, append: boolean) {
    if (!toValue(enabled)) return;

    const role = toValue(options?.roleFilter) ?? "User";
    const q = searchTermDebounced.value ?? "";

    if (append) {
      loadingMore.value = true;
    }

    try {
      await getusers.fetchREQ(q, page, false, role);

      const data = getusers.data.value?.data;
      const newItems = data?.items ?? [];

      if (append) {
        const seen = new Set(accumulatedItems.value.map((u) => u.id));
        accumulatedItems.value = [
          ...accumulatedItems.value,
          ...newItems.filter((u) => !seen.has(u.id)),
        ];
      } else {
        accumulatedItems.value = newItems;
      }

      currentPage.value = data?.currentPage ?? page;
      hasNext.value = data?.hasNext ?? false;
    } finally {
      loadingMore.value = false;
    }
  }

  watch(
    [() => toValue(enabled), searchTermDebounced, () => toValue(options?.roleFilter)],
    async ([isEnabled]) => {
      if (!isEnabled) {
        accumulatedItems.value = [];
        currentPage.value = 1;
        hasNext.value = false;
        return;
      }
      await fetchPage(1, false);
    },
    { immediate: true },
  );

  async function loadMore() {
    if (!toValue(enabled) || loadingMore.value || loading.value || !hasNext.value) {
      return;
    }
    await fetchPage(currentPage.value + 1, true);
  }

  const items = computed<User[]>(() => accumulatedItems.value);

  return {
    searchTerm,
    items,
    loading,
    loadingMore,
    hasNext,
    loadMore,
  };
}
