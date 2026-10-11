<template>
  <ClientOnly>
    <div ref="rootRef" class="relative w-full">
      <UInput
        ref="inputRef"
        :model-value="displayValue"
        readonly
        :disabled="disabled"
        class="cursor-pointer"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        @keydown.space.prevent="openPicker"
      />

      <Teleport to="body">
        <div
          v-if="isOpen"
          class="async-date-picker-layer"
          @mousedown.stop
          @pointerdown.stop
          @click.stop
        >
          <div
            class="async-date-picker-backdrop"
            aria-hidden="true"
            @pointerdown.prevent="closePicker"
          />
          <div
            ref="panelRef"
            class="async-date-picker-panel"
            role="dialog"
            aria-modal="true"
            :style="panelStyle"
            tabindex="-1"
            @mousedown.stop
            @pointerdown.stop
          >
            <VDatePicker
              v-bind="$attrs"
              v-model="internalDate"
              dir="ltr"
              :is-dark="isDark"
              :mode="enableTime ? 'dateTime' : 'date'"
              :popover="false"
              is24hr
            />
          </div>
        </div>
      </Teleport>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

defineOptions({ inheritAttrs: false });

const VDatePicker = defineAsyncComponent(() =>
  import("v-calendar").then((m) => {
    import("v-calendar/style.css");
    return m.DatePicker;
  }),
);

const colorMode = useColorMode();

const props = withDefaults(
  defineProps<{
    enableTime?: boolean;
    disabled?: boolean;
    /** Prefer opening above or below the input */
    placement?: "top" | "bottom";
  }>(),
  {
    enableTime: true,
    placement: "top",
  },
);

const isDark = computed(() => colorMode.value === "dark");

const model = defineModel<string | Date | null>();

const emit = defineEmits<{
  "update:modelValue": [value: string | Date | null];
  change: [value: Date | null];
  input: [value: Date | null];
}>();

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const panelStyle = ref<Record<string, string>>({});

const selectedDate = computed<Date | null>(() => {
  if (!model.value) return null;
  return model.value instanceof Date
    ? model.value
    : new Date(model.value as string);
});

const displayValue = computed(() => {
  const date = selectedDate.value;
  if (!date || Number.isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  if (!props.enableTime) return `${dd}/${mm}/${yyyy}`;

  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
});

const internalDate = computed<Date | null>({
  get: () => selectedDate.value,
  set: (value) => {
    if (value) {
      model.value = value.toISOString() as any;
      emit("change", value);
      emit("input", value);
      if (!props.enableTime) closePicker();
      return;
    }
    model.value = null as any;
    emit("change", null);
    emit("input", null);
  },
});

function updatePanelPosition() {
  const anchor = rootRef.value;
  if (!anchor) return;

  const rect = anchor.getBoundingClientRect();
  const panelWidth = panelRef.value?.offsetWidth ?? 320;
  const panelHeight = panelRef.value?.offsetHeight ?? 360;
  const gap = 4;

  const left = Math.min(
    Math.max(8, rect.left),
    Math.max(8, window.innerWidth - panelWidth - 8),
  );

  const top =
    props.placement === "bottom"
      ? rect.bottom + gap
      : Math.max(8, rect.top - panelHeight - gap);

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
}

async function openPicker() {
  if (props.disabled) return;
  isOpen.value = true;
  await nextTick();
  updatePanelPosition();
  // Async calendar + fonts can change size after first paint
  requestAnimationFrame(() => {
    updatePanelPosition();
    panelRef.value?.focus({ preventScroll: true });
    requestAnimationFrame(() => updatePanelPosition());
  });
}

function closePicker() {
  isOpen.value = false;
}

function onWindowChange() {
  if (isOpen.value) updatePanelPosition();
}

watch(isOpen, (open) => {
  if (!import.meta.client) return;
  if (open) {
    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);
  } else {
    window.removeEventListener("resize", onWindowChange);
    window.removeEventListener("scroll", onWindowChange, true);
  }
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  window.removeEventListener("resize", onWindowChange);
  window.removeEventListener("scroll", onWindowChange, true);
});
</script>

<style>
/* Modal drawers set pointer-events:none on body — force the layer to receive clicks */
.async-date-picker-layer {
  position: fixed;
  inset: 0;
  z-index: 100000;
  pointer-events: auto;
}

.async-date-picker-backdrop {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: auto;
}

.async-date-picker-panel {
  position: fixed;
  z-index: 100001;
  pointer-events: auto;
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235);
  background: white;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.async-date-picker-panel:focus {
  outline: none;
}

.dark .async-date-picker-panel {
  border-color: rgb(55 65 81);
  background: rgb(17 24 39);
}
</style>
