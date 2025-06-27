<template>

    <UCard>
        <template #header>
            <div class="flex justify-center items-center w-full">
                <!-- Desktop View -->
                <UButtonGroup class="hidden md:block mx-auto">
                    <UButton v-for="step in steps" :key="step.id" 
                        :label="step.label"
                        :class="step.class.value"
                        @click="currentStep = step.id" />
                </UButtonGroup>

                <!-- Mobile View -->
                <UButtonGroup class="block md:hidden mx-auto">
                    <UButton v-for="step in steps" :key="step.id"
                        :icon="step.icon"
                        :class="step.class.value"
                            @click="currentStep = step.id">
                    </UButton>
                </UButtonGroup>
            </div>
        </template>
        <template #default>
            <div class="overflow-y-auto max-h-[calc(100vh-300px)] min-h-[400px]">
                <div class="h-full">
                    <KeepAlive>
                        <TournamentAddCompanyForm v-if="currentStep === 0" v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentAddTourForm v-if="currentStep === 1" v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentAddTourDetailForm v-if="currentStep === 2" v-model="formData" />
                    </KeepAlive>
                        <KeepAlive>
                            <TournamentAddRulesForm v-if="currentStep === 3" v-model="formData" />
                        </KeepAlive>
                    <!-- <KeepAlive>
                        <TournamentAddPayment v-if="currentStep === 4" v-model="formData" :amount="100" />
                    </KeepAlive> -->
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton v-if="currentStep >= 1" variant="outline" @click="previousStep" label="السابق" size="xl" />
                <UButton v-if="currentStep < steps.length-1" color="primary" @click="validateAndNext" label="التالي"
                    size="xl" />
                <UButton v-else-if="currentStep == steps.length-1" color="primary" :loading="isSubmitting" @click="submitForm"
                    size="xl">
                    إرسال
                </UButton>
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
import {
    object,
    string,
    number,
    ValidationError,
    date,
    boolean,
    array,
} from "yup";

const currentStep = ref(0);
const isSubmitting = ref(false);
const completedSteps = ref(new Set<number>());

const steps = [
    {
        id: 0,
        label: "معلومات الشركة",
        slot: "CompInfo",
        icon: "i-heroicons-building-office",
        class: computed(() => completedSteps.value.has(0)
            ? 'bg-green-600 dark:bg-green-400'
            : currentStep.value === 0
                ? 'bg-primary-600 dark:bg-primary-400'
                : 'bg-gray-500 dark:bg-gray-400')
    },
    {
        id: 1,
        label: "معلومات البطولة",
        slot: "TourInfo", 
        icon: "i-heroicons-trophy",
        class: computed(() => completedSteps.value.has(1)
            ? 'bg-green-600 dark:bg-green-400'
            : currentStep.value === 1
                ? 'bg-primary-600 dark:bg-primary-400'
                : 'bg-gray-500 dark:bg-gray-400')
    },
    {
        id: 2,
        label: "تفاصيل البطولة",
        slot: "TourDetail",
        icon: "i-heroicons-clipboard-document-list",
        class: computed(() => completedSteps.value.has(2)
            ? 'bg-green-600 dark:bg-green-400'
            : currentStep.value === 2
                ? 'bg-primary-600 dark:bg-primary-400'
                : 'bg-gray-500 dark:bg-gray-400')
    },
    {
        id: 3,
        label: "قوانين البطولة",
        slot: "TourRules",
        icon: "i-heroicons-scale",
        class: computed(() => completedSteps.value.has(3)
            ? 'bg-green-600 dark:bg-green-400'
            : currentStep.value === 3
                ? 'bg-primary-600 dark:bg-primary-400'
                : 'bg-gray-500 dark:bg-gray-400')
    },
    // {
    //     id: 4,
    //     label: "المدفوعات",
    //     slot: "TourPayments",
    //     icon: "i-heroicons-credit-card",
    //     class: computed(() => completedSteps.value.has(4)
    //         ? 'bg-green-600 dark:bg-green-400'
    //         : currentStep.value === 4
    //             ? 'bg-primary-600 dark:bg-primary-400'
    //             : 'bg-gray-500 dark:bg-gray-400')
    // },
];

const formData = reactive({
    CompanyName: "",
    RegisterNumber: "",
    CompanyPhoneNumber: "",
    TournamentName: "",
    TournamentDescription: "",
    TournamentLogo: "",
    TournamentDates: [],
    TournamentDaysNumber: 0,
    TournamentLocation: { x: 0, y: 0 },
    TournamentType: "",
    ConnectionPhoneNumberForPlayers: "",
    isWhatsappAvailable: false,
    isCallAvailable: false,
    Sponsered: false,
    Sponsers: [],
    TournametPrizeOption: 1,
    TournametPrize: [{ money: 0, items: [], position: 1 }],
    TeamsCount: 0,
    TablesCount: 0,
    RefreeCount: 0,
    RefreeNeed: false,
    StatisticsNeed: false,
    SakkaNormalOption:"",
    SakkaFinalMatchOption:"",
    // TeamSelectionMode: "",
    Roles: [],
});

