<template>
  <div class="flex flex-col gap-4 py-2">
    <div
      v-if="mode === 'main'"
      class="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:items-end"
    >
      <UFormField class="min-w-0 flex-1" label="تصفية حسب حالة الطلب (الفرق)">
        <USelectMenu
          v-model="params.GetOnlyStates"
          class="w-full"
          multiple
          :items="mainStateFilterOptions"
          value-key="value"
          label-key="label"
          placeholder="اختر حالة أو أكثر"
        />
      </UFormField>
      <UButton
        color="neutral"
        variant="soft"
        size="sm"
        :disabled="!canAction"
        @click="resetMainFilters"
      >
        إعادة التصفية الافتراضية
      </UButton>
    </div>

    <div
      v-else
      class="rounded-lg border border-blue-500/20 bg-blue-50/50 px-3 py-2 text-sm dark:bg-blue-950/30"
    >
      طلبات في مرحلة <strong>دراسة المنظم</strong> — يمكن التراجع عن الدراسة أو الموافقة النهائية (لا رجوع بعد
      الموافقة).
    </div>

    <div
      v-if="canAction"
      class="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/90 p-2 dark:border-gray-800 dark:bg-gray-900/50"
    >
      <UCheckbox v-model="allSelected" :disabled="!items.length" label="تحديد كل الظاهر في الصفحة" />
      <span class="text-xs text-gray-600 dark:text-gray-400"
        >المحدد: <strong>{{ selected.length }}</strong></span
      >
      <template v-if="mode === 'main'">
        <UButton size="sm" color="error" variant="subtle" :loading="patching" :disabled="!selected.length" @click="run('cancel')">
          إلغاء الطلبات
        </UButton>
        <UButton size="sm" color="neutral" variant="subtle" :loading="patching" :disabled="!selected.length" @click="run('revert-cancel')">
          إرجاع الإلغاء
        </UButton>
        <UButton size="sm" color="primary" variant="subtle" :loading="patching" :disabled="!selected.length" @click="run('consider')">
          إحالة للدراسة
        </UButton>
      </template>
      <template v-else>
        <UButton size="sm" color="neutral" variant="subtle" :loading="patching" :disabled="!selected.length" @click="run('revert-consideration')">
          التراجع عن الدراسة
        </UButton>
        <UButton size="sm" color="success" variant="subtle" :loading="patching" :disabled="!selected.length" @click="approveOpen = true">
          موافقة نهائية…
        </UButton>
      </template>
    </div>

    <div class="overflow-x-auto">
      <UTable :loading="pending" :data="items" :columns="columns" class="min-w-[640px]">
        <template #select-cell="{ row }">
          <UCheckbox
            :model-value="selected.includes(row.original.id)"
            :disabled="!canAction"
            @update:model-value="(v: boolean) => toggleRow(row.original.id, v)"
          />
        </template>
        <template #teamName-cell="{ row }">
          <span>{{ row.original.teamName || "—" }}</span>
        </template>
        <template #ownerUserName-cell="{ row }">
          <span dir="ltr" class="tabular-nums">{{ row.original.ownerUserName || "—" }}</span>
        </template>
        <template #teammateUserName-cell="{ row }">
          <span dir="ltr">{{ row.original.teammateUserName || "—" }}</span>
        </template>
        <template #state-cell="{ row }">
          <UBadge
            :color="stateColor(row.original.state)"
            variant="subtle"
            size="sm"
          >{{ stateLabel(row.original.state) }}</UBadge>
        </template>
        <template #createdAt-cell="{ row }">
          <span>{{ formatDate(row.original.createdAt) }}</span>
        </template>
      </UTable>
    </div>

    <div class="flex justify-center sm:justify-end">
      <UPagination
        v-model:page="params.pageNumber"
        :total="totalCount"
        :page-size="params.pageSize"
      />
    </div>

    <UModal v-if="mode === 'consider'" v-model:open="approveOpen">
      <UCard>
        <template #header>
          <span class="font-semibold text-amber-800 dark:text-amber-200">تأكيد الموافقة النهائية</span>
        </template>
        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          الموافقة على <strong>{{ selected.length }}</strong> طلب{{ selected.length === 1 ? "" : "ات" }} بشكل نهائي.
          <span class="font-medium text-amber-900 dark:text-amber-100"> لا يمكن التراجع عن هذه الخطوة </span> بعد التنفيذ.
        </p>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="approveOpen = false">إلغاء</UButton>
            <UButton color="success" :loading="patching" @click="confirmApprove">تأكيد الموافقة</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils/formatDate";
