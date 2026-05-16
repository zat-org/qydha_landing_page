<template>
  <div class="flex flex-col gap-4 py-2">
    <div v-if="mode === 'main'"
      class="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:items-end">
      <UFormField class="min-w-0 flex-1" label="تصفية حسب الفريق">
        <UInput placeholder="ادخل اسم الفريق" @input="debouncedSearch" />
      </UFormField>
      <UFormField class="min-w-0 flex-1" label="تصفية حسب حالة الطلب (الفرق)">
        <USelect v-model="params.GetOnlyStates" class="w-full" multiple :items="stateOptions" value-key="value"
          label-key="label" placeholder="اختر حالة أو أكثر" />
      </UFormField>
      <UButtonGroup  v-if="showActions">
        <UInput v-model="numberOfTeams" type="number" placeholder="ادخل عدد الفرق" :min="1" :max="props.numberOfTeams">
          <template #trailing>
            <span class="text-gray-500 text-sm">فريق</span>
          </template>
        </UInput>
        <UButton color="primary" size="md" label="موافقة اوليه " :disabled="!showActions" :loading="patching" @click="IntialApproveRandomTeams" />
      </UButtonGroup>
    </div>
    <div v-else-if="canAction" class="flex flex-col gap-3">

      <UAlert color="info" variant="subtle" icon="i-mdi-information-outline" :title="`عدد الفرق التي سيتم الموافق عنها نهائيا هم ${numberOfTeams} فريق`" />
      <UFormField class="min-w-0 flex-1" label="تصفية حسب الفريق">
        <UInput placeholder="ادخل اسم الفريق" @input="debouncedSearch" />
      </UFormField>
    </div>

    <!-- <div v-else class="rounded-lg border border-blue-500/20 bg-blue-50/50 px-3 py-2 text-sm dark:bg-blue-950/30">
      طلبات في مرحلة <strong>دراسة المنظم</strong> — يمكن التراجع عن الدراسة أو الموافقة النهائية (لا رجوع بعد
      الموافقة).
    </div> -->

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
              موافقه اوليه
            </UButton>
            <UButton size="sm" color="neutral" variant="subtle" :disabled="patching"
              v-if="row.original.state === TeamJoinRequestWorkflowState.WaitingOrganizerApproval"
              @click="run('revert-consideration', [row.original.joinRequestId])">
              التراجع عن الموافقة الاوليه
            </UButton>
          </div>

        </template>
      </UTable>
    </div>

    <div class="flex justify-center sm:justify-end">
      <UPagination v-model:page="params.pageNumber" :total="totalCount" :page-size="params.pageSize" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
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

const debouncedSearch = useDebounceFn((value: Event) => {
  const input = value.target as HTMLInputElement;
  params.value.searchToken = input.value ? input.value : null;
}, 1000);

const props = withDefaults(
  defineProps<{
    tournamentId: string;
    canAction: boolean;
    mode: "main" | "consider";
    showActions: boolean;
    numberOfTeams: number;
  }>(),
  {},
);
const numberOfTeams = ref(props.numberOfTeams);

const emit = defineEmits<{ mutated: [] }>();


const params = ref<GetTeamJoinRequestsParams>({
  pageNumber: 1,
  pageSize: 10,
  searchToken: null,
  GetOnlyStates:
    props.mode === "consider"
      ? [TeamJoinRequestWorkflowState.WaitingOrganizerApproval]
      : [...TEAM_JOIN_MAIN_TAB_STATES],
});



const instanceKey = props.mode === "consider" ? "consider" : "main";

const { getTeamJoinRequests, patchTeamJoinRequests  } = useTournamentJoinRequest();

const { data, pending, refresh } = getTeamJoinRequests(props.tournamentId, params, instanceKey);

const items = computed(() => data.value?.data?.items ?? []);
const totalCount = computed(() => data.value?.data?.totalCount ?? 0);
const columns = computed(() => {
  return [
    { accessorKey: "teamName", header: "الفريق" },
    { accessorKey: "creatorUsername", header: "المالك" },
    { accessorKey: "teammateUsername", header: "الزميل" },
    { accessorKey: "state", header: "الحالة" },
    { accessorKey: "createdAt", header: "التاريخ" },
    ...(props.showActions ? [{ id: "actions", header: "الإجراءات", accessorKey: "actions" }] : []),
  ];
});
const patching = ref(false);

const { IntialApproveTeams } = useTournamentJoinRequest();
const IntialApproveRandomTeams = async () => {
  patching.value = true;
  try {
    const ok = await IntialApproveTeams(props.tournamentId, numberOfTeams.value);
    if (ok) {
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
};





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

defineExpose({ refresh, totalCount });
</script>
