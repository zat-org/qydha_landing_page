<template>
  <div v-if="getReq.status.value === 'pending'" class="flex justify-center py-16">
    <Loading />
  </div>
  <UCard
    v-else-if="getReq.status.value === 'success'"
    class="flex min-h-0 flex-col overflow-hidden shadow-none ring-0"
    :ui="cardUi"
  >
    <template #header>
      <div class="flex flex-col gap-1.5">
        <div class="flex flex-wrap items-center gap-1">
          <UButton
            to="/tournament"
            size="xs"
            icon="i-heroicons-arrow-left"
            variant="ghost"
            label="العودة"
          />
        </div>

        <div class="flex flex-col items-center gap-1 text-center">
          <p class="text-[11px] font-medium leading-tight text-primary-600 dark:text-primary-400">
            الخطوة {{ currentStepValue + 1 }} من {{ steps.length }} — {{ currentStep.title }}
          </p>
          <div class="flex w-full justify-center [&_[data-slot=title]]:text-xs">
            <UStepper
              v-model="currentStepValue"
              size="xs"
              :items="stepperItems"
              class="w-full max-w-2xl"
            />
          </div>
        </div>
      </div>
    </template>

    <div
      ref="scrollContainer"
      class="form-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 py-1 sm:px-4 sm:py-1"
    >
      <div class="mx-auto w-full max-w-7xl">
        <TournamentEditPanels
          v-model="formData"
          :current-step="currentStepValue"
          :errors="visibleErrors"
          :on-field-blur="onFieldBlur"
          :disabled-fields="disabledFields"
          :initial-logo-url="getReq.data.value?.tournament?.logoUrl"
          :owner="getReq.data.value?.tournament?.owner ?? null"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-start">
          {{ footerHint }}
        </p>
        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <UButton
            v-if="canGoBack"
            variant="outline"
            size="lg"
            label="السابق"
            icon="i-heroicons-arrow-right"
            class="min-w-28"
            @click="previousStep"
          />
          <UButton
            v-if="canGoNext"
            color="primary"
            size="lg"
            label="التالي"
            trailing-icon="i-heroicons-arrow-left"
            class="min-w-28 ms-auto"
            @click="validateAndNext"
          />
          <UButton
            v-else-if="isLastStep"
            color="primary"
            size="lg"
            label="حفظ التعديلات"
            icon="i-heroicons-paper-airplane"
            class="min-w-32 ms-auto"
            :loading="isSubmittingValue"
            @click="handelSubmit"
          />
        </div>
      </div>
    </template>
  </UCard>
  <UAlert
    v-else-if="getReq.status.value === 'error'"
    color="error"
    variant="soft"
    icon="i-heroicons-exclamation-triangle"
    class="m-4"
  >
    <template #title>خطأ في تحميل البيانات</template>
    <template #description>تعذر تحميل بيانات البطولة للتعديل</template>
  </UAlert>
</template>

<script setup lang="ts">
import { object, string, number, boolean, array, mixed } from 'yup';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { TournamentPrizeCurrency, TournamentPrizeType } from '~/features/tournament/models/tournamentPrize';
import { TournamentType } from '~/features/tournament/models/tournamenetType';
import { TournamentDetailedState, type TournamentUpdate } from '~/features/tournament/models/tournament';
import Loading from '~/components/loading.vue';
import TournamentEditPanels from '~/features/tournament/edit/components/TournamentEditForm/Panels.vue';

type TournamentEditForm = TournamentUpdate & {
  type: TournamentType;
};

const cardUi = {
  root: 'flex flex-col max-h-[calc(100dvh-6vh)] min-h-[min(640px,calc(100dvh-6vh))] overflow-hidden shadow-none ring-0 p-0',
  header: 'border-b border-gray-200/90 bg-white/95 px-2 py-1.5 backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-950/95 sm:px-3 sm:py-2',
  body: 'flex min-h-0 flex-1 flex-col p-0',
  footer: 'border-t border-gray-200/90 bg-white/95 px-3 py-3 backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-950/95 sm:px-5 sm:py-4',
};

const scrollContainer = useTemplateRef<HTMLDivElement>('scrollContainer');

const { getSingelTournament } = useSingleTournament();

