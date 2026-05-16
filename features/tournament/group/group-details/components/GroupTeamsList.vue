<template>
  <div
    class="mx-3 mb-3 mt-3 flex min-h-0 max-h-[min(72vh,720px)] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white/90 shadow-sm dark:border-gray-800/90 dark:bg-gray-900/50 sm:mx-4 sm:mb-4"
  >
    <template v-if="tableData.length > 0">
      <div
        class="flex shrink-0 flex-col gap-3 border-b border-gray-200/90 bg-gray-50/80 px-3 py-2.5 dark:border-gray-800/90 dark:bg-gray-900/40 sm:flex-row sm:items-center sm:justify-between sm:px-4"
        role="group"
        aria-label="تصفية الفرق وطريقة العرض"
      >
        <div class="min-w-0 flex-1 sm:max-w-lg">
          <UInput
            :model-value="teamNameFilter"
            size="sm"
            placeholder="ابحث باسم الفريق أو أحد اللاعبين…"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            aria-label="تصفية الفرق بالاسم"
            @update:model-value="emit('update:teamNameFilter', $event)"
            @keydown.escape.prevent="emit('update:teamNameFilter', '')"
          >
            <template v-if="teamNameFilter.trim()" #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-mdi-close"
                size="xs"
                class="p-1"
                aria-label="مسح البحث"
                @click="emit('update:teamNameFilter', '')"
              />
            </template>
          </UInput>
        </div>
        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <p
            v-if="teamNameFilter.trim()"
            class="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400"
          >
            {{ filteredTableData.length }} من {{ tableData.length }}
          </p>
          <div
            class="inline-flex items-center gap-0.5 rounded-xl border border-gray-200/90 bg-white/90 p-0.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/80"
          >
            <UButton
              :color="teamsViewMode === 'table' ? 'primary' : 'neutral'"
              :variant="teamsViewMode === 'table' ? 'solid' : 'ghost'"
              size="xs"
              icon="i-mdi-table-row"
              label="جدول"
              :aria-pressed="teamsViewMode === 'table'"
              class="min-w-[4.5rem]"
              @click="emit('update:teamsViewMode', 'table')"
            />
            <UButton
              :color="teamsViewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="teamsViewMode === 'grid' ? 'solid' : 'ghost'"
              size="xs"
              icon="i-mdi-view-grid-outline"
              label="شبكة"
              :aria-pressed="teamsViewMode === 'grid'"
              class="min-w-[4.5rem]"
              @click="emit('update:teamsViewMode', 'grid')"
            />
          </div>
        </div>
      </div>

      <slot name="toolbar" :teams-view-mode="teamsViewMode" />

      <div
        class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
        role="region"
        aria-label="قائمة الفرق"
      >
        <div
          v-if="filteredTableData.length === 0 && teamNameFilter.trim()"
          class="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/80"
          >
            <UIcon name="i-mdi-filter-remove-outline" class="size-8 text-gray-400" />
          </div>
          <p class="max-w-sm text-sm font-medium text-gray-700 dark:text-gray-200">
            لا توجد فرق تطابق البحث الحالي.
          </p>
          <UButton
            size="sm"
            color="neutral"
            variant="soft"
            icon="i-mdi-backspace-outline"
            label="مسح البحث"
            @click="emit('update:teamNameFilter', '')"
          />
        </div>

        <template v-else>
          <div
            v-show="teamsViewMode === 'table'"
            class="divide-y divide-gray-100 dark:divide-gray-800/90"
            role="list"
            :aria-label="selectable ? 'قائمة الفرق — اضغط للتحديد' : 'قائمة الفرق'"
          >
            <component
              :is="selectable ? 'button' : 'div'"
              v-for="row in filteredTableData"
              :key="`t-${row.id}`"
              :type="selectable ? 'button' : undefined"
              class="flex w-full items-center gap-3 px-3 py-3.5 text-start transition-colors sm:px-4"
              :class="rowClasses(row.id)"
              :aria-pressed="selectable ? !!selectedTeams[row.id] : undefined"
              @click="onRowClick(row.id)"
            >
              <div class="flex min-w-0 flex-1 items-start gap-3">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
                >
                  <UIcon name="i-mdi-account-group-outline" class="size-5" />
                </span>
                <span
                  class="min-w-0 text-sm font-medium leading-snug text-gray-900 dark:text-gray-100"
                >
                  {{ row.teamName }}
                </span>
              </div>
              <span
                v-if="selectable"
                class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
                :class="
                  selectedTeams[row.id]
                    ? 'border-primary bg-primary text-white shadow-sm shadow-primary/25'
                    : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/80'
                "
                aria-hidden="true"
              >
                <UIcon
                  :name="
                    selectedTeams[row.id]
                      ? 'i-mdi-check'
                      : 'i-mdi-checkbox-blank-circle-outline'
                  "
                  class="size-5"
                  :class="selectedTeams[row.id] ? '' : 'text-gray-400 dark:text-gray-500'"
                />
              </span>
            </component>
          </div>

          <div
            v-show="teamsViewMode === 'grid'"
            class="p-3 sm:p-4"
            role="list"
            :aria-label="selectable ? 'بطاقات الفرق — اضغط للتحديد' : 'بطاقات الفرق'"
          >
            <div
              class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <component
                :is="selectable ? 'button' : 'div'"
                v-for="row in filteredTableData"
                :key="`g-${row.id}`"
                :type="selectable ? 'button' : undefined"
                class="relative flex h-full min-h-[8.5rem] flex-col gap-3 rounded-2xl border p-4 text-start transition-all duration-200"
                :class="gridClasses(row.id)"
                :aria-pressed="selectable ? !!selectedTeams[row.id] : undefined"
                @click="onRowClick(row.id)"
              >
                <div
                  v-if="selectable"
                  class="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full border-2 transition-all duration-150"
                  :class="
                    selectedTeams[row.id]
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/90'
                  "
                  aria-hidden="true"
                >
                  <UIcon
                    :name="
                      selectedTeams[row.id]
                        ? 'i-mdi-check'
                        : 'i-mdi-checkbox-blank-circle-outline'
                    "
                    class="size-4"
                    :class="selectedTeams[row.id] ? '' : 'text-gray-400 dark:text-gray-500'"
                  />
                </div>
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
                >
                  <UIcon name="i-mdi-account-group-outline" class="size-6" />
                </div>
                <p
                  class="line-clamp-4 min-h-0 flex-1 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100"
                >
                  {{ row.teamName }}
                </p>
              </component>
            </div>
          </div>
        </template>
      </div>
    </template>

    <slot v-else name="empty" />
  </div>
