<template>
  <UCard
    class="max-w-7xl mx-auto shadow-lg shadow-gray-900/5 dark:shadow-none ring-1 ring-gray-200/80 dark:ring-gray-800/80"
    :ui="{
      root: 'overflow-hidden rounded-2xl',
      header: 'p-0 border-b border-gray-200/90 dark:border-gray-800/90 bg-gray-50/40 dark:bg-gray-950/30',
      body: 'p-0',
    }"
  >
    <template v-if="tour" #header>
      <TournamentGetHeader
        :id="id"
        :is-admin="isAdmin"
        :can-edit="canEdit"
        @back="returnToTournament"
      />
    </template>

    <Loading v-if="pending" class="py-20" />
    <div v-else-if="tour" class="flex flex-col">
      <TournamentGetHero
        v-model:hero-accordion-open="heroAccordionOpen"
        v-model:details-sections-open="detailsSectionsOpen"
        :tour="tour"
        :hero-accordion-items="heroAccordionItems"
        :details-accordion-items="detailsAccordionItems"
        :detailed-state="detailedState"
        :get-state="getState"
        :get-type="getType"
        :get-currency="getCurrency"
      />
      <TournamentGetManagementBoard
        :id="id"
        :detailed-state="detailedState"
        :phase-behavior="phaseBehavior"
        :phase-order="phaseOrder"
        :current-phase-index="currentPhaseIndex"
        :phase-circle-class="phaseCircleClass"
        :phase-step-status="phaseStepStatus"
        :is-reset-final-group-matches-pending="isResetFinalGroupMatchesPending"
        @organize-tournament="HandelSetupTournament"
        @open-start-confirm="openStartTournamentConfirm"
        @reset-final-group-matches="handleResetFinalGroupMatches"
      />
    </div>

    <TournamentGetStartConfirmModal
      v-model:open="startTournamentConfirmOpen"
      :pending="isStartFinalGroupPending"
      @confirm="confirmAndStartTournament"
    />
  </UCard>
