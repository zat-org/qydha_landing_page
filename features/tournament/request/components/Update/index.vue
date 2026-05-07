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
                <UStepper size="sm"
                    :items="[...validation.enhancedSteps.value].map(step => ({ ...step, color: step.color.value }))"
                    class="flex-4 " v-model="currentStepValue" />

            </div>
        </template>

        <template #default>
            <div ref="scrollContainer" class=" h-[75vh] overflow-y-auto">
                    <KeepAlive>
                        <TournamentRequestUpdateTourForm ref="tourForm" v-show="currentStepValue === 0"
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
            </div>

        </template>
        <template #footer>
            <div class="flex justify-between items-center px-6">
                <UButton v-if="canGoBack" variant="outline" @click="validation.previousStep" label="السابق" size="xl" />
                <UButton v-if="canGoNext" color="primary" @click="() => { void validation.validateAndNext(); }" label="التالي"
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
import TournamentRequestUpdateTourForm from '~/features/tournament/request/components/Update/TourForm.vue';
import TournamentRequestFormTourDetailForm from '~/features/tournament/request/components/Form/TourDetailForm/index.vue';
import TournamentRequestFormRulesForm from '~/features/tournament/request/components/Form/RulesForm.vue';

interface FormStepRef {
    validate: () => Promise<boolean>;
    isValid: Ref<boolean>;
    errors: Ref<Record<string, string>>;
    isValidating: Ref<boolean>;
}

const tourForm = useTemplateRef<FormStepRef>("tourForm");
const detailForm = useTemplateRef<FormStepRef>("detailForm");
const rulesForm = useTemplateRef<FormStepRef>("rulesForm");
const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");
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
const formRefs = computed(() => [tourForm.value, detailForm.value, rulesForm.value]);

const updateReq = updateTournamentRequest(id)
const validation = useMultiStepFormValidation(formRefs as any, {
    totalSteps: steps.length,
    steps,
    onFormSubmit: async () => {
        await updateReq.fetchReq(formData)
        if (updateReq.status.value == 'success') navigateTo("/tournament/request")
    },
});

const currentStepValue = computed(() => validation.currentStep.value);
watch(currentStepValue, () => { scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' }); });
const totalStepsValue = computed(() => validation.enhancedSteps.value.length);
const isSubmittingValue = computed(() => validation.isSubmitting.value);
const canGoBack = computed(() => currentStepValue.value >= 1);
const canGoNext = computed(() => currentStepValue.value < totalStepsValue.value - 1);
const isLastStep = computed(() => currentStepValue.value == totalStepsValue.value - 1);
const handelSubmit = () => {
  void validation.submitForm();
};
</script>

<style scoped></style>
