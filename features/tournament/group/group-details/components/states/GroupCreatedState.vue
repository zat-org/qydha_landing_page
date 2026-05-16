<template>
  <GroupTeamsList
    :table-data="tableData"
    :filtered-table-data="filteredTableData"
    :team-name-filter="teamNameFilter"
    :teams-view-mode="teamsViewMode"
    :selectable="false"
    :selected-teams="{}"
    @update:team-name-filter="teamNameFilter = $event"
    @update:teams-view-mode="teamsViewMode = $event"
  >
    <template #empty>
      <div
        class="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-14 text-center"
      >
        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/80"
        >
          <UIcon
            name="i-mdi-account-group-outline"
            class="size-9 text-gray-400 dark:text-gray-500"
          />
        </div>
        <div class="max-w-sm space-y-1">
          <p class="text-base font-semibold text-gray-900 dark:text-white">
            لا توجد فرق بعد
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ستظهر الفرق هنا بعد بدء مرحلة ربط الفرق بالمجموعة.
          </p>
        </div>
      </div>
    </template>
  </GroupTeamsList>
</template>

<script lang="ts" setup>
import type { DetailGroup } from "~/features/tournament/models/group";
import { useGroupTeamsTable } from "../../composables";
import GroupTeamsList from "../GroupTeamsList.vue";

const props = defineProps<{
  groupDetails: DetailGroup;
}>();

const { teamsViewMode, teamNameFilter, tableData, filteredTableData } =
  useGroupTeamsTable(() => props.groupDetails);
</script>