import {
  TeamJoinRequestWorkflowState,
  TEAM_JOIN_MAIN_TAB_STATES,
  TEAM_JOIN_STATE_COLOR,
  TEAM_JOIN_STATE_LABEL,
  type GetTeamJoinRequestsParams,
  type TeamJoinRequestPatchAction,
} from "~/features/tournament/models/TournamentJoinRequest";

const props = withDefaults(
  defineProps<{
    tournamentId: string;
    canAction: boolean;
    mode: "main" | "consider";
  }>(),
  {},
);

const emit = defineEmits<{ mutated: [] }>();

const mainStateFilterOptions = TEAM_JOIN_MAIN_TAB_STATES.map((value) => ({
  label: TEAM_JOIN_STATE_LABEL[value],
  value,
}));

const params = ref<GetTeamJoinRequestsParams>({
  pageNumber: 1,
  pageSize: 10,
  GetOnlyStates:
    props.mode === "consider"
      ? [TeamJoinRequestWorkflowState.WaitingOrganizerConsideration]
      : [...TEAM_JOIN_MAIN_TAB_STATES],
});

watch(
  () => params.value.GetOnlyStates?.length,
  () => {
    if (props.mode === "main" && (!params.value.GetOnlyStates || params.value.GetOnlyStates.length === 0)) {
      params.value.GetOnlyStates = [...TEAM_JOIN_MAIN_TAB_STATES];
    }
  },
);

const instanceKey = props.mode === "consider" ? "consider" : "main";

const { getTeamJoinRequests, patchTeamJoinRequests } = useTournamentJoinRequest();
const { data, pending, refresh } = getTeamJoinRequests(props.tournamentId, params, instanceKey);

const items = computed(() => data.value?.data?.items ?? []);
const totalCount = computed(() => data.value?.data?.totalCount ?? 0);

const columns = [
  { id: "select", header: "تحديد", accessorKey: "select" },
  { accessorKey: "teamName", header: "الفريق" },
  { accessorKey: "ownerUserName", header: "المالك" },
  { accessorKey: "teammateUserName", header: "الزميل" },
  { accessorKey: "state", header: "الحالة" },
  { accessorKey: "createdAt", header: "التاريخ" },
];

const selected = ref<string[]>([]);
const patching = ref(false);
const approveOpen = ref(false);

watch(items, () => {
  const ids = new Set(items.value.map((i) => i.id));
  selected.value = selected.value.filter((id) => ids.has(id));
});

const allSelected = computed({
  get: () => !!items.value.length && items.value.every((i) => selected.value.includes(i.id)),
  set: (v: boolean) => {
    selected.value = v ? items.value.map((i) => i.id) : [];
  },
});

const toggleRow = (id: string, on: boolean) => {
  if (on) {
    if (!selected.value.includes(id)) selected.value = [...selected.value, id];
  } else {
    selected.value = selected.value.filter((x) => x !== id);
  }
};

const resetMainFilters = () => {
  params.value.GetOnlyStates = [...TEAM_JOIN_MAIN_TAB_STATES];
  params.value.pageNumber = 1;
};

const stateLabel = (state: string) =>
  (TEAM_JOIN_STATE_LABEL as Record<string, string>)[state] ?? state;

const stateColor = (state: string) =>
  (TEAM_JOIN_STATE_COLOR as Record<string, string>)[state] ?? "neutral";

const run = async (action: TeamJoinRequestPatchAction) => {
  if (!props.canAction) return;
  patching.value = true;
  try {
    const ok = await patchTeamJoinRequests(props.tournamentId, action, selected.value);
    if (ok) {
      selected.value = [];
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
};

const confirmApprove = async () => {
  patching.value = true;
  try {
    const ok = await patchTeamJoinRequests(props.tournamentId, "approve", selected.value);
    if (ok) {
      approveOpen.value = false;
      selected.value = [];
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
};

defineExpose({ refresh });
</script>
