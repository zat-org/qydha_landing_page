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
      <div
        class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4"
      >
        <h1
          class="min-w-0 break-words text-lg font-bold leading-snug sm:text-xl md:text-2xl"
        >
          طلبات انضمام الفرق
        </h1>
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="canMutate">
            <UButton
              size="sm"
              color="primary"
              variant="soft"
              icon="i-mdi-check-all"
              label="موافقة على كل الأماكن"
              :loading="allApplicablePatching"
              :disabled="allApplicablePatching"
              @click="runAllApplicable"
            />
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              icon="i-mdi-shuffle-variant"
              label="اختيار عشوائي"
              @click="() => { randomModalOpen = true }"
            />
            <UButton
              size="sm"
              color="success"
              variant="soft"
              icon="i-heroicons-clipboard-document-check"
              label="اعتماد نهائي"
              :loading="finalApprovePatching"
              :disabled="finalApprovePatching"
              @click="() => { approveOpen = true }"
            />
          </template>
          <UButton
            color="primary"
            variant="ghost"
            size="md"
            icon="i-heroicons-arrow-path"
            @click="() => void refreshAll()"
          />
        </div>
      </div>
    </template>

    <UTabs
      v-model="activeTab"
      :items="tabItems"
      class="mb-2 w-full min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch] sm:overflow-x-visible"
      dir="rtl"
      :unmount-on-hide="false"
    >
      <template #consideration>
        <Suspense>
          <TeamJoinRequestsPanel
            ref="panelRef"
            v-model:selected-ids="selectedIds"
            :tournament-id="id"
            :can-mutate="canMutate"
            active-tab="consideration"
            @mutated="refreshAll"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
      <template #approval>
        <Suspense>
          <TeamJoinRequestsPanel
            ref="approvalPanelRef"
            v-model:selected-ids="selectedIds"
            :tournament-id="id"
            :can-mutate="canMutate"
            active-tab="approval"
            @mutated="refreshAll"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
      <template #canceled>
        <Suspense>
          <TeamJoinRequestsPanel
            v-model:selected-ids="selectedIds"
            :tournament-id="id"
            :can-mutate="canMutate"
            active-tab="canceled"
            @mutated="refreshAll"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
      <template #waitingList>
        <Suspense>
          <TeamJoinRequestsPanel
            v-model:selected-ids="selectedIds"
            :tournament-id="id"
            :can-mutate="canMutate"
            active-tab="waitingList"
            @mutated="refreshAll"
          />
          <template #fallback>
            <Loading class="mt-6 py-4 sm:mt-10 sm:py-6" />
          </template>
        </Suspense>
      </template>
    </UTabs>

    <JoinRequestRandomConsiderModal
      v-model:open="randomModalOpen"
      :places="allPlaces"
      :loading="randomPatching"
      @confirm="onRandomConfirm"
    />

    <UModal v-model:open="approveOpen">
      <template #header>
        <span class="font-semibold">تأكيد الاعتماد النهائي</span>
      </template>
      <template #body>
        <p class="text-lg leading-relaxed">
          سيتم اعتماد الطلبات ضمن السعة المتاحة وإنشاء الفرق تلقائياً. قد يُكمل
          النظام الأماكن الشاغرة من الطلبات المناسبة، وينقل الباقي (إن وافقوا)
          إلى قائمة الانتظار أو يلغي غير الموافقين.
          <br />
          <span class="font-medium text-error">
            لا يمكن التراجع عن هذه الخطوة
          </span>
          بعد التنفيذ.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="() => { approveOpen = false }">
            إلغاء
          </UButton>
          <UButton
            color="success"
            :loading="finalApprovePatching"
            @click="confirmFinalApprove"
          >
            تأكيد الاعتماد
          </UButton>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import Loading from "~/components/loading.vue";
import TeamJoinRequestsPanel from "~/features/tournament/join-request/components/TeamJoinRequestsPanel.vue";
import JoinRequestRandomConsiderModal from "~/features/tournament/join-request/components/JoinRequestRandomConsiderModal.vue";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentJoinRequest } from "~/features/tournament/join-request/composables/TournamentJoinRequest";
import { useTournamentPlacesApi } from "~/features/tournament/places/composables/useTournamentPlacesApi";
import type { JoinRequestListTab } from "~/features/tournament/join-request/components/TeamJoinRequestsPanel.vue";

const props = defineProps<{
  tournamentId?: string;
}>();

const emit = defineEmits<{ done: [] }>();

const id = props.tournamentId ?? useRoute().params.id?.toString() ?? "";

const getTourREQ = await useSingleTournament().getSingelTournament(id, {
  immediate: false,
});

if (!getTourREQ.data.value?.tournament) {
  await getTourREQ.refresh();
}

const placesREQ = useTournamentPlacesApi().getPlaces(id);
const allPlaces = computed(() => placesREQ.data.value ?? []);

const tournament = computed(() => getTourREQ.data.value?.tournament ?? null);

const canMutate = computed(
  () =>
    tournament.value?.detailedState ===
    TournamentDetailedState.ManagingJoinRequests,
);

const tabItems = [
  {
    label: "قيد المراجعة",
    slot: "consideration" as const,
    icon: "i-heroicons-queue-list",
    value: "consideration",
  },
  {
    label: "بانتظار الموافقة",
    slot: "approval" as const,
    icon: "i-heroicons-clipboard-document-check",
    value: "approval",
  },
  {
    label: "ملغاة",
    slot: "canceled" as const,
    icon: "i-mdi-cancel",
    value: "canceled",
  },
  {
    label: "قائمة الانتظار",
    slot: "waitingList" as const,
    icon: "i-mdi-format-list-bulleted",
    value: "waitingList",
  },
];

const activeTab = ref<JoinRequestListTab>("consideration");

watch(activeTab, () => {
  selectedIds.value = [];
});

const {
  patchJoinRequests,
  considerAllApplicable,
  considerRandom,
} = useTournamentJoinRequest();

const approveOpen = ref(false);
const randomModalOpen = ref(false);
const finalApprovePatching = ref(false);
const allApplicablePatching = ref(false);
const randomPatching = ref(false);
const selectedIds = ref<string[]>([]);

const panelRef = ref<{ refresh: () => Promise<void> } | null>(null);
const approvalPanelRef = ref<{ refresh: () => Promise<void> } | null>(null);

async function confirmFinalApprove() {
  finalApprovePatching.value = true;
  try {
    const ok = await patchJoinRequests(id, "approve");
    if (ok) {
      approveOpen.value = false;
      await refreshAll();
      emit("done");
    }
  } finally {
    finalApprovePatching.value = false;
  }
}

async function runAllApplicable() {
  allApplicablePatching.value = true;
  try {
    const ok = await considerAllApplicable(id);
    if (ok) await refreshAll();
  } finally {
    allApplicablePatching.value = false;
  }
}

async function onRandomConfirm(count: number, placeId: string) {
  randomPatching.value = true;
  try {
    const ok = await considerRandom(id, count, placeId);
    if (ok) {
      randomModalOpen.value = false;
      await refreshAll();
    }
  } finally {
    randomPatching.value = false;
  }
}

const refreshAll = async () => {
  await nextTick();
  await Promise.all([
    getTourREQ.refresh() ?? Promise.resolve(),
    placesREQ.refresh?.() ?? Promise.resolve(),
    panelRef.value?.refresh?.() ?? Promise.resolve(),
    approvalPanelRef.value?.refresh?.() ?? Promise.resolve(),
  ]);
};
</script>
