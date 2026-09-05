<template>
  <span :class="chipClass">
    <UIcon v-if="icon" :name="icon" class="size-3.5 shrink-0 opacity-80" />
    <span>{{ label }}</span>
    <span v-if="value !== undefined" :class="valueClass">
      {{ value }}
    </span>
  </span>
</template>

<script lang="ts" setup>
export type LifecycleStatChipColor =
  | "neutral"
  | "primary"
  | "warning"
  | "info"
  | "success"
  | "error";

const props = withDefaults(
  defineProps<{
    label: string;
    value?: string | number;
    icon?: string;
    color?: LifecycleStatChipColor;
  }>(),
  { color: "neutral" },
);

const tone: Record<
  LifecycleStatChipColor,
  { chip: string; value: string }
> = {
  neutral: {
    chip: "border-gray-200/80 bg-white/80 text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200",
    value: "text-gray-900 dark:text-white",
  },
  primary: {
    chip: "border-primary/30 bg-primary/10 text-primary",
    value: "text-primary",
  },
  warning: {
    chip: "border-warning/30 bg-warning/10 text-warning",
    value: "text-warning",
  },
  info: {
    chip: "border-info/30 bg-info/10 text-info",
    value: "text-info",
  },
  success: {
    chip: "border-success/30 bg-success/10 text-success",
    value: "text-success",
  },
  error: {
    chip: "border-error/30 bg-error/10 text-error",
    value: "text-error",
  },
};

const chipClass = computed(
  () =>
    `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${tone[props.color].chip}`,
);

const valueClass = computed(
  () => `font-semibold ${tone[props.color].value}`,
);
</script>
