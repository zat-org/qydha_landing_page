<template>
    <UCard v-if="getReq.status.value == 'success'" :ui="{
        body: 'p-1 sm:p-1',
        header: 'p-1 sm:p-1',
        footer: 'p-1 sm:p-1',

    }">
        <template #header>
            <div class="flex justify-around  items-center w-full">
                <div class=" flex-1 flex  gap-2">
                    <UButton to="/tournament/request" size="sm" icon="i-heroicons-arrow-left" variant="ghost"
                        class="flex-1">
                        العودة
                    </UButton>
                    <UButton to="/tournament/request/info" size="sm" icon="i-heroicons-information-circle"
                        variant="ghost">
                        دليل انشاء البطولة
                    </UButton>
                </div>
                <UStepper size="sm" :items="stepperItems" class="flex-4 " v-model="currentStepValue" />

            </div>
        </template>

        <template #default>
            <div ref="scrollContainer" class=" h-[75vh] overflow-y-auto">
                    <KeepAlive>
                        <TournamentRequestUpdateTourForm
                          v-show="currentStepValue === 0"
                          v-model="formData"
                          :errors="visibleErrors"
                          :on-field-blur="onFieldBlur"
                        />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentRequestFormTourDetailForm
                          v-show="currentStepValue === 1"
                          v-model="formData"
                          :errors="visibleErrors"
                          :on-field-blur="onFieldBlur"
                        />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentRequestFormRulesForm
                          v-show="currentStepValue === 2"
                          v-model="formData"
                          :errors="visibleErrors"
                          :on-field-blur="onFieldBlur"
                        />
                    </KeepAlive>
            </div>

        </template>
        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton v-if="canGoBack" variant="outline" @click="previousStep" label="السابق" size="xl" />
                <UButton v-if="canGoNext" color="primary" @click="() => { void validateAndNext(); }" label="التالي"
                    size="xl" class="ms-auto" />
                <UButton v-else-if="isLastStep" color="primary" :loading="isSubmittingValue" @click="handelSubmit"
                    size="xl">
                    إرسال
                </UButton>
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
import { TournamentPrizeCurrency, TournamentPrizeType } from '~/features/tournament/models/tournamentPrize'
import { TournamentType } from '~/features/tournament/models/tournamenetType'
import { type UpdateTournamentCreationRequest } from '~/features/tournament/models/tournamentRequest';
import { useMyAuthStore } from '~/store/Auth';
import { TournamentPlayerJoinRequestType } from '~/features/tournament/models/tournamentRequest';
import { object, string, number, boolean, array, mixed } from "yup";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import TournamentRequestUpdateTourForm from '~/features/tournament/request/components/Update/TourForm.vue';
import TournamentRequestFormTourDetailForm from '~/features/tournament/request/components/Form/TourDetailForm/index.vue';
import TournamentRequestFormRulesForm from '~/features/tournament/request/components/Form/RulesForm.vue';

const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");
const toast = useToast();
const { updateTournamentRequest } = useTournamentRequest()

