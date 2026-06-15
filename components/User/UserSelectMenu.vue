<template>
  <USelectMenu
    v-if="remoteSearch"
    v-bind="$attrs"
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    clear-search-on-close
    v-model="model"
    v-model:search-term="searchTerm"
    :loading="loading"
    :items="mergedItems"
    :label-key="labelKey"
    :value-key="valueKey"
    searchable
    ignore-filter
    :placeholder="placeholder"
    :ui="{ viewport: viewportUiClass }"
    @update:open="onMenuOpenChange"
  >
    <template #content-bottom>
      <div
        v-if="loadingMore"
        class="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400"
      >
        جاري تحميل المزيد...
      </div>
    </template>
  </USelectMenu>
  <UInput v-else v-model="model" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { computed, nextTick, toRef } from "vue";
import type { User } from "~/models/user";

defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    /** When true: searchable remote user list (admin). When false: plain text input. */
    remoteSearch: boolean;
    placeholder?: string;
    labelKey?: keyof User;
    valueKey?: keyof User;
    /** API `Role` filter for `/users` (default `"User"`). */
    roleFilter?: string;
    /** Merged before remote results (e.g. current owner so the selected id always has a label). */
    extraItems?: User[];
  }>(),
  {
    placeholder: "ابحث عن مستخدم...",
    labelKey: "username",
    valueKey: "username",
    roleFilter: "User",
  },
);

const {
  searchTerm,
  items,
  loading,
  loadingMore,
  hasNext,
  loadMore,
} = await useUserSearchSelect(toRef(props, "remoteSearch"), {
  roleFilter: toRef(props, "roleFilter"),
});

const mergedItems = computed(() => {
  const extra = props.extraItems ?? [];
  const base = items.value;
  const seen = new Set(base.map((u) => u.id));
  return [...extra.filter((u) => u?.id && !seen.has(u.id)), ...base];
});

/** Unique class on the dropdown list viewport (not the trigger input). */
const viewportMarker = `user-select-viewport-${Math.random().toString(36).slice(2, 10)}`;
const viewportUiClass = `max-h-[200px] overflow-y-auto ${viewportMarker}`;

const menuOpen = ref(false);
const scrollEl = ref<HTMLElement | null>(null);

async function onMenuOpenChange(open: boolean) {
  menuOpen.value = open;

  if (!open) {
    scrollEl.value = null;
    return;
  }

  await nextTick();
  scrollEl.value = document.querySelector<HTMLElement>(`.${viewportMarker}`);
}

useInfiniteScroll(
  () => scrollEl.value,
  () => {
    void loadMore();
  },
  {
    distance: 48,
    canLoadMore: () =>
      menuOpen.value
      && hasNext.value
      && !loadingMore.value
      && !loading.value,
  },
);
</script>
