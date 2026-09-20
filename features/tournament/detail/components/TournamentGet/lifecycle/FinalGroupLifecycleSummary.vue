<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>

    <template v-else>
      <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
        المجموعة النهائية
      </p>

      <div
        v-if="summary"
        class="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="border-b border-gray-200/80 bg-white/60 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400"
          >
            <tr>
              <th class="px-3 py-2.5 text-start font-medium">المجموعة</th>
              <th class="px-3 py-2.5 text-center font-medium">الحالة</th>
              <th class="px-3 py-2.5 text-center font-medium">الفرق</th>
              <th class="px-3 py-2.5 text-center font-medium">المباريات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/80 dark:divide-gray-800">
            <tr class="bg-white/40 dark:bg-gray-900/20">
              <td class="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                {{ summary.name }}
              </td>
              <td class="px-3 py-2.5 text-center">
                <UBadge :color="badgeColor" variant="soft" size="sm">
                  {{ summary.stateLabel }}
                </UBadge>
              </td>
              <td
                class="px-3 py-2.5 text-center tabular-nums text-gray-900 dark:text-white"
              >
                {{ summary.teamsLinked }}
              </td>
              <td
                class="px-3 py-2.5 text-center tabular-nums text-gray-900 dark:text-white"
              >
                <span>{{ summary.matchesTotal }}</span>
                <span
                  v-if="summary.matchesFinished > 0 || summary.matchesRunning > 0"
                  class="ms-1 text-xs text-gray-500 dark:text-gray-400"
                >
                  <template v-if="summary.matchesFinished > 0">
                    · {{ summary.matchesFinished }} منتهية
                  </template>
                  <template v-if="summary.matchesRunning > 0">
                    · {{ summary.matchesRunning }} جارية
                  </template>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-gray-500">لم تُنشأ المجموعة النهائية بعد.</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import { GroupState } from "~/features/tournament/models/group";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const pending = computed(() => unref(props.lifecycleSummary.matchesPending));
const summary = computed(() => unref(props.lifecycleSummary.finalGroupSummary));

const badgeColor = computed(() => {
  const state = summary.value?.state;
  if (state === GroupState.MatchesRunning) return "success";
  if (state === GroupState.TeamsLinking) return "warning";
  if (state === GroupState.MatchesGenerated) return "info";
  return "info";
});
</script>
