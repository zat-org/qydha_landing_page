<template>
  <div class="space-y-4">
    <h3
      v-if="heading"
      class="text-base font-semibold text-gray-800 dark:text-gray-100"
    >
      {{ heading }}
    </h3>
    <p
      v-if="description"
      class="text-sm leading-relaxed text-gray-600 dark:text-gray-300"
    >
      {{ description }}
    </p>
    <UAlert
      v-if="alert"
      :color="alert.color"
      variant="subtle"
      :title="alert.title"
      :description="alert.description"
    />
    <div
      v-if="$slots.default"
      class="flex flex-col flex-wrap gap-3 sm:flex-row"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  heading?: string;
  description?: string;
  alert?: {
    color: "info" | "success" | "warning" | "neutral";
    title: string;
    description?: string;
  };
}>();
</script>
