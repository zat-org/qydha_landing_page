<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>

    <template v-else-if="summary">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        نافذة الاستقبال: {{ summary.joinWindow }}
      </p>

      <div class="flex flex-wrap gap-2">
        <LifecycleStatChip
          icon="i-mdi-inbox-arrow-down"
          label="الطلبات"
          :value="
            summary.max != null
              ? `${summary.total} / ${summary.max}`
              : summary.total
          "
        />
        <LifecycleStatChip
          icon="i-mdi-clock-outline"
          label="قيد المراجعة"
          :value="summary.pending"
        />
        <LifecycleStatChip
          icon="i-mdi-eye-outline"
          label="بانتظار الموافقة"
          :value="summary.underReview"
        />
        <LifecycleStatChip
          icon="i-mdi-check-circle-outline"
          label="مقبولة"
          :value="summary.accepted"
        />
        <LifecycleStatChip
          icon="i-mdi-format-list-bulleted"
          label="قائمة الانتظار"
          :value="summary.waitingList"
        />
        <LifecycleStatChip
          icon="i-mdi-cancel"
          label="ملغاة"
          :value="summary.canceled"
        />
      </div>

      <div v-if="summary.placeRows.length" class="space-y-0">
        <div
          class="flex flex-col gap-2 rounded-t-xl border border-b-0 border-gray-200/80 bg-gray-50/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
        >
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            حسب مكان التصفيات
          </p>

          <div
            v-if="canMutate && tournamentId"
            class="flex flex-wrap items-center gap-2"
          >
            <JoinRequestBulkActions
              compact
              :tournament-id="tournamentId"
              :places="places"
              :can-mutate="canMutate"
              :show-random="false"
              @success="onBulkSuccess"
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
          </div>
        </div>

        <div
          class="overflow-x-auto rounded-b-xl border border-gray-200/80 dark:border-gray-800"
        >
          <table class="min-w-full text-sm">
            <thead
              class="border-b border-gray-200/80 bg-white/60 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400"
            >
              <tr>
                <th class="px-3 py-2 text-start font-medium">المكان</th>
                <th class="px-3 py-2 text-center font-medium">السعة</th>
                <th class="px-3 py-2 text-center font-medium">
                  {{ choseColumnLabel }}
                </th>
                <th
                  v-if="summary.isManagingJoinRequests"
                  class="px-3 py-2 text-center font-medium"
                >
                  معيّنة
                </th>
                <th class="px-3 py-2 text-center font-medium">
                  {{ remainingLabel }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200/80 dark:divide-gray-800">
              <tr
                v-for="row in summary.placeRows"
                :key="row.isNoPreference ? 'no-preference' : row.placeId!"
                class="bg-white/40 dark:bg-gray-900/20"
              >
                <td class="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                  <span class="inline-flex items-center gap-1.5">
                    <UIcon
                      v-if="row.isNoPreference"
                      name="i-mdi-map-marker-question-outline"
                      class="size-4 shrink-0 text-gray-400"
                    />
                    {{ row.label }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-center tabular-nums">
                  {{ formatCell(row, "capacity") }}
                </td>
                <td class="px-3 py-2.5 text-center tabular-nums">
                  {{ row.choseCount }}
                </td>
                <td
                  v-if="summary.isManagingJoinRequests"
                  class="px-3 py-2.5 text-center tabular-nums"
                >
                  {{ formatCell(row, "assignedCount") }}
                </td>
                <td class="px-3 py-2.5 text-center tabular-nums">
                  {{ formatCell(row, "remaining") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <p v-else class="text-sm text-gray-500">لا تتوفر بيانات الطلبات.</p>

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
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import LifecycleStatChip from "./LifecycleStatChip.vue";
import JoinRequestBulkActions from "~/features/tournament/join-request/components/JoinRequestBulkActions.vue";
import { useTournamentJoinRequest } from "~/features/tournament/join-request/composables/TournamentJoinRequest";
import type { JoinRequestPlaceSummaryRow } from "~/features/tournament/detail/composables/logic/tournamentLifecycleSummary.utils";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const pending = computed(() => props.lifecycleSummary.joinPending.value);
const summary = computed(() => props.lifecycleSummary.joinSummary.value);
const canMutate = computed(
  () => props.lifecycleSummary.canMutateJoinRequests.value,
);
const tournamentId = computed(() => props.lifecycleSummary.tournamentId.value);
const places = computed(() => props.lifecycleSummary.joinRequestPlaces.value);

const remainingLabel = computed(() =>
  summary.value?.isManagingJoinRequests ? "متبقي للتعيين" : "متبقي للسعة",
);

const choseColumnLabel = computed(() =>
  summary.value?.isManagingJoinRequests ? "اختاروا" : "اختاروا / قيد المراجعة",
);

const { patchJoinRequests } = useTournamentJoinRequest();

const approveOpen = ref(false);
const finalApprovePatching = ref(false);

function formatCell(
  row: JoinRequestPlaceSummaryRow,
  field: "capacity" | "assignedCount" | "remaining",
): string | number {
  if (row.isNoPreference) return "—";
  const value = row[field];
  return value ?? "—";
}

async function onBulkSuccess() {
  await props.lifecycleSummary.refresh();
}

async function confirmFinalApprove() {
  const id = tournamentId.value;
  if (!id) return;

  finalApprovePatching.value = true;
  try {
    const ok = await patchJoinRequests(id, "approve");
    if (ok) {
      approveOpen.value = false;
      await props.lifecycleSummary.refresh();
    }
  } finally {
    finalApprovePatching.value = false;
  }
}
</script>
