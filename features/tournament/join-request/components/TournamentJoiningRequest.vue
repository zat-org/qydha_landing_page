<template>
  <UCard
    dir="rtl"
    class="w-full min-w-0"
    :ui="{
      root: 'w-full min-w-0',
      header: 'p-3 sm:p-4 md:p-5',
      body: 'p-3 pt-0 sm:p-4 sm:pt-0 md:p-5 md:pt-0',
    }"
  >
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
          <UButton
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
      </div>
    </template>

    <!-- <ClientOnly>
      <UAlert
        v-if="!canAction"
        class="mb-3 text-sm sm:mb-4 sm:text-base"
        color="warning"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle"
      >
        <template #description>
          <p class="leading-relaxed">
            لا يمكن تنفيذ إجراءات على الطلبات في هذا الوقت (مثلاً نافذة الانضمام لم تنتهِ بعد أو حالة البطولة لا
            تسمح).
          </p>
        </template>
      </UAlert>
    </ClientOnly> -->

    <UTabs
      :items="tabItems"
      class="mb-2 w-full min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch] sm:overflow-x-visible"
      dir="rtl"
      :unmount-on-hide="false"
    >
      <template #requests-main>
        <Suspense>
          <TeamJoinRequestsPanel
            ref="mainPanelRef"
            :tournament-id="id"
            :can-action="canAction"
            mode="main"
            @mutated="refreshBothPanels"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>

      <template #requests-consider>
        <Suspense>
          <TeamJoinRequestsPanel
            ref="considerPanelRef"
            :tournament-id="id"
            :can-action="canAction"
            mode="consider"
            @mutated="refreshBothPanels"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import { TournamentState } from "~/features/tournament/models/tournament";
import Loading from "~/components/loading.vue";
import TeamJoinRequestsPanel from "~/features/tournament/join-request/components/TeamJoinRequestsPanel.vue";

const router = useRouter();
const id = useRoute().params.id.toString();

const { getSingelTournament } = useTournament();
const getTournamentReq = await getSingelTournament(id);

const tournament = computed(() => getTournamentReq.data.value?.data.tournament ?? null);
const tournamneState = computed(() => tournament.value?.state ?? null);
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

const mainPanelRef = ref<{ refresh: () => Promise<void> } | null>(null);
const considerPanelRef = ref<{ refresh: () => Promise<void> } | null>(null);

const refreshBothPanels = async () => {
  await nextTick();
  await Promise.all([
    mainPanelRef.value?.refresh?.() ?? Promise.resolve(),
    considerPanelRef.value?.refresh?.() ?? Promise.resolve(),
  ]);
};
</script>

<style scoped></style>
