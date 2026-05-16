<template>
  <GroupTeamsList
    :table-data="tableData"
    :filtered-table-data="filteredTableData"
    :team-name-filter="teamNameFilter"
    :teams-view-mode="teamsViewMode"
    :selectable="true"
    :selected-teams="selectedTeams"
    @update:team-name-filter="teamNameFilter = $event"
    @update:teams-view-mode="teamsViewMode = $event"
    @toggle-team="toggleTeam"
  >
    <template #toolbar="{ teamsViewMode: viewMode }">
      <div
        class="flex shrink-0 flex-col gap-2 border-b border-primary/15 bg-primary/[0.04] px-3 py-3 dark:bg-primary/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-4"
      >
        <div class="flex items-start gap-2 text-start">
          <UIcon name="i-mdi-gesture-tap" class="mt-0.5 size-5 shrink-0 text-primary" />
          <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            <span class="font-semibold text-gray-800 dark:text-gray-100">
              {{
                viewMode === "table"
                  ? "اختر الفرق بالضغط على الصف."
                  : "اختر الفرق بالضغط على البطاقة."
              }}
            </span>
            ثم استخدم «إزالة من المجموعة» أعلاه.
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-mdi-checkbox-multiple-marked-outline"
            label="تحديد الكل"
            @click="selectAllTeams"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-mdi-close-circle-outline"
            label="إلغاء التحديد"
            :disabled="selectedTeamsIds.length === 0"
            @click="clearTeamSelection"
          />
        </div>
      </div>
    </template>

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
            اربط الفرق بالمجموعة لبدء الترتيب وإنشاء المباريات لاحقاً.
          </p>
        </div>
        <UButton
          color="primary"
          variant="soft"
          icon="i-mdi-plus"
          label="إضافة أول فريق"
          size="md"
          class="mt-1"
          @click="actions.linkTeam()"
        />
      </div>
    </template>
  </GroupTeamsList>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { DetailGroup } from "~/features/tournament/models/group";
import type { GroupDetailsActions } from "../../types";
import { useGroupTeamsTable } from "../../composables";
import GroupTeamsList from "../GroupTeamsList.vue";

const props = defineProps<{
  groupDetails: DetailGroup;
  actions: GroupDetailsActions;
  selectedTeams: Record<string, boolean>;
}>();

const emit = defineEmits<{
  "update:selectedTeams": [value: Record<string, boolean>];
}>();

const { teamsViewMode, teamNameFilter, tableData, filteredTableData } =
  useGroupTeamsTable(() => props.groupDetails);

const selectedTeams = computed({
  get: () => props.selectedTeams,
  set: (value) => emit("update:selectedTeams", value),
});

const selectedTeamsIds = computed(() =>
  Object.entries(selectedTeams.value)
    .filter(([, on]) => on)
    .map(([id]) => id),
);

function toggleTeam(id: string) {
  selectedTeams.value = {
    ...selectedTeams.value,
    [id]: !selectedTeams.value[id],
  };
}

function selectAllTeams() {
  const next = { ...selectedTeams.value };
  for (const row of filteredTableData.value) {
    next[row.id] = true;
  }
  selectedTeams.value = next;
}

function clearTeamSelection() {
  selectedTeams.value = {};
}
</script>