const authStore = useMyAuthStore()
const { AdminGetSingleTournamentRequest } = useTournamentRequest()
const route = useRoute()
const id = route.params.id.toString()
const apiFetch = computed(() => AdminGetSingleTournamentRequest)
const formData = reactive<UpdateTournamentCreationRequest>({
    title: "", description: "", logo: undefined, remainingSponsorsUrls: [], contactPhone: '',
    isContactPhoneCall: true, isContactPhoneWhatsapp: false, sponsors: [], startAt: '', endAt: '',
    type: TournamentType.public, isAddPlayersByQydha: false, teamsCount: 16, tablesCount: 8,
    tournamentPrivatePassword: "", locationDescription: "", location: { latitude: 0, longitude: 0 },
    prizes: [{ isFinancial: true, isNonFinancial: false, type: TournamentPrizeType.one, financialPrizeAmount: 100, financialPrizeCurrency: TournamentPrizeCurrency.SAR, nonFinancialPrizes: [] }],
    rules: [], allowedJoinRequestType: TournamentPlayerJoinRequestType.All, minimumSubscriptionDays: 0,
});
const assignData = () => {
    const data = getReq.data.value?.data ?? null
    if (unref(getReq.status) == 'success' && data) {
        formData.title = data.title; formData.description = data.description; formData.contactPhone = data.contactPhone;
        formData.isContactPhoneCall = data.isContactPhoneCall; formData.isContactPhoneWhatsapp = data.isContactPhoneWhatsapp;
        formData.startAt = data.startAt; formData.endAt = data.endAt; formData.type = data.type as TournamentType;
        formData.isAddPlayersByQydha = data.isAddPlayersByQydha; formData.teamsCount = data.teamsCount; formData.tablesCount = data.tablesCount;
        formData.tournamentPrivatePassword = data.tournamentPrivatePassword ?? undefined; formData.locationDescription = data.locationDescription;
        formData.location = data.location; formData.prizes = data.prizes; formData.rules = data.rules; formData.remainingSponsorsUrls = data.sponsorsUrls;
        formData.joinRequestEndAt = data.joinRequestEndAt; formData.joinRequestMaxCount = data.joinRequestMaxCount; formData.joinRequestStartAt = data.joinRequestStartAt;
        formData.allowedJoinRequestType = data.allowedJoinRequestType ?? TournamentPlayerJoinRequestType.All; formData.minimumSubscriptionDays = data.minimumSubscriptionDays;
    }
}
const getReq = await apiFetch.value(id)
if (getReq.status.value === 'success') assignData()
watch(getReq.status, (newValue) => { if (newValue == "success") assignData() })

const steps = [
    { id: 0, title: "معلومات البطولة", slot: "TourInfo", icon: "i-heroicons-trophy" },
    { id: 1, title: "تفاصيل البطولة", slot: "TourDetail", icon: "i-heroicons-clipboard-document-list" },
    { id: 2, title: "قوانين البطولة", slot: "TourRules", icon: "i-heroicons-scale" },
];
const stepFieldMap: Record<number, string[]> = {
    0: ['title', 'description', 'logo', 'contactPhone', 'isContactPhoneCall', 'isContactPhoneWhatsapp', 'locationDescription', 'location', 'type', 'tournamentPrivatePassword', 'sponsors', 'remainingSponsorsUrls'],
    1: ['startAt', 'endAt', 'joinRequestStartAt', 'joinRequestEndAt', 'joinRequestMaxCount', 'isAddPlayersByQydha', 'prizes', 'teamsCount', 'tablesCount', 'allowedJoinRequestType', 'minimumSubscriptionDays'],
    2: ['rules'],
};
const requestSchema = object({
    title: string().required("اسم البطولة مطلوب"),
    description: string(),
    logo: mixed(),
    type: string().required("نوع البطولة مطلوب"),
    tournamentPrivatePassword: string().when('type', { is: TournamentType.private, then: (schema) => schema.required("رمز البطولة الخاصة مطلوب"), otherwise: (schema) => schema.notRequired() }),
    locationDescription: string().required("عنوان البطولة مطلوب"),
    location: object({ latitude: number(), longitude: number() }).test('location-selected', 'يرجى اختيار الموقع', (value) => !!value && value.latitude !== 0 && value.longitude !== 0),
    contactPhone: string().required("رقم للتواصل للاعبين مطلوب").min(10, "رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام"),
    isContactPhoneCall: boolean(),
    isContactPhoneWhatsapp: boolean().test("at-least-one-contact-method", "يجب اختيار وسيلة تواصل واحدة على الأقل (واتساب أو اتصال)", function (value) {
        const parent = this.parent as UpdateTournamentCreationRequest;
        return value || parent.isContactPhoneCall;
    }),
    sponsors: array().of(mixed()),
    remainingSponsorsUrls: array().of(string()),
    isAddPlayersByQydha: boolean(),
    startAt: string().required("تاريخ بداية البطولة مطلوب"),
    endAt: string().required("تاريخ نهاية البطولة مطلوب"),
    joinRequestStartAt: string().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("تاريخ بداية تقديم طلبات الانضمام مطلوب"), otherwise: (schema) => schema.notRequired() }),
    joinRequestEndAt: string().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("تاريخ نهاية تقديم طلبات الانضمام مطلوب"), otherwise: (schema) => schema.notRequired() }),
    joinRequestMaxCount: number().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("عدد طلبات الانضمام المطلوب مطلوب"), otherwise: (schema) => schema.notRequired() }),
    prizes: array().min(1, "يجب إضافة جائزة واحدة على الأقل"),
    teamsCount: number().typeError("عدد الفرق مطلوب").required("عدد الفرق مطلوب").min(2, "يجب أن يكون عدد الفرق على الأقل 2"),
    tablesCount: number().typeError("عدد الطاولات مطلوب").required("عدد الطاولات مطلوب").min(1, "يجب ادخال عدد الطاولات"),
    rules: array().of(string()),
    allowedJoinRequestType: string().required("نوع طلبات الانضمام مطلوب"),

   minimumSubscriptionDays: number()
    .nullable()
    .when('isAddPlayersByQydha', {
      is: true,
      then: (schema) => schema.min(0, "الحد الأدنى يجب أن يكون 0 أو أكثر"),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
});
const { validateField, setValues, setFieldError, errors } = useForm<UpdateTournamentCreationRequest>({
    validationSchema: toTypedSchema(requestSchema),
    initialValues: formData,
});
watch(formData, (value) => {
    setValues({ ...value }, false);
}, { deep: true, immediate: true });
const currentStepValue = ref(0);
const completedSteps = ref<Set<number>>(new Set());
const touchedFields = ref<Set<string>>(new Set());
const attemptedSteps = ref<Set<number>>(new Set());

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
        if (message && shouldShowFieldError(field)) {
            result[field] = message;
        }
    });
    return result;
});

