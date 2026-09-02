<template>
  <div class="space-y-2">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>
    <template v-else-if="placesTree.length">
      <UAccordion
        v-model="openPlaces"
        type="multiple"
        dir="rtl"
        :items="accordionItems"
        class="w-full"
        :ui="{
          root: 'space-y-2',
          item: 'rounded-xl border border-gray-200/90 dark:border-gray-800/90 overflow-hidden',
          trigger: 'px-3 py-2.5 text-start text-sm font-medium',
          content: 'px-3 pb-3',
        }"
      >
        <template
          v-for="place in placesTree"
          :key="place.placeId"
          #[`place-${place.placeId}`]
        >
          <div class="space-y-2">
            <div
              v-for="day in place.days"
              :key="day.dateKey"
              class="rounded-lg bg-gray-50/80 px-3 py-2 dark:bg-gray-900/40"
            >
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                📅 {{ day.dateLabel }} — يوم {{ day.dayIndex }}
              </p>
              <ul v-if="day.groups.length" class="mt-2 space-y-1.5">
                <li
                  v-for="group in day.groups"
                  :key="group.id"
                  class="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <span class="font-medium text-gray-800 dark:text-gray-100">
                    ▸ {{ group.name }}
                  </span>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs text-gray-600 dark:text-gray-300">
                      {{ formatMatchSummary(group) }}
                    </span>
                    <UBadge
                      :color="groupBadgeColor(group.state)"
                      variant="soft"
                      size="sm"
                    >
                      {{ group.stateLabel }}
                    </UBadge>
                  </div>
                </li>
              </ul>
              <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                (لا توجد مجموعات)
              </p>
            </div>
          </div>
        </template>
      </UAccordion>
    </template>
    <p v-else class="text-sm text-gray-500">لا توجد أماكن تصفيات بعد.</p>
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import { GroupState } from "~/features/tournament/models/group";
import type { GroupSummaryRow } from "~/features/tournament/detail/composables/logic/tournamentLifecycleSummary.utils";

import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const pending = computed(
  () => props.lifecycleSummary.groupsHierarchyPending.value,
);
const placesTree = computed(() => props.lifecycleSummary.placesTree.value);

const openPlaces = ref<string[]>([]);

watch(
  () => placesTree.value.map((p) => p.placeId),
  (ids) => {
    if (ids.length && !openPlaces.value.length) {
      openPlaces.value = [ids[0]!];
    }
  },
  { immediate: true },
);

const accordionItems = computed(() =>
  placesTree.value.map((place) => ({
    label: `📍 ${place.label} (${place.dateWindow}) · ${place.teamsCount} فرق`,
    value: place.placeId,
    slot: `place-${place.placeId}`,
  })),
);

function formatMatchSummary(group: GroupSummaryRow): string {
  if (group.matchesTotal === 0) return "0 مباريات";
  const parts = [`${group.matchesTotal} مباريات`];
  if (group.matchesFinished > 0) {
    parts.push(`${group.matchesFinished} منتهية`);
  }
  if (group.matchesRunning > 0) {
    parts.push(`${group.matchesRunning} جارية`);
  }
  return parts.join(" · ");
}

function groupBadgeColor(state: GroupState) {
  switch (state) {
    case GroupState.MatchesRunning:
      return "success";
    case GroupState.MatchesFinished:
      return "neutral";
    case GroupState.WaitingMatchesStarting:
    case GroupState.MatchesGenerated:
      return "info";
    case GroupState.TeamsLinking:
      return "warning";
    default:
      return "neutral";
  }
}
</script>
