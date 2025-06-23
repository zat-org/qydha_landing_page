<template>
    <UCard class="flex-1 relative ">

        <UTabs :items="steps" v-model="currentStep" :ui="{
            wrapper: 'w-full',
            item: {
                base: 'flex items-center gap-2 p-2 rounded-lg transition-all duration-300',
                active: 'bg-primary-50 text-primary-600 scale-110',
                inactive: 'bg-gray-50',
                completed: 'bg-green-50 text-green-600'
            }
        }">
            <template #CompInfo>
                <TournamentAddCompanyForm v-model="formData" />
            </template>

            <template #TourInfo>
                <TournamentAddTourForm v-model="formData" />
            </template>

            <template #TourDetail>
                <TournamentAddTourDetailForm v-model="formData" />
            </template>

            <template #TourRules>
                <TournamentAddRolesForm v-model="formData" />
            </template>
        </UTabs>

        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton v-if="currentStep >= 1" variant="outline" @click="previousStep" label="السابق" size="xl" />
                <UButton v-if="currentStep < steps.length" color="primary" @click="validateAndNext" label="التالي"
                    size="xl" />
                <UButton v-if="currentStep === steps.length" color="primary" :loading="isSubmitting" @click="submitForm"
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
    { id: 1, label: "معلومات الشركة", slot: "CompInfo" },
    { id: 2, label: "معلومات البطولة", slot: "TourInfo" },
    { id: 3, label: "تفاصيل البطولة", slot: "TourDetail" },
    { id: 4, label: "قوانين البطولة", slot: "TourRules" },
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
    ConnectionPhoneNumberForPlayers: "",
    isWhatsappAvailable: false,
    isCallAvailable: false,
    Sponsered: false,
    Sponsers: [],
    TournametPrizeOption:1,
    TournametPrize: [{money: 0, items: [], position: 1}],
    TeamsCount: 0,
    TablesCount: 0,
    RefreeCount: 0,
    RefreeNeed: false,
    Stage32Option: "",
    Stage16Option: "",
    Stage8Option: "",
    SemiFinalOption: "",
    FinalOption: "",
    TeamSelectionMode: "",
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
    TournametPrize: object({ money: number().required("قيمة الجائزة مطلوبة"), items: array().of(string()) }),
    TeamsCount: number().required("عدد الفرق مطلوب"),
    TablesCount: number().required("عدد الطاولات مطلوب"),
    Stage32Option: string().required("اختيارات الدور 32 مطلوبة"),
    Stage16Option: string().required("اختيارات الدور 16 مطلوبة"),
    Stage8Option: string().required("اختيارات الدور 8 مطلوبة"),
    SemiFinalOption: string().required("اختيارات نص النهائي مطلوبة"),
    FinalOption: string().required("اختيارات  النهائي مطلوبة"),
    RefreeCount: number().required("عدد الحكام مطلوبة"),
    TeamSelectionMode: string().required("طريقة الاختيار مطلوبة"),
});



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
                color: "red",
            });
        }
        return false;
    }
};

const validateAndNext = async () => {
    if (await validateCurrentStep()) {
        nextStep();
    }
};

const nextStep = () => {
    if (currentStep.value < steps.length) {
        currentStep.value++;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        completedSteps.value.delete(currentStep.value);
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
                color: "green",
            });
        } catch (error) {
            useToast().add({
                title: "خطأ",
                description: "حدث خطأ أثناء إرسال النموذج",
                color: "red",
            });
        } finally {
            isSubmitting.value = false;
        }
    }
};
</script>

<style scoped>
.form-step {
    @apply animate-fadeIn w-full;
}

.inner-Form {
    @apply flex flex-col gap-5 w-full;
}

.step-button {
    @apply flex items-center gap-2 rtl:space-x-reverse p-2 rounded-lg cursor-pointer transition-all duration-300;
}

.step-number {
    @apply w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium;
}

.step-button.completed .step-number {
    @apply bg-green-500 text-white;
}
</style>