<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>
    <template v-else>
      <div class="flex flex-wrap gap-2">
        <LifecycleStatChip
          icon="i-mdi-account-group"
          label="إجمالي الفرق"
          :value="`${totalTeams} / ${expectedTeams || '—'}`"
        />
        <LifecycleStatChip
          v-if="unassignedTeamsCount > 0"
          icon="i-mdi-alert-circle-outline"
          label="غير موزعة"
          :value="unassignedTeamsCount"
        />
      </div>

      <ul
        v-if="teamsByPlace.length"
        class="divide-y divide-gray-200/80 rounded-xl border border-gray-200/80 dark:divide-gray-800 dark:border-gray-800"
      >
        <li
          v-for="row in teamsByPlace"
          :key="row.placeId"
          class="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
        >
          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white">{{ row.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ row.dateWindow }}</p>
          </div>
          <UBadge color="primary" variant="soft">
            {{ row.teamsCount }} / {{ row.capacity }}
          </UBadge>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import LifecycleStatChip from "./LifecycleStatChip.vue";
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
</script>