const tournamentEditFreezeFieldKeys = [
  'title', 'description', 'logo', 'showInQydha', 'contactPhone', 'isContactPhoneCall', 'isContactPhoneWhatsapp',
  'locationDescription', 'location', 'type', 'tournamentPrivatePassword', 'sponsors', 'startAt', 'endAt',
  'prizes',
  'teamsCount', 'tablesCount', 'rules', 'ownerId',
] as const;

const route = useRoute();
const router = useRouter();
const id = route.params.id?.toString() ?? '';
const toast = useToast();
const updateReq = useTournamentEdit(id);
const { canUpdateTournament } = useTournamentEditLogic();

const formData = reactive<TournamentEditForm>({
  title: '',
  description: '',
  logo: undefined,
  remainingSponsorsUrls: [],
  contactPhone: '',
  isContactPhoneCall: true,
  isContactPhoneWhatsapp: false,
  sponsors: [],
  startAt: '',
  endAt: '',
  tournamentType: TournamentType.public,
  type: TournamentType.public,
  teamsCount: 16,
  tablesCount: 8,
  tournamentPrivatePassword: '',
  locationDescription: '',
  location: { latitude: 0, longitude: 0 },
  prizes: [{
    isFinancial: true,
    isNonFinancial: false,
    type: TournamentPrizeType.one,
    financialPrizeAmount: 100,
    financialPrizeCurrency: TournamentPrizeCurrency.SAR,
    nonFinancialPrizes: [],
  }],
  rules: [],
  ownerId: '',
});

const steps = [
  { id: 0, title: 'معلومات البطولة', slot: 'TourInfo', icon: 'i-heroicons-trophy' },
  { id: 1, title: 'تفاصيل البطولة', slot: 'TourDetail', icon: 'i-heroicons-clipboard-document-list' },
  { id: 2, title: 'قوانين البطولة', slot: 'TourRules', icon: 'i-heroicons-scale' },
];

const stepFieldMap: Record<number, string[]> = {
  0: ['title', 'description', 'logo', 'contactPhone', 'isContactPhoneCall', 'isContactPhoneWhatsapp', 'locationDescription', 'location', 'type', 'tournamentPrivatePassword', 'sponsors'],
  1: ['ownerId', 'startAt', 'endAt', 'prizes', 'teamsCount', 'tablesCount'],
  2: ['rules'],
};

const contactMethodMessage = 'يجب اختيار وسيلة تواصل واحدة على الأقل (واتساب أو اتصال)';

const editSchema = object({
  title: string().required('اسم البطولة مطلوب'),
  description: string(),
  logo: mixed(),
  ownerId: string().required('يجب اختيار منظم البطولة').trim().min(1, 'يجب اختيار منظم البطولة'),
  type: string().required('نوع البطولة مطلوب'),
  tournamentPrivatePassword: string().when('type', { is: TournamentType.private, then: (schema) => schema.required('رمز البطولة الخاصة مطلوب'), otherwise: (schema) => schema.notRequired() }),
  locationDescription: string().required('عنوان البطولة مطلوب'),
  location: object({ latitude: number(), longitude: number() }).test('location-selected', 'يرجى اختيار الموقع', (value) => !!value && value.latitude !== 0 && value.longitude !== 0),
  contactPhone: string().required('رقم للتواصل للاعبين مطلوب').min(10, 'رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام'),
  isContactPhoneCall: boolean().test('at-least-one-contact-method', contactMethodMessage, function () {
    const parent = this.parent as TournamentEditForm;
    return !!(parent.isContactPhoneWhatsapp || parent.isContactPhoneCall);
  }),
  isContactPhoneWhatsapp: boolean().test('at-least-one-contact-method', contactMethodMessage, function () {
    const parent = this.parent as TournamentEditForm;
    return !!(parent.isContactPhoneWhatsapp || parent.isContactPhoneCall);
  }),
  sponsors: array().of(mixed()),
  startAt: string().required('تاريخ بداية البطولة مطلوب'),
  endAt: string().required('تاريخ نهاية البطولة مطلوب'),
  prizes: array().min(1, 'يجب إضافة جائزة واحدة على الأقل'),
  teamsCount: number().typeError('عدد الفرق مطلوب').required('عدد الفرق مطلوب').min(2, 'يجب أن يكون عدد الفرق على الأقل 2'),
  tablesCount: number().typeError('عدد الطاولات مطلوب').required('عدد الطاولات مطلوب').min(1, 'يجب ادخال عدد الطاولات'),
  rules: array().of(string()),
});

