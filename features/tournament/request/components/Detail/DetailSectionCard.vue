<template>
  <UCard
    :ui="{
      body: 'px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
    }"
    class="bg-gray-50/80 dark:bg-gray-900/80"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" class="size-5 text-primary-600 dark:text-primary-400" />
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
          <p v-if="description" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
      </div>
    </template>

    <div v-if="emptyMessage && isEmpty" class="py-2">
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ emptyMessage }}</p>
    </div>
    <slot v-else />
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
  description?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
}>();
</script>
