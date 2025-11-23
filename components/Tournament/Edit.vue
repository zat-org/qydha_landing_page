<template>
    <Loading v-if="getReq.status.value == 'pending'" />
    <UCard v-else-if="getReq.status.value == 'success'" :ui="{
        body: 'p-1 sm:p-1',
        header: 'p-1 sm:p-1',
        footer: 'p-1 sm:p-1',

    }">
        <template #header>
            <div class="flex justify-around  items-center w-full">
                <div class=" flex-1 flex  gap-2">
                    <UButton to="/tournament" size="sm" icon="i-heroicons-arrow-left" variant="ghost"
                        class="flex-1">
                        العودة
                    </UButton>
                    <!-- <UButton to="/tournament/request/info" size="sm" icon="i-heroicons-information-circle"
                        variant="ghost">
                        دليل انشاء البطولة
                    </UButton> -->
                </div>
                <UStepper size="sm"
                    :items="[...validation.enhancedSteps.value].map(step => ({ ...step, color: step.color.value }))"
                    class="flex-4 " v-model="currentStepValue" />

            </div>
        </template>

        <template #default>
            <div ref="scrollContainer" class="overflow-y-auto  max-h-[calc(100vh-300px)] min-h-[69vh] ">
                <div class="h-full">
                    <KeepAlive>
                        <TournamentFormTourForm ref="tourForm" v-show="currentStepValue === 0" v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentFormTourDetailForm ref="detailForm" v-show="currentStepValue === 1"
                            v-model="formData" />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentFormRulesForm ref="rulesForm" v-show="currentStepValue === 2" v-model="formData" />
                    </KeepAlive>
                </div>
            </div>

        </template>
        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton v-if="canGoBack" variant="outline" @click="validation.previousStep" label="السابق" size="xl" />
                <UButton v-if="canGoNext" color="primary" @click="validation.validateAndNext()" label="التالي"
                    size="xl" />
                <UButton v-else-if="isLastStep" color="primary" :loading="isSubmittingValue" @click="handelSubmit"
                    size="xl">
                    إرسال
                </UButton>
            </div>
        </template>
    </UCard>

</template>

<script setup lang="ts">
import { TournamentPrizeCurrency, TournamentPrizeType } from '~/models/tournamentPrize'
import { TournamentType } from '~/models/tournamenetType'

import { type TournamentCreationRequest, type UpdateTournamentCreationRequest } from '~/models/tournamentRequest';
import { useMyAuthStore } from '~/store/Auth';
import type { TournamentUpdate } from '~/models/tournament';

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
const authStore = useMyAuthStore()
const { getSingelTournament ,updateTournament} = useTournament()
// get from data by index  api 
const route = useRoute()
const id = route.params.id.toString()

const formData = reactive<TournamentUpdate>({
    title: "",
    description: "",
    logo: undefined,
    remainingSponsorsUrls: [],
    contactPhone: '',
    isContactPhoneCall: true,
    isContactPhoneWhatsapp: false,
    sponsors: [],
    startAt: '',
    endAt: '',
    tournamentType: TournamentType.public,
    addPlayersByQydha: false,
    // addPlayesrByQydha: false,
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
    showInQydha: false,
    joinRequestStartAt: undefined,
    joinRequestEndAt: undefined,
    joinRequestMaxCount: undefined,
    rules: [],
    // rules: [],
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
const assignData = () => {
    const data = getReq.data.value?.data.tournament ?? null
    if (unref(getReq.status) == 'success' && data) {
        formData.title = data.title
        formData.description = data.description
        formData.contactPhone = data.contactPhone
        formData.isContactPhoneCall = data.isContactPhoneCall
        formData.isContactPhoneWhatsapp = data.isContactPhoneWhatsapp
        formData.startAt = data.startAt
        formData.endAt = data.endAt
        formData.tournamentType = data.tournamentType as TournamentType
        formData.addPlayersByQydha = data.addPlayersByQydha
        formData.teamsCount = data.expectedTeamsCount
        formData.tablesCount = data.expectedTablesCount
        formData.tournamentPrivatePassword = data.tournamentPrivatePassword ?? undefined
        formData.locationDescription = data.locationDescription
        formData.location = data.location
        formData.prizes = data.prizes
        // formData.rules = data.rules
        formData.remainingSponsorsUrls = data.sponsors
        formData.joinRequestEndAt = data.joinRequestEndAt ?? undefined
        formData.joinRequestMaxCount = data.joinRequestMaxCount ?? undefined
        formData.joinRequestStartAt = data.joinRequestStartAt ?? undefined
        formData.showInQydha = data.showInQydha

    } else {
        // navigateTo('/tournament/request')
    }
}
const toast = useToast()
const getReq = await getSingelTournament(id)
if (getReq.status.value == "error") {
    toast.add({ title: 'حدث خطاء في جلب بينات البطوله ' })
    navigateTo('/tournamnent')
}  
watch(() => getReq.status.value, () => {
    if (getReq.status.value == "success") {
        assignData()
    }
})

const router = useRouter()
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

const getStepForField = (error: any): number => {
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
    const errorKeys = Object.keys(error);

    for (const key of errorKeys) {
        if (step0Fields.includes(key)) return 0;
        if (step1Fields.includes(key)) return 1;
        if (step2Fields.includes(key)) return 2;
    }

    // Default: if we have errors but can't match them, go to step 0
    return 0;
};

const updateReq = await updateTournament(id)
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
        await updateReq.fetchREQ(formData)
        if (updateReq.status.value == 'success') {
            console.log(unref(updateReq.data))
            router.back()
            // navigateTo("/tournament")
        } else if(updateReq.status.value == 'error') {
            // console.log(unref(updateReq.error))
            console.log(getStepForField(unref(updateReq.error)))
        }

        console.log('Form submitted successfully!', formData);
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