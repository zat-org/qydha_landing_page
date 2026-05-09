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
    :placeholder="placeholder"
  />
  <UInput v-else v-model="model" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
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

const { searchTerm, items, loading } = await useUserSearchSelect(toRef(props, "remoteSearch"), {
  roleFilter: toRef(props, "roleFilter"),
});

const mergedItems = computed(() => {
  const extra = props.extraItems ?? [];
  const base = items.value;
  const seen = new Set(base.map((u) => u.id));
  return [...extra.filter((u) => u?.id && !seen.has(u.id)), ...base];
});
</script>
