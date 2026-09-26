<template>
  <UDrawer
    v-model:open="open"
    direction="left"
    :handle="false"
    :ui="{
      content:
        'max-w-[min(100vw-1rem,100rem)] w-full border-gray-200/90 dark:border-gray-800 sm:max-w-2xl',
      body: 'flex flex-col min-h-0 overflow-y-auto p-0',
      header:
        'border-b border-gray-200/90 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40',
      footer:
        'border-t border-gray-200/90 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-950/50',
    }"
  >
    <template #header>
      <div class="space-y-1 p-2 text-start">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          إعدادات لعبة المستويات
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          تعديل إعدادات اللعبة حسب مستوى المباريات في المرحلة
        </p>
      </div>
    </template>

    <template #body>
      <div class="flex min-h-0 flex-col px-4 py-4">
        <div
          v-if="isLoading"
          class="flex items-center justify-center gap-2 py-12 text-sm text-gray-500"
        >
          <UIcon name="i-mdi-loading" class="size-5 animate-spin text-primary" />
          جاري تحميل إعدادات المستويات…
        </div>

        <UAlert
          v-else-if="loadError"
          color="error"
          variant="soft"
          title="تعذر تحميل إعدادات المستويات"
          class="mb-4"
        />

        <UAlert
          v-else-if="!levels.length"
          color="neutral"
          variant="soft"
          title="لا توجد مستويات"
          description="لا توجد إعدادات مستويات لهذه المرحلة حالياً."
          class="mb-4"
        />

        <UForm
          v-else
          ref="form"
          :schema="schema"
          :state="formState"
          class="flex flex-col gap-6"
        >
          <UFormField label="المستوى" name="level" required>
            <USelect
              v-model="selectedLevel"
              :items="levelOptions"
              value-key="value"
              label-key="label"
              class="w-full"
              placeholder="اختر المستوى"
            />
          </UFormField>

          <div
            class="space-y-4 rounded-2xl border border-gray-200/90 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/35"
          >
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              إعدادات اللعبة
            </h3>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UFormField name="gameSettings.isFlipped">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">معكوس</label>
                  <USwitch v-model="formState.gameSettings.isFlipped" size="lg" />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isAdvancedRecording">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">تسجيل متقدم</label>
                  <USwitch
                    v-model="formState.gameSettings.isAdvancedRecording"
                    size="lg"
                  />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isSakkahMashdodahMode">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">وضع صكة مشدودة</label>
                  <USwitch
                    v-model="formState.gameSettings.isSakkahMashdodahMode"
                  />
                </div>
              </UFormField>

              <UFormField name="gameSettings.showWhoWonDialogOnDraw">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">عرض من فاز عند التعادل</label>
                  <USwitch
                    v-model="formState.gameSettings.showWhoWonDialogOnDraw"
                  />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isNumbersSoundEnabled">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">صوت الأرقام</label>
                  <USwitch
                    v-model="formState.gameSettings.isNumbersSoundEnabled"
                  />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isCommentsSoundEnabled">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">صوت التعليقات</label>
                  <USwitch
                    v-model="formState.gameSettings.isCommentsSoundEnabled"
                  />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isEkakShown">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">إظهار الإكاك</label>
                  <USwitch v-model="formState.gameSettings.isEkakShown" />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isAklatShown">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">إظهار الأكلات</label>
                  <USwitch v-model="formState.gameSettings.isAklatShown" />
                </div>
              </UFormField>

              <UFormField name="gameSettings.isVoiceRecording">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">تسجيل صوتي</label>
                  <USwitch v-model="formState.gameSettings.isVoiceRecording" />
                </div>
              </UFormField>

              <UFormField
                name="gameSettings.sakkasCount"
                label="عدد الصكات"
                class="sm:col-span-2"
              >
                <USelect
                  v-model="formState.gameSettings.sakkasCount"
                  :items="sakkasCountOptions"
                  value-key="value"
                  label-key="label"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <UButton
          color="neutral"
          variant="soft"
          label="إلغاء"
          class="min-h-10"
          :disabled="isSaving"
          @click="open = false"
        />
        <UButton
          color="primary"
          icon="i-mdi-content-save-outline"
          label="حفظ الإعدادات"
          class="min-h-10"
          :loading="isSaving"
          :disabled="isSaving || isLoading || selectedLevel == null"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { boolean, number, object } from "yup";