const onFieldBlur = async (field: string) => {
    touchedFields.value.add(field);
    await validateField(field as any);
};

const updateReq = updateTournamentRequest(id)
const validateCurrentStep = async () => {
    const fields = stepFieldMap[currentStepValue.value] ?? [];
    let isStepValid = true;
    for (const field of fields) {
        const result = await validateField(field as any);
        console.log(result)
        if (!result.valid) isStepValid = false;
    }
    return isStepValid;
};
const validateAndNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
        attemptedSteps.value.add(currentStepValue.value);
        toast.add({ title: "يرجى تصحيح أخطاء الخطوة الحالية", color: "error" });
        return;
    }
    completedSteps.value.add(currentStepValue.value);
    if (currentStepValue.value < steps.length - 1) currentStepValue.value += 1;
};
const previousStep = () => {
    if (currentStepValue.value > 0) currentStepValue.value -= 1;
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
            toast.add({ title: "يرجى إكمال الحقول المطلوبة", color: "error" });
            return;
        }
    }
    currentStepValue.value = currentStepBeforeSubmit;

    await updateReq.fetchReq(formData);
    if (updateReq.status.value == 'success') {
        await navigateTo("/tournament/request");
        return;
    }
    const apiData = (updateReq.error.value?.data as any)?.data;
    const apiErrors = apiData?.errors as Record<string, string[]> | undefined;
    if (apiErrors) {
        for (const [key, value] of Object.entries(apiErrors)) {
            setFieldError(key as any, Array.isArray(value) ? value[0] : String(value));
        }
    }
};
watch(currentStepValue, () => { scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' }); });
const stepperItems = computed(() => steps.map((step, idx) => ({
    ...step,
    color: currentStepValue.value === idx ? "primary" : completedSteps.value.has(idx) ? "success" : "neutral",
})));
const totalStepsValue = computed(() => steps.length);
const isSubmittingValue = computed(() => updateReq.status.value === "pending");
const canGoBack = computed(() => currentStepValue.value >= 1);
const canGoNext = computed(() => currentStepValue.value < totalStepsValue.value - 1);
const isLastStep = computed(() => currentStepValue.value == totalStepsValue.value - 1);
const handelSubmit = () => {
  void submitForm();
};
</script>

<style scoped></style>
