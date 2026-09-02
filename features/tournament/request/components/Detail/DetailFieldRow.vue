<template>
  <div
    class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700"
    :class="alignStart ? 'items-start' : 'items-center'"
  >
    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ label }}</span>
    <div class="text-sm text-gray-900 dark:text-gray-100" :class="valueClass">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  alignStart?: boolean;
  valueClass?: string;
}>();
</script>