import type { DefaultGameSettings } from "~/features/tournament/models/group";
import { useStageLevelGameSettings } from "~/features/tournament/group/composables/useStageLevelGameSettings";

const props = defineProps<{
  tourId: string;
  stageId: string;
}>();

const emit = defineEmits<{
  (e: "updated"): void;
}>();

const open = ref(false);
const toast = useToast();

const defaultGameSettings = (): DefaultGameSettings => ({
  isFlipped: false,
  isAdvancedRecording: true,
  isSakkahMashdodahMode: false,
  showWhoWonDialogOnDraw: true,
  isNumbersSoundEnabled: false,
  isCommentsSoundEnabled: false,
  isEkakShown: false,
  isAklatShown: false,
  sakkasCount: 1,
  isVoiceRecording: false,
});

const selectedLevel = ref<number | null>(null);
const formState = ref({
  gameSettings: defaultGameSettings(),
});

const sakkasCountOptions = Array.from({ length: 15 }, (_, i) => {
  const value = i + 1;
  return {
    label: value === 1 ? "1 صكة" : `${value} صكات`,
    value,
  };
});

const schema = object({
  gameSettings: object({
    isFlipped: boolean(),
    isAdvancedRecording: boolean(),
    isSakkahMashdodahMode: boolean(),
    showWhoWonDialogOnDraw: boolean(),
    isNumbersSoundEnabled: boolean(),
    isCommentsSoundEnabled: boolean(),
    isEkakShown: boolean(),
    isAklatShown: boolean(),
    sakkasCount: number().min(1).max(15).required(),
    isVoiceRecording: boolean(),
  }),
});

const form = useTemplateRef("form");
const api = useStageLevelGameSettings();
const getLevelsREQ = api.getLevelsGameSettings();
const updateLevelREQ = api.updateLevelGameSettings();

const isLoading = computed(() => getLevelsREQ.status.value === "pending");
const loadError = computed(() => getLevelsREQ.status.value === "error");
const isSaving = computed(() => updateLevelREQ.status.value === "pending");
const levels = computed(() => getLevelsREQ.data.value ?? []);

const levelOptions = computed(() =>
  levels.value
    .slice()
    .sort((a, b) => a.level - b.level)
    .map((item) => ({
      label: `المستوى ${item.level}`,
      value: item.level,
    })),
);

function applySettingsForLevel(level: number | null) {
  if (level == null) {
    formState.value.gameSettings = defaultGameSettings();
    return;
  }
  const fromApi = levels.value.find((item) => item.level === level);
  formState.value.gameSettings = {
    ...(fromApi?.gameSettings ?? defaultGameSettings()),
  };
}

async function loadLevels() {
  if (!props.tourId || !props.stageId) {
    selectedLevel.value = null;
    formState.value.gameSettings = defaultGameSettings();
    return;
  }

  await getLevelsREQ.fetchREQ(props.tourId, props.stageId);

  const first = levels.value.slice().sort((a, b) => a.level - b.level)[0];
  selectedLevel.value = first?.level ?? null;
  applySettingsForLevel(selectedLevel.value);
}

watch(selectedLevel, (level) => {
  applySettingsForLevel(level);
});

watch(open, async (isOpen) => {
  if (!isOpen) return;
  await loadLevels();
});

const handleSubmit = async () => {
  try {
    await form.value?.validate();

    if (!props.tourId || !props.stageId || selectedLevel.value == null) {
      toast.add({
        title: "خطأ",
        description: "اختر مستوى لتحديث إعداداته",
        color: "error",
      });
      return;
    }

    await updateLevelREQ.fetchREQ(
      props.tourId,
      props.stageId,
      selectedLevel.value,
      { ...formState.value.gameSettings },
    );

    if (updateLevelREQ.status.value === "success") {
      toast.add({
        title: "نجح التحديث",
        description: `تم تحديث إعدادات المستوى ${selectedLevel.value}`,
        color: "success",
      });
      open.value = false;
      emit("updated");
      return;
    }

    toast.add({
      title: "خطأ في التحديث",
      description:
        updateLevelREQ.error.value?.message ||
        "حدث خطأ أثناء تحديث إعدادات المستوى",
      color: "error",
    });
  } catch (error) {
    console.error("Validation error:", error);
    toast.add({
      title: "خطأ في التحقق",
      description: "يرجى التحقق من البيانات المدخلة",
      color: "error",
    });
  }
};

defineExpose({
  open,
});
</script>
