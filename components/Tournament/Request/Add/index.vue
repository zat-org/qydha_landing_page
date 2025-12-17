<template>
    <UCard :ui="{
        root:'  relative ',
        body: 'p-1 sm:p-1 ',
        header: 'p-1 sm:p-1',
        footer: 'p-1 sm:p-1',

    }"
    >
        <template #header>
            <div class="flex justify-around  items-center w-full sticky top-0 bg-white dark:bg-gray-900">
                <div class=" flex-1 flex  gap-2">
                    <UButton to="/tournament/request" size="sm" icon="i-heroicons-arrow-left" variant="ghost"
                        class="flex-1">
                        العودة
                    </UButton>
                    <UButton to="/tournament/request/info" size="sm" icon="i-heroicons-information-circle"
                        variant="ghost">
                        دليل انشاء البطولة
                    </UButton>

                    <UButton variant="outline" color="primary" icon="i-lucide-calculator"
                        to="/tournament/request/calcaulator" label="حاسبة البطولة" class="px-6" />

                </div>

                <UStepper size="sm"
                    :items="[...validation.enhancedSteps.value].map(step => ({ ...step, color: step.color.value }))"
                    class="flex-4 " v-model="currentStepValue" />

            </div>
        </template>

            <div  class="h-[75vh] overflow-y-auto" ref="scrollContainer">
                <!-- <div class="h-full"> -->
                    <KeepAlive>
                        <TournamentRequestFormTourForm ref="tourForm" v-show="currentStepValue === 0"
                            v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentRequestFormTourDetailForm ref="detailForm" v-show="currentStepValue === 1"
                            v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentRequestFormRulesForm ref="rulesForm" v-show="currentStepValue === 2"
                            v-model="formData" />
                    </KeepAlive>
                <!-- </div> -->
            </div>


        <template #footer>
            <div class="flex justify-between items-center px-6 sticky bottom-0 bg-white dark:bg-gray-900">
                <UButton v-if="canGoBack" variant="outline" @click="validation.previousStep" label="السابق" size="xl" />
                <UButton v-if="canGoNext" color="primary" @click="validation.validateAndNext()" label="التالي"
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
import { type TournamentCreationRequest } from '~/models/tournamentRequest';
// import { TournamentType } from '~/models/tournamenetType';
import { TournamentType } from '~/models/tournamenetType';
import { TournamentPrizeCurrency, TournamentPrizeType } from '~/models/tournamentPrize';

// Type definitions for form refs
interface FormStepRef {
    validate: () => Promise<boolean>;
    isValid: Ref<boolean>;
    errors: Ref<Record<string, string>>;
    isValidating: Ref<boolean>;
}

// Template refs
const tourForm = useTemplateRef<FormStepRef>("tourForm");
const detailForm = useTemplateRef<FormStepRef>("detailForm");
const rulesForm = useTemplateRef<FormStepRef>("rulesForm");
const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");

const { AddTournamentRequest } = useTournamentRequest()
const addREq = AddTournamentRequest();

// Form data
const formData = reactive<TournamentCreationRequest>({
    title: "",
    description: "",
    logo: undefined,
    contactPhone: '',
    isContactPhoneCall: true,
    isContactPhoneWhatsapp: false,
    sponsors: [],
    startAt: "",
    endAt: "",
    type: TournamentType.public,
    isAddPlayersByQydha: true,
    joinRequestEndAt: "",
    joinRequestStartAt: "",
    joinRequestMaxCount: 100,
    teamsCount: 16,
    tablesCount: 8,
    tournamentPrivatePassword: "",
    locationDescription: "",
    location: { latitude: 0, longitude: 0 },
    prizes: [
        {
            isFinancial: true,
            isNonFinancial: false,
            type: TournamentPrizeType.one,
            financialPrizeAmount: 100,
            financialPrizeCurrency: TournamentPrizeCurrency.SAR,
            nonFinancialPrizes: [],
        }
    ],
    rules: [],
    // TournamentDates: [{ date: "", startTime: "", endTime: "" }],
    // connectionPhoneNumberForPlayers: "",
    // Sponsered: false,
    // TournamentStartEnrolmmentDate: "",
    // TournamentEndEnrolmmentDate: "",
    // TournametPrizeOption: 1,
    // TeamSelectionMode: "auto",
    // TournamentDaysNumber: 1,
    // RefreeCount: 0,
    // RefreeNeed: false,
    // StatisticsNeed: false,
    // SakkaOptions: [],
});

