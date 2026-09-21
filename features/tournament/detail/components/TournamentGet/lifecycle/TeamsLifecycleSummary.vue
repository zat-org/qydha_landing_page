<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p
        v-if="!pending"
        class="text-sm text-gray-600 dark:text-gray-300"
      >
        إجمالي الفرق:
        <span class="font-semibold tabular-nums text-gray-900 dark:text-white">
          {{ totalTeams }} / {{ expectedTeams || "—" }}
        </span>
        <span
          v-if="unassignedTeamsCount > 0"
          class="ms-2 text-warning"
        >
          ({{ unassignedTeamsCount }} غير موزعة)
        </span>
      </p>
      <span v-else />
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrow-path"
        :loading="pending"
        :disabled="pending"
        aria-label="تحديث الفرق"
        @click="() => void onRefresh()"
      />
    </div>

    <div v-if="pending" class="py-4">
      <Loading />
    </div>
    <template v-else>
      <div
        v-if="teamsByPlace.length"
        class="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="border-b border-gray-200/80 bg-gray-50/80 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400"
          >
            <tr>
              <th class="px-3 py-2.5 text-start font-medium">المكان</th>
              <th class="px-3 py-2.5 text-center font-medium">الفرق الموجودة</th>
              <th class="px-3 py-2.5 text-center font-medium">الفرق المطلوبة</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/80 dark:divide-gray-800">
            <tr
              v-for="row in teamsByPlace"
              :key="row.placeId"
              class="bg-white/40 dark:bg-gray-900/20"
            >
              <td class="px-3 py-2.5">
                <span
                  class="inline-flex items-center gap-1.5 font-medium text-gray-900 dark:text-white"
                >
                  <UTooltip
                    v-if="isPlaceCapacityMet(row)"
                    text="اكتمل العدد المطلوب لهذا المكان"
                  >
                    <UIcon
                      name="i-mdi-check-circle"
                      class="size-4 shrink-0 text-success"
                    />
                  </UTooltip>
                  {{ row.label }}
                  <UBadge
                    :color="row.stageType === 'Final' ? 'primary' : 'neutral'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ row.stageType === "Final" ? "نهائي" : "تصفيات" }}
                  </UBadge>
                </span>
                <p
                  v-if="row.dateWindow && row.dateWindow !== '—'"
                  class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ row.dateWindow }}
                </p>
              </td>
              <td
                class="px-3 py-2.5 text-center tabular-nums text-gray-900 dark:text-white"
              >
                {{ row.teamsCount }}
              </td>
              <td
                class="px-3 py-2.5 text-center tabular-nums text-gray-900 dark:text-white"
              >
                {{ row.capacity }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-gray-500">لا توجد أماكن لعرضها.</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import type { TeamsByPlaceRow } from "~/features/tournament/detail/composables/logic/tournamentLifecycleSummary.utils";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const pending = computed(() => props.lifecycleSummary.teamsPending.value);
const totalTeams = computed(() => props.lifecycleSummary.totalTeams.value);
const expectedTeams = computed(() => props.lifecycleSummary.expectedTeams.value);
const unassignedTeamsCount = computed(
  () => props.lifecycleSummary.unassignedTeamsCount.value,
);
const teamsByPlace = computed(() => props.lifecycleSummary.teamsByPlace.value);

function isPlaceCapacityMet(row: TeamsByPlaceRow): boolean {
  return row.capacity > 0 && row.teamsCount >= row.capacity;
}

async function onRefresh() {
  await props.lifecycleSummary.refreshTeams();
}
</script>
