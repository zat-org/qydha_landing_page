<template>
  <UCard dir="rtl">
    <template #header>
      <div class="flex flex-wrap justify-between gap-4">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="router.back()"
          />
          <h1 class="text-xl font-bold sm:text-2xl">طلبات انضمام الفرق</h1>
        </div>
      </div>
    </template>

    <ClientOnly>
      <UAlert
        v-if="!canAction"
        class="mb-4"
        color="warning"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle"
      >
        <template #description>
          <p>
            لا يمكن تنفيذ إجراءات على الطلبات في هذا الوقت (مثلاً نافذة الانضمام لم تنتهِ بعد أو حالة البطولة لا
            تسمح).
          </p>
        </template>
      </UAlert>
    </ClientOnly>

    <UTabs :items="tabItems" class="mb-2" dir="rtl" :unmount-on-hide="false">
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
            <Loading class="mt-10" />
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
            <Loading class="mt-10" />
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