// Step definitions
const steps = [
    {
        id: 0,
        title: "معلومات البطولة",
        // description: "معلومات البطولة",
        slot: "TourInfo",
        icon: "i-heroicons-trophy",
    },
    {
        id: 1,
        title: "تفاصيل البطولة",
        // description: "تفاصيل البطولة",
        slot: "TourDetail",
        icon: "i-heroicons-clipboard-document-list",
    },
    {
        id: 2,
        title: "قوانين البطولة",
        // description: "قوانين البطولة",
        slot: "TourRules",
        icon: "i-heroicons-scale",
    },
];

// Centralized validation setup
const formRefs = computed(() => [
    tourForm.value,
    detailForm.value,
    rulesForm.value,
]);
const toast = useToast()
const getStepForField = (error: any): number => {
    console.log("Hello")
    console.log(error)
    if (!error || typeof error !== 'object') return 0;

    // Fields in Step 0 (TourInfo - معلومات البطولة)
    const step0Fields = [
        'title', 'description', 'logo', 'contactPhone',
        'isContactPhoneCall', 'isContactPhoneWhatsapp',
        'locationDescription', 'location', 'type',
        'tournamentPrivatePassword', 'sponsors'
    ];

    // Fields in Step 1 (TourDetail - تفاصيل البطولة)
    const step1Fields = [
        'startAt', 'endAt', 'joinRequestStartAt',
        'joinRequestEndAt', 'joinRequestMaxCount',
        'isAddPlayersByQydha', 'prizes', 'teamsCount',
        'tablesCount'
    ];

    // Fields in Step 2 (RulesForm - قوانين البطولة)
    const step2Fields = ['rules'];

    // Check which field has an error
    const errorKeys = Object.keys(error.errors);

    for (const key of errorKeys) {
        if (step0Fields.includes(key)) return 0;
        if (step1Fields.includes(key)) return 1;
        if (step2Fields.includes(key)) return 2;
    }

    // Default: if we have errors but can't match them, go to step 0
    return 0;
};

const validation = useMultiStepFormValidation(formRefs as any, {
    totalSteps: steps.length,
    steps,
    onStepChange: (stepId) => {
        console.log(`Navigated to step ${stepId}`);
    },
    onValidationError: (stepId, errors) => {
        console.log(`Validation errors in step ${stepId}:`, errors);
    },
    onFormSubmit: async () => {
        // Here you would typically send the data to your API
        await addREq.fetchREQ(formData)
        if (addREq.status.value == 'success') {
            console.log(unref(addREq.data))
            console.log('Form submitted successfully!', formData);
            navigateTo("/tournament/request")
        } else {
            console.log(unref(addREq.error))
            console.log(getStepForField((addREq.error.value?.data as any).data))
            const targetTab = getStepForField((addREq.error.value?.data as any).data)
            validation.goToStep(targetTab)

            toast.add({ title: `خطاء في بيانات  ${Object.keys((addREq.error.value?.data as any).data.errors).join(", ")}` })
        }

    },
});


const currentStepValue = computed(() => validation.currentStep.value);
watch(currentStepValue, () => {

    scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' });

});

const totalStepsValue = computed(() => validation.enhancedSteps.value.length);
const isSubmittingValue = computed(() => validation.isSubmitting.value);
const canGoBack = computed(() => currentStepValue.value >= 1);
const canGoNext = computed(() => currentStepValue.value < totalStepsValue.value - 1);
const isLastStep = computed(() => currentStepValue.value == totalStepsValue.value - 1);

const handelSubmit = () => {
    validation.submitForm()

}

</script>

<style scoped></style>