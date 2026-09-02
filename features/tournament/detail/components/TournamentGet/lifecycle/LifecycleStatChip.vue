<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200"
  >
    <UIcon v-if="icon" :name="icon" class="size-3.5 shrink-0 opacity-70" />
    <span>{{ label }}</span>
    <span v-if="value !== undefined" class="font-semibold text-gray-900 dark:text-white">
      {{ value }}
    </span>
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  value?: string | number;
  icon?: string;
}>();
</script>