const { validateField, setValues, setFieldError, errors } = useForm<TournamentEditForm>({
  validationSchema: toTypedSchema(editSchema),
  initialValues: formData,
});

watch(formData, (value) => setValues({ ...value }, false), { deep: true, immediate: true });

const currentStepValue = ref(0);

if (route.query.step === 'join') {
  currentStepValue.value = 1;
}

const completedSteps = ref<Set<number>>(new Set());
const touchedFields = ref<Set<string>>(new Set());
const attemptedSteps = ref<Set<number>>(new Set());

const currentStep = computed(() => steps[currentStepValue.value]!);

const fieldStepMap = computed(() => {
  const map = new Map<string, number>();
  Object.entries(stepFieldMap).forEach(([step, fields]) => {
    fields.forEach((field) => map.set(field, Number(step)));
  });
  return map;
});

const shouldShowFieldError = (field: string) => {
  const step = fieldStepMap.value.get(field);
  if (step === undefined) return true;
  return touchedFields.value.has(field) || attemptedSteps.value.has(step);
};

const visibleErrors = computed(() => {
  const result: Record<string, string> = {};
  Object.entries(errors.value).forEach(([field, message]) => {
    if (message && shouldShowFieldError(field)) result[field] = message;
  });
  return result;
});

const footerHint = computed(() => {
  if (isLastStep.value) return 'راجع البيانات ثم اضغط «حفظ التعديلات» لإتمام التحديث.';
  return 'أكمل الحقول المطلوبة ثم انتقل للخطوة التالية.';
});

