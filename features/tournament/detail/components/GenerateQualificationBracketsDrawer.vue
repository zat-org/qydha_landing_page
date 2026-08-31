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
          {{ isRegenerate ? "إعادة إنشاء مباريات التصفيات" : "توليد مباريات مرحلة التصفيات" }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          اختر فترة اللعبة وإعدادات اللعب لمجموعات التصفيات. يتم استخدام جميع طاولات الأماكن تلقائياً.
        </p>
      </div>
    </template>

    <template #body>
      <div class="flex min-h-0 flex-col px-4 py-4">
        <UForm
          ref="form"
          :schema="schema"
          :state="formState"
          class="flex flex-col gap-6"
        >
          <!-- فترة اللعبة -->
          <UFormField label="فترة اللعبة" name="defaultGameInterval" required>
            <div
              class="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200/90 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div class="flex flex-col gap-1">
                <label
                  class="text-xs font-medium text-gray-500 dark:text-gray-400"
                  for="durationHoursQual"
                >
                  ساعات
                </label>
                <UInput
                  id="durationHoursQual"
                  v-model.number="durationHours"
                  type="number"
                  placeholder="0"
                  :min="0"
                  :max="23"
                  class="w-20"
                  @update:model-value="updateDuration"
                />
              </div>
              <span class="pb-2 text-lg font-light text-gray-400">:</span>
              <div class="flex flex-col gap-1">
                <label
                  class="text-xs font-medium text-gray-500 dark:text-gray-400"
                  for="durationMinutesQual"
                >
                  دقائق
                </label>
                <UInput
                  id="durationMinutesQual"
                  v-model.number="durationMinutes"
                  type="number"
                  placeholder="0"
                  :min="0"
                  :max="59"
                  class="w-20"
                  @update:model-value="updateDuration"
                />
              </div>
              <div
                class="ms-auto rounded-lg bg-white px-3 py-2 text-sm font-mono text-gray-800 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
              >
                {{ formState.defaultGameInterval || "00:30:00" }}
              </div>
            </div>
          </UFormField>

          <!-- إعدادات اللعبة -->
          <div
            class="space-y-4 rounded-2xl border border-gray-200/90 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/35"
          >
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              إعدادات اللعبة الافتراضية
            </h3>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UFormField name="defaultGameSettings.isFlipped">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">معكوس</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isFlipped"
                    size="lg"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isAdvancedRecording">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">تسجيل متقدم</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isAdvancedRecording"
                    size="lg"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isSakkahMashdodahMode">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">وضع صكة مشدودة</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isSakkahMashdodahMode"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.showWhoWonDialogOnDraw">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">عرض من فاز عند التعادل</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.showWhoWonDialogOnDraw"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isNumbersSoundEnabled">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">صوت الأرقام</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isNumbersSoundEnabled"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isCommentsSoundEnabled">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">صوت التعليقات</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isCommentsSoundEnabled"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isEkakShown">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">عرض الإكك</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isEkakShown"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isAklatShown">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">عرض الأكلات</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isAklatShown"
                  />
                </div>
              </UFormField>

              <UFormField name="defaultGameSettings.isVoiceRecording">
                <div
                  class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <label class="text-sm font-medium">تسجيل صوتي</label>
                  <USwitch
                    v-model="formState.defaultGameSettings.isVoiceRecording"
                  />
                </div>
              </UFormField>

              <UFormField
                label="عدد الصكات"
                name="defaultGameSettings.sakkasCount"
                class="sm:col-span-2"
              >
                <USelect
                  v-model="formState.defaultGameSettings.sakkasCount"
                  :items="sakkasCountOptions"
                  placeholder="اختر عدد الصكات"
                  class="w-full max-w-xs"
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
          @click="open = false"
        />
        <UButton
          color="primary"
          icon="i-mdi-content-save-outline"
          :label="isRegenerate ? 'إعادة التوليد' : 'توليد المباريات'"
          class="min-h-10"
          :loading="pending"
          :disabled="pending"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { object, string, boolean, number } from "yup";
import type { GenerateQualificationBracketsPayload } from "~/features/tournament/models/group";
import { useQualificationStage } from "~/features/tournament/detail/composables/api/useQualificationStage";

const props = defineProps<{
  tournamentId: string;
  isRegenerate?: boolean;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = ref(false);
const form = useTemplateRef<HTMLFormElement>("form");
const toast = useToast();

const durationHours = ref(0);
const durationMinutes = ref(30);

const parseDuration = (duration: string) => {
  if (!duration || !/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
    return { hours: 0, minutes: 30 };
  }
  const p = duration.split(":").map(Number);
  return { hours: p[0] ?? 0, minutes: p[1] ?? 30 };
};

const updateDuration = () => {
  const h = String(durationHours.value || 0).padStart(2, "0");
  const m = String(durationMinutes.value || 0).padStart(2, "0");
  formState.value.defaultGameInterval = `${h}:${m}:00`;
};

const sakkasCountOptions = [
  { label: "1 صكة", value: 1 },
  { label: "3 صكات", value: 3 },
  { label: "5 صكات", value: 5 },
  { label: "7 صكات", value: 7 },
  { label: "9 صكات", value: 9 },
];

const formState = ref<GenerateQualificationBracketsPayload>({
  defaultGameInterval: "00:30:00",
  defaultGameSettings: {
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
  },
});

const schema = object({
  defaultGameInterval: string()
    .matches(/^\d{2}:\d{2}:\d{2}$/, "يجب أن تكون الفترة بصيغة hh:mm:ss")
    .test(
      "greater-than-zero",
      "يجب أن تكون فترة اللعبة أكبر من صفر",
      (val) => val !== "00:00:00",
    ),
  defaultGameSettings: object({
    isFlipped: boolean(),
    isAdvancedRecording: boolean(),
    isSakkahMashdodahMode: boolean(),
    showWhoWonDialogOnDraw: boolean(),
    isNumbersSoundEnabled: boolean(),
    isCommentsSoundEnabled: boolean(),
    isEkakShown: boolean(),
    isAklatShown: boolean(),
    sakkasCount: number()
      .min(1)
      .max(15)
      .test("is-odd", "يجب أن يكون عدد الصكات فردياً", (val) =>
        val ? val % 2 === 1 : false,
      ),
    isVoiceRecording: boolean(),
  }),
});

watch(open, (isOpen) => {
  if (!isOpen) return;
  const parsed = parseDuration(formState.value.defaultGameInterval);
  durationHours.value = parsed.hours;
  durationMinutes.value = parsed.minutes;
});

const qualStageApi = useQualificationStage();
const generateReq = qualStageApi.generateBrackets();
const pending = computed(() => generateReq.status.value === "pending");

const handleSubmit = async () => {
  try {
    await form.value?.validate();
    await generateReq.fetchREQ(props.tournamentId, formState.value);
    if (generateReq.status.value === "success") {
      toast.add({
        title: "تم توليد مباريات التصفيات بنجاح",
        color: "success",
      });
      emit("success");
      open.value = false;
    } else {
      const err = generateReq.error.value as { message?: string } | null;
      toast.add({
        title: "خطأ في توليد مباريات التصفيات",
        description: err?.message,
        color: "error",
      });
    }
  } catch {
    /* validation failed */
  }
};

defineExpose({
  open,
});
</script>