const CompanySchema = object({
    CompanyName: string()
        .required("الاسم الشركة مطلوب")
        .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    RegisterNumber: string().required(" رقم السجل التجاري  مطلوب "),
    CompanyPhoneNumber: string().required(" رقم التواصل مع المؤسسة مطلوب ").min(10, "رقم التواصل يجب أن يكون 10 أرقام على الأقل"),
});

const TournamentSchema = object({
    TournamentName: string().required(" اسم البطولة مطلوب"),
    TournamentDescription: string().required("  وصف البطولة مطلوب"),
    TournamentLogo: string().required("  شعار البطولة مطلوب"),
    TournamentDates: array().of(string()).min(1, "يجب تحديد تاريخ واحد على الاقل").required("يجب ادخال تاريخ البطولة"),
    TournamentDaysNumber: number().required(),
    TournamentType: string().required("نوع البطولة مطلوب"),
    TournamentLocation: object({
        x: number().required(),
        y: number().required(),
    }),
    ConnectionPhoneNumberForPlayers: string().required(
        " رقم للتواصل للاعبين مطلوب "
    ),
    isCallAvailable: boolean(),
    isWhatsappAvailable: boolean(),
    Sponsered: boolean(),
    Sponsers: array().of(string()),
});

const detailsSchema = object({
    TournametPrize: array().of(object({ money: number().required("قيمة الجائزة مطلوبة"), items: array().of(string()) }) ),
    TeamsCount: number().required("عدد الفرق مطلوب"),
    TablesCount: number().required("عدد الطاولات مطلوب"),
    RefreeNeed: boolean().required("احصائيات البطولة مطلوبة"),
    RefreeCount: number().when('RefreeNeed', {
      is: true,
      then: (schema) => schema.required("عدد الحكام مطلوبة"),
      otherwise: (schema) => schema.optional()
    }),
    StatisticsNeed: boolean().required("احصائيات البطولة مطلوبة"),
    SakkaNormalOption: string().required("اختيارات  النهائي مطلوبة"),
    SakkaFinalMatchOption: string().required("اختيارات  النهائي مطلوبة"),
    // TeamSelectionMode: string().required("طريقة الاختيار مطلوبة"),
});

const findFirstIncompleteStep = () => {
    for (let i = 0; i < currentStep.value; i++) {
        if (!completedSteps.value.has(i)) {
            return i;
        }
    }
    return currentStep.value;
};

const validateCurrentStep = async () => {
    try {
        switch (currentStep.value) {
            case 0:
                await CompanySchema.validate(formData);
                break;
            case 1:
                await TournamentSchema.validate(formData);
                break;
            case 2:
                await detailsSchema.validate(formData);
                break;
        }
        completedSteps.value.add(currentStep.value);
        return true;
    } catch (error: unknown) {
        if (error instanceof ValidationError) {
            useToast().add({
                title: "خطأ",
                description: error.message,
                color: "error",
            });
        }
        return false;
    }
};

const goToStep = async (stepId: number) => {
    // Allow going to any completed step
    if (completedSteps.value.has(stepId)) {
        currentStep.value = stepId;
        return;
    }

    // Find first incomplete step
    const incompleteStep = findFirstIncompleteStep();
    
    // If trying to skip ahead, redirect to first incomplete step
    if (stepId > incompleteStep) {
        currentStep.value = incompleteStep;
        useToast().add({
            title: "تنبيه",
            description: "يجب إكمال الخطوات السابقة أولاً",
            color: "warning",
        });
    } else {
        currentStep.value = stepId;
    }
};

const validateAndNext = async () => {
    const incompleteStep = findFirstIncompleteStep();
    if (incompleteStep < currentStep.value) {
        currentStep.value = incompleteStep;
        useToast().add({
            title: "تنبيه", 
            description: "يجب إكمال الخطوات السابقة أولاً",
            color: "warning",
        });
        return;
    }

    if (await validateCurrentStep()) {
        nextStep();
    }
};

const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
        completedSteps.value.add(currentStep.value);
        currentStep.value++;
    }
};

const previousStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

const submitForm = async () => {
    if (await validateCurrentStep()) {
        isSubmitting.value = true;
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            useToast().add({
                title: "تم بنجاح",
                description: "تم إرسال النموذج بنجاح",
                color: "success",
            });
        } catch (error) {
            useToast().add({
                title: "خطأ",
                description: "حدث خطأ أثناء إرسال النموذج",
                color: "error",
            });
        } finally {
            isSubmitting.value = false;
        }
    }
};
</script>

<style scoped></style>