const scrollToTop = async () => {
  await nextTick();
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToFirstInvalidField = async (fields: string[]) => {
  await nextTick();
  const container = scrollContainer.value;
  if (!container) return;

  for (const field of fields) {
    if (!errors.value[field as keyof typeof errors.value]) continue;
    const target =
      container.querySelector<HTMLElement>(`[name="${field}"]`) ??
      container.querySelector<HTMLElement>(`[data-field="${field}"]`) ??
      container.querySelector<HTMLElement>(`#${field}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
      return;
    }
  }
};

const onFieldBlur = async (field: string) => {
  touchedFields.value.add(field);
  await validateField(field as any);
};

const getReq = await getSingelTournament(id);
if (getReq.status.value === 'error') {
  toast.add({ title: 'حدث خطاء في جلب بينات البطوله ' });
  await navigateTo('/tournamnent');
}

const detailedStateEdit = computed(
  () => getReq.data.value?.tournament?.detailedState ?? TournamentDetailedState.Created,
);

const disabledFields = computed<Record<string, boolean>>(() => {
  const frozen = !canUpdateTournament(detailedStateEdit.value);
  if (frozen) {
    return Object.fromEntries(tournamentEditFreezeFieldKeys.map((k) => [k, true])) as Record<string, boolean>;
  }
  return {
    isAddPlayersByQydha: true,
    joinRequestStartAt: true,
  };
});

const assignData = () => {
  const data = getReq.data.value?.tournament ?? null;
  if (unref(getReq.status) !== 'success' || !data) return;

  formData.title = data.title;
  formData.description = data.description;
  formData.contactPhone = data.contactPhone;
  formData.isContactPhoneCall = data.isContactPhoneCall;
  formData.isContactPhoneWhatsapp = data.isContactPhoneWhatsapp;
  formData.startAt = data.startAt;
  formData.endAt = data.endAt;
  formData.tournamentType = data.tournamentType as TournamentType;
  formData.type = data.tournamentType as TournamentType;
  formData.teamsCount = data.expectedTeamsCount;
  formData.tablesCount = data.expectedTablesCount;
  formData.tournamentPrivatePassword = data.tournamentPrivatePassword ?? undefined;
  formData.locationDescription = data.locationDescription;
  formData.location = data.location;
  formData.prizes = data.prizes;
  formData.rules = data.tournamentRules ?? [];
  formData.remainingSponsorsUrls = data.sponsors;
  formData.ownerId = data.owner.id;
};

if (getReq.status.value === 'success') assignData();
watch(() => getReq.status.value, () => {
  if (getReq.status.value === 'success') assignData();
});

const validateCurrentStep = async () => {
  const fields = stepFieldMap[currentStepValue.value] ?? [];
  let isStepValid = true;
  for (const field of fields) {
    const result = await validateField(field as any);
    if (!result.valid) isStepValid = false;
  }
  return isStepValid;
};

const validateAndNext = async () => {
  const fields = stepFieldMap[currentStepValue.value] ?? [];
  const isValid = await validateCurrentStep();
  if (!isValid) {
    attemptedSteps.value.add(currentStepValue.value);
    await scrollToFirstInvalidField(fields);
    toast.add({ title: 'يرجى تصحيح أخطاء الخطوة الحالية', color: 'error' });
    return;
  }
  completedSteps.value.add(currentStepValue.value);
  if (currentStepValue.value < steps.length - 1) currentStepValue.value += 1;
};

const previousStep = () => {
  if (currentStepValue.value > 0) currentStepValue.value -= 1;
};

const getStepForField = (error: any): number => {
  if (!error || typeof error !== 'object') return 0;
  const step0Fields = new Set(stepFieldMap[0]);
  const step1Fields = new Set(stepFieldMap[1]);
  const step2Fields = new Set(stepFieldMap[2]);
  const errorKeys = Object.keys(error.errors ?? {});
  for (const key of errorKeys) {
    if (step0Fields.has(key)) return 0;
    if (step1Fields.has(key)) return 1;
    if (step2Fields.has(key)) return 2;
  }
  return 0;
};

const submitForm = async () => {
  const currentStepBeforeSubmit = currentStepValue.value;
  for (let idx = 0; idx < steps.length; idx++) {
    attemptedSteps.value.add(idx);
    const fields = stepFieldMap[idx] ?? [];
    let stepValid = true;
    for (const field of fields) {
      const result = await validateField(field as any);
      if (!result.valid) stepValid = false;
    }
    if (!stepValid) {
      currentStepValue.value = idx;
      await scrollToTop();
      await scrollToFirstInvalidField(fields);
      toast.add({ title: 'يرجى إكمال الحقول المطلوبة', color: 'error' });
      return;
    }
  }
  currentStepValue.value = currentStepBeforeSubmit;

  const payload: TournamentUpdate = {
    ...formData,
    tournamentType: formData.type,
  };

  await updateReq.fetchREQ(payload);
  if (updateReq.status.value === 'success') {
    router.back();
    return;
  }

  const apiData = (updateReq.error.value as any)?.data;
  const apiErrors = apiData?.errors as Record<string, string[]> | undefined;
  if (apiErrors) {
    for (const [key, value] of Object.entries(apiErrors)) {
      setFieldError(key as any, Array.isArray(value) ? value[0] : String(value));
    }
  }
  currentStepValue.value = getStepForField(apiData);
  await nextTick();
  const invalidFields = stepFieldMap[currentStepValue.value] ?? [];
  await scrollToFirstInvalidField(invalidFields);
  toast.add({ title: `خطاء في بيانات ${Object.keys(apiErrors ?? {}).join(', ')}`, color: 'error' });
};

const stepperItems = computed(() => steps.map((step, idx) => ({
  ...step,
  color: currentStepValue.value === idx ? 'primary' : completedSteps.value.has(idx) ? 'success' : 'neutral',
})));

watch(currentStepValue, () => {
  void scrollToTop();
});

const totalStepsValue = computed(() => steps.length);
const isSubmittingValue = computed(() => updateReq.pending.value);
const canGoBack = computed(() => currentStepValue.value >= 1);
const canGoNext = computed(() => currentStepValue.value < totalStepsValue.value - 1);
const isLastStep = computed(() => currentStepValue.value === totalStepsValue.value - 1);

const handelSubmit = () => {
  void submitForm();
};
</script>

<style scoped>
.form-scroll-area {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225 / 0.8) transparent;
}

.form-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.form-scroll-area::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(203 213 225 / 0.8);
}

.dark .form-scroll-area {
  scrollbar-color: rgb(71 85 105 / 0.8) transparent;
}

.dark .form-scroll-area::-webkit-scrollbar-thumb {
  background-color: rgb(71 85 105 / 0.8);
}
</style>