</template>

<script lang="ts" setup>
import type { GroupTeamRow } from "../types";

const props = defineProps<{
  tableData: GroupTeamRow[];
  filteredTableData: GroupTeamRow[];
  teamNameFilter: string;
  teamsViewMode: "table" | "grid";
  selectable: boolean;
  selectedTeams: Record<string, boolean>;
}>();

const emit = defineEmits<{
  "update:teamNameFilter": [value: string];
  "update:teamsViewMode": [value: "table" | "grid"];
  toggleTeam: [id: string];
}>();

function rowClasses(teamId: string) {
  if (!props.selectable) return "";
  return props.selectedTeams[teamId]
    ? "cursor-pointer bg-primary/[0.08] ring-1 ring-inset ring-primary/35 hover:bg-primary/[0.11] dark:bg-primary/20"
    : "cursor-pointer hover:bg-gray-50 active:bg-gray-100/80 dark:hover:bg-gray-800/60 dark:active:bg-gray-800";
}

function gridClasses(teamId: string) {
  if (!props.selectable) {
    return "border-gray-200/90 bg-white/95 dark:border-gray-800 dark:bg-gray-900/45";
  }
  return props.selectedTeams[teamId]
    ? "cursor-pointer border-primary/55 bg-primary/[0.07] shadow-md shadow-primary/10 ring-2 ring-primary/35 dark:bg-primary/15"
    : "cursor-pointer border-gray-200/90 bg-white/95 hover:border-primary/35 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/45 dark:hover:border-primary/40";
}

function onRowClick(id: string) {
  if (!props.selectable) return;
  emit("toggleTeam", id);
}
</script>
