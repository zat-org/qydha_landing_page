<template>
  <USelectMenu
    v-if="remoteSearch"
    ref="selectMenuRef"
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
    :placeholder="placeholder"
    @update:open="onMenuOpenChange"
  />
  <UInput v-else v-model="model" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, toRef } from "vue";
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
  }
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

const selectMenuRef = useTemplateRef<{ viewportRef?: HTMLElement | null }>("selectMenuRef");
const menuOpen = ref(false);
let scrollViewport: HTMLElement | null = null;
let removeScrollListener: (() => void) | null = null;

function resolveViewport(): HTMLElement | null {
  const exposed = selectMenuRef.value?.viewportRef;
  if (exposed instanceof HTMLElement) return exposed;

  const candidates = document.querySelectorAll<HTMLElement>(
    "[data-reka-combobox-viewport], [data-slot=\"viewport\"], [role=\"listbox\"]",
  );

  for (let i = candidates.length - 1; i >= 0; i--) {
    const el = candidates[i];
    if (el.offsetParent !== null) return el;
  }

  return null;
}

function onViewportScroll(event: Event) {
  const el = event.target as HTMLElement;
  if (el.scrollTop + el.clientHeight < el.scrollHeight - 48) return;
  if (!hasNext.value || loadingMore.value || loading.value) return;
  void loadMore();
}

function bindScrollListener() {
  removeScrollListener?.();
  scrollViewport = resolveViewport();
  if (!scrollViewport) return;

  scrollViewport.addEventListener("scroll", onViewportScroll, { passive: true });
  removeScrollListener = () => {
    scrollViewport?.removeEventListener("scroll", onViewportScroll);
    scrollViewport = null;
  };
}

async function onMenuOpenChange(open: boolean) {
  menuOpen.value = open;
  if (!open) {
    removeScrollListener?.();
    removeScrollListener = null;
    return;
  }

  await nextTick();
  bindScrollListener();

  if (!scrollViewport) {
    await nextTick();
    bindScrollListener();
  }
}

onUnmounted(() => {
  removeScrollListener?.();
});
</script>