</template>
<script lang="ts" setup>
import TournamentGetHeader from "./TournamentGetHeader.vue";
import TournamentGetHero from "./TournamentGetHero.vue";
import TournamentGetManagementBoard from "./TournamentGetManagementBoard.vue";
import TournamentGetStartConfirmModal from "./TournamentGetStartConfirmModal.vue";
import { useMyAuthStore } from "~/store/Auth";
import Loading from "~/components/loading.vue";
import SetupTournamentModal from "../SetupTournamentModal.vue";
import { TournamentState, TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { TournamentType } from "~/features/tournament/models/tournamenetType";
import type { TournamentPrizeCurrency } from "~/features/tournament/models/tournamentPrize";
import { GroupState, GroupType } from "~/features/tournament/models/group";
import { useSingleTournamnetMangmentStore } from "~/store/SingleTournamnetMangment";
import {
  getVisiblePhaseOrder,
  getPhaseIndex,
  getPhaseStepStatus,
  type PhaseStepStatus,
} from "~/features/tournament/core/composables/useTournamentDashboardPhase";
import { useTournamentGetPhaseBehavior } from "~/features/tournament/core/composables/useTournamentGetPhaseBehavior";

const userStore = useMyAuthStore();
const tournamentManagementStore = useSingleTournamnetMangmentStore();
const router = useRouter();
const returnToTournament = () => {
  router.back();
  tournamentManagementStore.setActiveStep(0);
}

const isAdmin = computed((): boolean => {
  const roles = userStore.user?.user.roles;
  return !!roles?.includes("SuperAdmin") || !!roles?.includes("StaffAdmin");
});

const { permissions, privilege } = storeToRefs(userStore);

const canEdit = computed((): boolean => {
  return (
    privilege.value?.toLowerCase() == "admin" ||
    privilege.value?.toLowerCase() == "owner" ||
    permissions.value.includes("ModifyTournamentData")
  );
});

/** Hero — بيانات البطولة (UAccordion، مطوي افتراضياً) */
const HERO_ACCORDION_ITEM_VALUE = 'tournament-hero'
const heroAccordionOpen = ref<string | undefined>(undefined)
const heroAccordionItems = [
  {
    value: HERO_ACCORDION_ITEM_VALUE,
    slot: 'tournament-hero',
    label: '',
  },
]

/** Sponsors / prizes / rules / moderators — accordion sections (multiple panels) */
const detailsSectionsOpen = ref<string[]>([])

const props = defineProps<{ id: string }>();
const { getSingelTournament, getTournamnetStateOptions, setupTournament, startTournament } = useTournament();
const { getTournamentTypeOptions, getTournamentPrizeCurrency } = useTournamentRequest()
const toast = useToast();
const getREQ = await getSingelTournament(props.id);

const pending = computed(() => getREQ.pending.value);
const tour = computed(() => getREQ.data.value?.data);

const detailsAccordionItems = computed(() => {
  const t = tour.value?.tournament
  if (!t) return [] as { label: string; slot: string; icon: string }[]

  const items: { label: string; slot: string; icon: string }[] = []

  if (t.sponsors?.length) {
    items.push({
      label: "الرعاة",
      slot: "acc-sponsors",
      icon: "i-mdi-handshake-outline",
    })
  }

  items.push({
    label: "الجوائز",
    slot: "acc-prizes",
    icon: "i-mdi-trophy-variant-outline",
  })

  if (t.tournamentRules?.length) {
    items.push({
      label: "قواعد البطولة",
      slot: "acc-rules",
      icon: "i-mdi-book-open-page-variant",
    })
  }

  if (t.moderators?.length) {
    items.push({
      label: "المشرفون",
      slot: "acc-moderators",
      icon: "i-mdi-account-supervisor-outline",
    })
  }

  return items
})

const finalGroup = computed(() =>
  tour.value?.tournament?.groups?.find((g) => g.type === GroupType.Final),
);

const detailedState = computed(() => tour.value?.tournament?.detailedState);

const phaseOrder = computed(() =>
  getVisiblePhaseOrder(!!tour.value?.tournament?.addPlayersByQydha),
);

const currentPhaseIndex = computed(() =>
  getPhaseIndex(detailedState.value, phaseOrder.value),
);

const phaseStepStatus = (idx: number): PhaseStepStatus =>
  getPhaseStepStatus(idx, currentPhaseIndex.value);

const phaseCircleClass = (idx: number) => {
  const s = phaseStepStatus(idx);
  if (s === "done") {
    return "border-primary bg-primary/15 text-primary dark:bg-primary/25";
  }
  if (s === "current") {
    return "border-primary bg-primary text-white ring-2 ring-primary/40 ring-offset-2 ring-offset-white dark:ring-offset-gray-950";
  }
  return "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-400";
};

const phaseBehavior = useTournamentGetPhaseBehavior({
  detailedState,
  tournamentState: computed(() => tour.value?.tournament?.state),
  finalGroupState: computed(() => finalGroup.value?.state),
  hasQualificationsStage: computed(() => tour.value?.tournament?.hasQualificationsStage),
  isAdmin,
});

const overlay = useOverlay();
const setupTournamentModal = overlay.create(SetupTournamentModal);

const setupReq = setupTournament(props.id);
// const startReq = await startTournament(props.id);
const startFinalGroupTournamentReq = await useTournament().startFinalGroupTournament(props.id);
const resetFinalGroupMatchesReq = await useTournament().resetFinalGroupMatches(props.id);
const HandelSetupTournament = async () => {
  const instace = setupTournamentModal.open();
  const confirmed = await instace.result;
  if (!confirmed) { return; }
  await setupReq.fetchREQ(confirmed);
  if (setupReq.result.status.value == 'success') {
    await getREQ.refresh();
  }

};

const startTournamentConfirmOpen = ref(false);

const isStartFinalGroupPending = computed(
  () => startFinalGroupTournamentReq.result.status.value === "pending",
);

const openStartTournamentConfirm = () => {
  startTournamentConfirmOpen.value = true;
};

const confirmAndStartTournament = async () => {
  await startFinalGroupTournamentReq.fetchREQ();
  if (startFinalGroupTournamentReq.result.status.value === "success") {
    toast.add({
      title: "تم بدء المباريات في المجموعة النهائية",
      description: "تم بدء المباريات في المجموعة النهائية بنجاح",
      color: "success",
    });
    startTournamentConfirmOpen.value = false;
    await getREQ.refresh();
  } else {
    const err = startFinalGroupTournamentReq.result.error.value as { message?: string } | null | undefined;
    toast.add({
      title: "تعذّر بدء البطولة",
      description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
      color: "error",
    });
  }
};

const isResetFinalGroupMatchesPending = computed(
  () => resetFinalGroupMatchesReq.result.status.value === "pending",
);

const handleResetFinalGroupMatches = async () => {
  await resetFinalGroupMatchesReq.fetchREQ();
  if (resetFinalGroupMatchesReq.result.status.value === "success") {
    toast.add({
      title: "تم إعادة ضبط المرحلة",
      description: "يمكنك الآن إدارة الخريطة والمباريات من مرحلة إدارة المجموعة النهائية.",
      color: "success",
    });
    await getREQ.refresh();
  } else {
    const err = resetFinalGroupMatchesReq.result.error.value as { message?: string } | null | undefined;
    toast.add({
      title: "تعذّر إعادة الضبط",
      description: err?.message ?? "تحقق من الصلاحيات والاتصال ثم أعد المحاولة.",
      color: "error",
    });
  }
};

const states = getTournamnetStateOptions()
const getState = (value: TournamentState) => {
  const result = states.find(s => s.value == value)
  if (result) return result
}
const types = getTournamentTypeOptions()
const getType = (value: TournamentType) => {
  const result = types.find(s => s.value == value)
  if (result) return result
}
const currencies = getTournamentPrizeCurrency()
const getCurrency = (value: TournamentPrizeCurrency) => {
  const result = currencies.find(cur => cur.value == value)
  if (result) return result
}


</script>

