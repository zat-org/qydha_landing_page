<template>
  <UInput
    v-bind="$attrs"
    :model-value="displayValue"
    :disabled="disabled"
    :placeholder="placeholder"
    :size="size"
    inputmode="decimal"
    dir="rtl"
    class="text-right"
    @focus="focused = true"
    @blur="onBlur"
    @update:model-value="onInput"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    placeholder?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    min?: number;
    integer?: boolean;
  }>(),
  { integer: false },
);

const emit = defineEmits<{
  blur: [];
}>();
const model = defineModel<number | null | undefined>({ default: 0 });
const focused = ref(false);
const draft = ref("");

const formatThousands = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  const [intPart, decPart] = String(value).split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const digits = intPart.replace("-", "");
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decPart != null && !props.integer) return `${sign}${grouped}.${decPart}`;
  return `${sign}${grouped}`;
};

const parseThousands = (raw: string) => {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const n = props.integer ? Number.parseInt(cleaned, 10) : Number(cleaned);
  if (!Number.isFinite(n)) return null;
  if (props.min != null && n < props.min) return props.min;
  return n;
};

const displayValue = computed(() => {
  if (focused.value) return draft.value;
  return formatThousands(model.value ?? 0);
});

watch(
  () => model.value,
  (value) => {
    if (!focused.value) draft.value = formatThousands(value ?? 0);
  },
  { immediate: true },
);

const onInput = (raw: string | number) => {
  const text = String(raw ?? "");
  draft.value = text;
  const parsed = parseThousands(text);
  if (parsed === null && (text === "" || text === "-")) {
    model.value = props.min ?? 0;
    return;
  }
  if (parsed !== null) model.value = parsed;
};

const onBlur = () => {
  focused.value = false;
  const parsed = parseThousands(draft.value);
  model.value = parsed ?? props.min ?? 0;
  draft.value = formatThousands(model.value);
  emit("blur");
};
</script>
