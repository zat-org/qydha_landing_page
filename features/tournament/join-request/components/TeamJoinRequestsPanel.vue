<template>
  <div class="flex flex-col gap-4 py-2">
    <div v-if="mode === 'main'"
      class="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:items-end">
      <UFormField class="min-w-0 flex-1" label="تصفية حسب حالة الطلب (الفرق)">
        <USelect v-model="params.GetOnlyStates" class="w-full" multiple :items="stateOptions" value-key="value"
          label-key="label" placeholder="اختر حالة أو أكثر" />
      </UFormField>

    </div>

    <!-- <div v-else class="rounded-lg border border-blue-500/20 bg-blue-50/50 px-3 py-2 text-sm dark:bg-blue-950/30">
      طلبات في مرحلة <strong>دراسة المنظم</strong> — يمكن التراجع عن الدراسة أو الموافقة النهائية (لا رجوع بعد
      الموافقة).
    </div> -->

    <div v-if="canAction"
      class="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/90 p-2 dark:border-gray-800 dark:bg-gray-900/50">
      <template v-if="mode === 'consider'">
        <UButton size="sm" color="success" variant="subtle" :disabled="patching" @click="approveOpen = true">
          موافقة نهائية علي الطلبات 
        </UButton>
      </template>
    </div>

    <div class="overflow-x-auto">
      <UTable :loading="pending" :data="items" :columns="columns" class="min-w-[640px]">
        <template #teamName-cell="{ row }">
          <span>{{ row.original.teamName || "—" }}</span>
        </template>
        <template #creatorUsername-cell="{ row }">
          <span dir="ltr" class="tabular-nums">{{ row.original.creatorUsername || "—" }}</span>
        </template>
        <template #teammateUsername-cell="{ row }">
          <span dir="ltr">{{ row.original.teammateUsername || "—" }}</span>
        </template>
        <template #state-cell="{ row }">
          <UBadge :color="stateColor(row.original.state)" variant="subtle" size="sm">{{ stateLabel(row.original.state)
            }}</UBadge>
        </template>
        <template #createdAt-cell="{ row }">
          <span>{{ formatDate(row.original.createdAt) }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">

            <UButton size="sm" color="error" variant="subtle" :disabled="patching"
              v-if="row.original.state === TeamJoinRequestWorkflowState.WaitingOrganizerConsideration"
              @click="run('cancel', [row.original.joinRequestId])">
              إلغاء الطلب
            </UButton>
            <UButton size="sm" color="neutral" variant="subtle" :disabled="patching"
              v-if="row.original.state === TeamJoinRequestWorkflowState.CanceledByOrganizer"
              @click="run('revert-cancel', [row.original.joinRequestId])">
              إرجاع الإلغاء
            </UButton>
            <UButton size="sm" color="primary" variant="subtle" :disabled="patching"
              v-if="row.original.state === TeamJoinRequestWorkflowState.WaitingOrganizerConsideration"
              @click="run('consider', [row.original.joinRequestId])">
              إحالة للدراسة
            </UButton>
            <UButton size="sm" color="neutral" variant="subtle" :disabled="patching"
              v-if="row.original.state === TeamJoinRequestWorkflowState.WaitingOrganizerApproval"
              @click="run('revert-consideration', [row.original.joinRequestId])">
              التراجع عن الدراسة
            </UButton>
          </div>

        </template>
      </UTable>
    </div>

    <div class="flex justify-center sm:justify-end">
      <UPagination v-model:page="params.pageNumber" :total="totalCount" :page-size="params.pageSize" />
    </div>

    <UModal v-if="mode === 'consider'" v-model:open="approveOpen">

      <template #header>
        <span class="font-semibold text-amber-800 dark:text-amber-200">تأكيد الموافقة النهائية</span>
      </template>
      <template #body>

        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          الموافقة على الطلبات بشكل نهائي.
          <span class="font-medium text-amber-900 dark:text-amber-100"> لا يمكن التراجع عن هذه الخطوة </span> بعد
          التنفيذ.
        </p>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="approveOpen = false">إلغاء</UButton>
          <UButton color="success" :loading="patching" @click="confirmApprove">تأكيد الموافقة</UButton>
        </div>
      </template>

    </UModal>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils/formatDate";
import {
  TeamJoinRequestWorkflowState,
  TournamentJoinRequestState,
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


const params = ref<GetTeamJoinRequestsParams>({
  pageNumber: 1,
  pageSize: 10,
  GetOnlyStates:
    props.mode === "consider"
      ? [TeamJoinRequestWorkflowState.WaitingOrganizerApproval]
      : [...TEAM_JOIN_MAIN_TAB_STATES],
});

// watch(
//   () => params.value.GetOnlyStates?.length,
//   () => {
//     if (
//       props.mode === "main" &&
//       params.value.GetOnlyStates != null &&
//       params.value.GetOnlyStates.length === 0
//     ) {
//       params.value.GetOnlyStates = [...TEAM_JOIN_MAIN_TAB_STATES];
//     }
//   },
// );

const instanceKey = props.mode === "consider" ? "consider" : "main";

const { getTeamJoinRequests, patchTeamJoinRequests } = useTournamentJoinRequest();
const { data, pending, refresh } = getTeamJoinRequests(props.tournamentId, params, instanceKey);

const items = computed(() => data.value?.data?.items ?? []);
const totalCount = computed(() => data.value?.data?.totalCount ?? 0);

const columns = [
  { accessorKey: "teamName", header: "الفريق" },
  { accessorKey: "creatorUsername", header: "المالك" },
  { accessorKey: "teammateUsername", header: "الزميل" },
  { accessorKey: "state", header: "الحالة" },
  { accessorKey: "createdAt", header: "التاريخ" },
  { id: "actions", header: "الإجراءات", accessorKey: "actions" },
];

const patching = ref(false);
const approveOpen = ref(false);







const stateLabel = (state: string) =>
  (TEAM_JOIN_STATE_LABEL as Record<string, string>)[state] ?? state;

const stateColor = (state: string) =>
  (TEAM_JOIN_STATE_COLOR as Record<string, string>)[state] as "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral" | undefined ?? "neutral";

const stateOptions = Object.values(TeamJoinRequestWorkflowState).map((state) => ({
  label: stateLabel(state),
  value: state,
}));




const run = async (action: TeamJoinRequestPatchAction, ids: string[]) => {
  if (!props.canAction) return;
  patching.value = true;
  try {
    const ok = await patchTeamJoinRequests(props.tournamentId, action, ids);
    if (ok) {
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
};

const confirmApprove = async () => {
  patching.value = true;
  try {
    const ok = await patchTeamJoinRequests(props.tournamentId, "approve");
    if (ok) {
      approveOpen.value = false;

      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
};

defineExpose({ refresh });
</script>
