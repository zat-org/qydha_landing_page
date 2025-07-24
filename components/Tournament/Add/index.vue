<template>
    <UCard>
        <template #header>
            <div class="flex justify-center items-center w-full relative">
                <UButton to="/tournament" icon="i-heroicons-arrow-left" variant="ghost" class="absolute right-4">
                    العودة
                </UButton>

                <!-- Desktop View -->
                <UButtonGroup class="hidden md:block mx-auto">
                    <UButton 
                        v-for="step in validation.enhancedSteps.value" 
                        :key="step.id" 
                        :label="step.label" 
                        :class="step.class"
                        @click="validation.goToStep(step.id)"
                    >
                    
                        <!-- Validation Status Icons -->
                        <!-- <template #trailing>
                            <UIcon 
                                v-if="isStepCompleted(step.id)" 
                                name="i-heroicons-check-circle"
                                class="w-4 h-4 text-green-200" 
                            />
                            <UIcon 
                                v-else-if="validation.isStepValid(step.id)" 
                                name="i-heroicons-exclamation-circle"
                                class="w-4 h-4 text-blue-200" 
                            />
                            <UIcon 
                                v-else-if="isCurrentStep(step.id)" 
                                name="i-heroicons-clock"
                                class="w-4 h-4 text-primary-200 animate-pulse" 
                            />
                        </template> -->
                    </UButton>
                </UButtonGroup>

                <!-- Mobile View -->
                <UButtonGroup class="block md:hidden mx-auto">
                    <UButton 
                        v-for="step in validation.enhancedSteps.value" 
                        :key="step.id" 
                        :icon="step.icon" 
                        :class="step.class"
                        @click="validation.goToStep(step.id)"
                    >        
                    </UButton>
                </UButtonGroup>
            </div>
        </template>
        
        <template #default>
            <div class="overflow-y-auto max-h-[calc(100vh-300px)] min-h-[400px] p-5">
                <div class="h-full">
                    <KeepAlive>
                        <TournamentAddTourForm 
                            ref="tourForm" 
                            v-show="currentStepValue === 0" 
                            v-model="formData" 
                        />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentAddTourDetailForm 
                            ref="detailForm" 
                            v-show="currentStepValue === 1" 
                            v-model="formData" 
                        />
                    </KeepAlive>
                    <KeepAlive>
                        <TournamentAddRulesForm 
                            ref="rulesForm" 
                            v-show="currentStepValue === 2" 
                            v-model="formData" 
                        />
                    </KeepAlive>
                </div>
            </div>
        </template>
        
        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton 
                    v-if="canGoBack" 
                    variant="outline" 
                    @click="validation.previousStep" 
                    label="السابق" 
                    size="xl" 
                />
                <UButton 
                    v-if="canGoNext" 
                    color="primary" 
                    @click="validation.validateAndNext()" 
                    label="التالي"
                    size="xl" 
                />
                <UButton 
                    v-else-if="isLastStep" 
                    color="primary" 
                    :loading="isSubmittingValue"
                    @click="validation.submitForm()" 
                    size="xl"
                >
                    إرسال
                </UButton>
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
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

// Form data
const formData = reactive({
    TournamentName: "",
    TournamentDescription: "",
    TournamentLogo: "",
    TournamentLocation: { lat: 0, lng: 0 },
    TournamentType: "public",
    PrivateTournamentCode: "",
    TournamentAddress: "",
    ConnectionPhoneNumberForPlayers: "",
    isWhatsappAvailable: false,
    isCallAvailable: false,
    Sponsered: false,
    Sponsers: [],
    TournamentStartEnrolmmentDate: "",
    TournamentEndEnrolmmentDate: "",
    TournametPrizeOption: 1,
    TeamSelectionMode: "auto",
    TournametPrize: [{ money: 1000, items: [], position: 1, isMoney: true, isItem: false, currency: "" }],
    TournamentDates: [{date:"",startTime:"",endTime:""}],
    TournamentDaysNumber: 1,
    TeamsCount: 16,
    TablesCount: 8,
    RefreeCount: 0,
    RefreeNeed: false,
    StatisticsNeed: false,
    SakkaOptions: [],
    Roles: [],
});

// Step definitions
const steps = [
    {
        id: 0,
        label: "معلومات البطولة",
        slot: "TourInfo",
        icon: "i-heroicons-trophy",
    },
    {
        id: 1,
        label: "تفاصيل البطولة",
        slot: "TourDetail",
        icon: "i-heroicons-clipboard-document-list",
    },
    {
        id: 2,
        label: "قوانين البطولة",
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

const validation = useMultiStepFormValidation(formRefs as any, {
    totalSteps: steps.length,
    steps,
    onStepChange: (stepId) => {
        // console.log(`Navigated to step ${stepId}`);
    },
    onValidationError: (stepId, errors) => {
        // console.log(`Validation errors in step ${stepId}:`, errors);
    },
    onFormSubmit: async () => {
        // Here you would typically send the data to your API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Form submitted successfully!', formData);
        navigateTo("/tournament")
    },
});


const currentStepValue = computed(() => validation.currentStep.value);
const totalStepsValue = computed(() => validation.enhancedSteps.value.length);
const isSubmittingValue = computed(() => validation.isSubmitting.value);
const canGoBack = computed(() => currentStepValue.value >= 1);
const canGoNext = computed(() => currentStepValue.value < totalStepsValue.value - 1);
const isLastStep = computed(() => currentStepValue.value == totalStepsValue.value - 1);
</script>

<style scoped></style>