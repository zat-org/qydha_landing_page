<template>
  <UCard dir="rtl" class="w-full min-w-0" :ui="{
    root: 'w-full min-w-0',
    header: 'p-3 sm:p-4 md:p-5',
    body: 'p-3 pt-0 sm:p-4 sm:pt-0 md:p-5 md:pt-0',
  }">
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
          <UButton
            v-if="showBackButton"
            class="min-h-11 shrink-0 self-start touch-manipulation sm:min-h-0 sm:self-center"
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="router.back()"
          />
          <h1 class="min-w-0 break-words text-lg font-bold leading-snug sm:text-xl md:text-2xl">
            طلبات انضمام الفرق
          </h1>


        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UButton v-if="canAction && showActions" size="md" color="success" variant="subtle"
            :loading="finalApprovePatching" :disabled="finalApprovePatching" @click="approveOpen = true">
            موافقة نهائية علي الطلبات
          </UButton>
          <UButton color="primary" variant="ghost" size="md" icon="i-heroicons-arrow-path" @click="refreshBothPanels" />
        </div>

      </div>
    </template>
    <UTabs :items="tabItems"
      class="mb-2 w-full min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch] sm:overflow-x-visible" dir="rtl"
      :unmount-on-hide="false">
      <template #requests-main>
        <Suspense>
          <TeamJoinRequestsPanel ref="mainPanelRef" :show-actions="showActions" :number-of-teams="numberOfTeams"
            :tournament-id="id" :can-action="canAction" mode="main" @mutated="refreshBothPanels" />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>

      <template #requests-consider>
        <Suspense>
          <TeamJoinRequestsPanel ref="considerPanelRef" :show-actions="showActions" :number-of-teams="numberOfTeams"
            :tournament-id="id" :can-action="canAction" mode="consider" @mutated="refreshBothPanels" />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
    </UTabs>

    <UModal v-model:open="approveOpen">
      <template #header>
        <span class="font-semibold ">تأكيد الموافقة النهائية</span>
      </template>
      <template #body>
        <p class="text-lg leading-relaxed ">
          الموافقة على عدد
          <span class="font-medium text-primary">

            {{ considerPanelRef?.totalCount }}
          </span>
          طلب فريق بشكل نهائي.
          <br>
          <span class="font-medium "> لا يمكن التراجع عن هذه الخطوة </span>
          بعد التنفيذ.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="approveOpen = false">إلغاء</UButton>
          <UButton color="success" :loading="finalApprovePatching" @click="confirmFinalApprove">
            تأكيد الموافقة
          </UButton>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
import type { DetailTournament } from '~/features/tournament/models/tournament';
import { TournamentDetailedState, TournamentState } from '~/features/tournament/models/tournament';
import Loading from "~/components/loading.vue";
import TeamJoinRequestsPanel from "~/features/tournament/join-request/components/TeamJoinRequestsPanel.vue";
import { DEFAULT_TOURNAMENT_OUTLET_MODE } from '~/features/tournament/core/constants';
import type { TournamentOutletMode } from '~/features/tournament/core/types';
import { shouldShowBackButton, shouldCompleteWithEmit } from '~/features/tournament/core/utils';

const props = withDefaults(
  defineProps<{
    mode?: TournamentOutletMode;
    tournamentId?: string;
  }>(),
  { mode: DEFAULT_TOURNAMENT_OUTLET_MODE },
);

const emit = defineEmits<{ done: [] }>();

const router = useRouter();
const showBackButton = computed(() => shouldShowBackButton(props.mode));
const id = props.tournamentId ?? useRoute().params.id?.toString() ?? "";

const tournamentDashboardKey = `getSingelTournament-${id}` as const;
const { data: tournamentDashboardData } = useNuxtData<{ data: DetailTournament }>(tournamentDashboardKey);
const getTourREQ = await useTournament().getSingelTournament(id, { immediate: false });

if (!tournamentDashboardData.value?.data?.tournament) {
  await getTourREQ.refresh();
}

const tournament = computed(() => tournamentDashboardData.value?.data.tournament ?? null);
const tournamneState = computed(() => tournament.value?.state ?? null);
const showActions = computed(() => {
  if (tournamneState.value === null) return false;
  return tournament.value?.detailedState === TournamentDetailedState.ManagingJoinRequests
});
const numberOfTeams = computed(() => tournament.value?.expectedTeamsCount ?? 0);
const tournamentEndJoinRequest = computed(() => tournament.value?.joinRequestEndAt ?? null);

const canAction = computed(() => {
  if (tournamneState.value === TournamentState.Upcoming) {
    const end = tournamentEndJoinRequest.value
      ? new Date(tournamentEndJoinRequest.value as string).getTime()
      : 0;
    return end > 0 && end <= Date.now();
  }
  return false;
});

const tabItems = [
  { label: "الطلبات", slot: "requests-main" as const, icon: "i-heroicons-queue-list" },
  { label: "قيد الدراسة", slot: "requests-consider" as const, icon: "i-heroicons-clipboard-document-check" },
];

const { patchTeamJoinRequests } = useTournamentJoinRequest();

const approveOpen = ref(false);
const finalApprovePatching = ref(false);

const mainPanelRef = ref<{ refresh: () => Promise<void>, totalCount: number } | null>(null);
const considerPanelRef = ref<{ refresh: () => Promise<void>, totalCount: number } | null>(null);

async function confirmFinalApprove() {
  finalApprovePatching.value = true;
  try {
    const ok = await patchTeamJoinRequests(id, "approve");
    if (ok) {
      approveOpen.value = false;
      await refreshBothPanels();
      if (shouldCompleteWithEmit(props.mode)) {
        emit('done');
      } else {
        router.back();
      }
    }
  } finally {
    finalApprovePatching.value = false;
  }
}

const refreshBothPanels = async () => {
  await nextTick();
  await Promise.all([
    getTourREQ.refresh() ?? Promise.resolve(),
    mainPanelRef.value?.refresh?.() ?? Promise.resolve(),
    considerPanelRef.value?.refresh?.() ?? Promise.resolve(),
  ]);
};


</script>

<style scoped></style>
