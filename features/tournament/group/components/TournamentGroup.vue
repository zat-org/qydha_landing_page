<template>
  <UCard
    class="flex flex-col flex-1"
    :ui="{
      root: 'rounded-2xl border border-gray-200/90 dark:border-gray-800/90 shadow-sm overflow-hidden',
      header: 'border-b border-gray-200/90 bg-gray-50/70 dark:bg-gray-900/40 p-4 sm:p-5',
      body: 'p-4 sm:p-6 space-y-6',
    }"
  >
    <template #header>
      <GroupsHeader
        :total-groups="groups.length"
        :qual-groups-count="qualGroups.length"
        :final-group-exists="finalGroups.length > 0"
        :running-groups-count="runningGroupsCount"
        :completed-groups-count="completedGroupsCount"
      />
    </template>

    <!-- Controls Bar: Stage Filter Tabs & View Mode Switcher -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
      <!-- Stage Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none"
          :class="
            stageFilter === 'all'
              ? 'bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          "
          @click="stageFilter = 'all'"
        >
          <span>جميع المجموعات</span>
          <UBadge color="neutral" variant="subtle" size="xs" class="rounded-full px-1.5">
            {{ groups.length }}
          </UBadge>
        </button>

        <button
          v-if="qualGroups.length > 0"
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none"
          :class="
            stageFilter === 'qualification'
              ? 'bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          "
          @click="stageFilter = 'qualification'"
        >
          <UIcon name="i-heroicons-squares-2x2-20-solid" class="size-3.5" />
          <span>مرحلة التصفيات</span>
          <UBadge color="neutral" variant="subtle" size="xs" class="rounded-full px-1.5">
            {{ qualGroups.length }}
          </UBadge>
        </button>

        <button
          v-if="finalGroups.length > 0"
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none"
          :class="
            stageFilter === 'final'
              ? 'bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          "
          @click="stageFilter = 'final'"
        >
          <UIcon name="i-heroicons-trophy-20-solid" class="size-3.5" />
          <span>المرحلة النهائية</span>
          <UBadge color="neutral" variant="subtle" size="xs" class="rounded-full px-1.5">
            {{ finalGroups.length }}
          </UBadge>
        </button>
      </div>

      <!-- View Switcher -->
      <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          :class="
            viewMode === 'split'
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white font-semibold'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          "
          title="عرض الجدول والتفاصيل المنفصلة"
          @click="viewMode = 'split'"
        >
          <UIcon name="i-heroicons-table-cells" class="size-4" />
          <span class="hidden sm:inline">جدول ومفصل</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          :class="
            viewMode === 'accordion'
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white font-semibold'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          "
          title="عرض القائمة القابلة للطي"
          @click="viewMode = 'accordion'"
        >
          <UIcon name="i-heroicons-bars-3-bottom-left" class="size-4" />
          <span class="hidden sm:inline">قائمة منسدلة</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex flex-col justify-center items-center py-16 gap-3">
      <Loading />
      <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل مجموعات البطولة…</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4">
      <UAlert
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="تعذّر تحميل المجموعات"
        :description="error.message"
        :actions="[{ label: 'إعادة المحاولة', color: 'error', variant: 'outline', onClick: () => refresh() }]"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredGroups.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800/80 dark:text-gray-500 mb-3">
        <UIcon name="i-heroicons-squares-plus" class="size-8" />
      </div>
      <h3 class="text-base font-bold text-gray-900 dark:text-white">لا توجد مجموعات لعرضها حالياً</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        {{ stageFilter === 'all' ? 'سيتم إنشاء المجموعات وتوزيع الفرق تلقائياً عند بدء مرحلة التنظيم.' : 'لا توجد مجموعات تابعة لهذه المرحلة.' }}
      </p>
    </div>

    <!-- VIEW 1: Split 2-Column Grid (Groups Table Column + Details Column) -->
    <div v-else-if="viewMode === 'split'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Groups Table (Compact master list) -->
      <div class="lg:col-span-5 xl:col-span-4 space-y-3">
        <div class="overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white dark:bg-gray-950/60 shadow-xs">
          <div class="p-3 bg-gray-50/70 dark:bg-gray-900/40 border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-queue-list" class="size-4 text-primary" />
              <span class="text-xs font-bold text-gray-900 dark:text-white">قائمة المجموعات</span>
            </div>
            <UBadge color="neutral" variant="subtle" size="xs">
              {{ filteredGroups.length }} مجموعات
            </UBadge>
          </div>

          <div class="overflow-x-auto">
            <UTable
              :data="filteredGroups"
              :columns="groupTableColumns"
              :ui="{
                tr: 'cursor-pointer transition-colors',
                td: 'py-3 px-3 align-middle text-xs',
                th: 'text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30 px-3 py-2',
              }"
              class="w-full"
              @select="onRowSelect"
            >
              <!-- Group Name with Stage Indicator -->
              <template #name-cell="{ row }">
                <div
                  class="flex items-center gap-2 py-0.5 cursor-pointer"
                  :class="selectedGroup?.id === row.original.id ? 'font-bold' : ''"
                  @click="selectGroup(row.original)"
                >
                  <span
                    class="flex size-7 shrink-0 items-center justify-center rounded-lg ring-1"
                    :class="
                      selectedGroup?.id === row.original.id
                        ? 'bg-primary text-white ring-primary'
                        : isGroupFinal(row.original)
                          ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'
                    "
                  >
                    <UIcon
                      :name="
                        isGroupFinal(row.original)
                          ? 'i-heroicons-trophy-20-solid'
                          : 'i-heroicons-squares-2x2-20-solid'
                      "
                      class="size-3.5"
                    />
                  </span>
                  <div class="flex flex-col min-w-0">
                    <span
                      class="truncate text-xs font-semibold"
                      :class="
                        selectedGroup?.id === row.original.id
                          ? 'text-primary dark:text-primary-400'
                          : 'text-gray-900 dark:text-white'
                      "
                    >
                      {{ row.original.name }}
                    </span>
                    <span v-if="row.original.placeId" class="text-[10px] text-gray-400 truncate">
                      {{ placeLabel(row.original.placeId) }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- State Badge -->
              <template #state-cell="{ row }">
                <div @click="selectGroup(row.original)">
                  <UBadge
                    :color="groupStateBadgeColor(row.original.state)"
                    :variant="row.original.state === GroupState.MatchesRunning ? 'solid' : 'subtle'"
                    size="xs"
                    class="rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                  >
                    <span
                      v-if="row.original.state === GroupState.MatchesRunning"
                      class="size-1 rounded-full bg-white me-1 inline-block animate-pulse"
                    />
                    {{ groupStateBadgeText(row.original.state) }}
                  </UBadge>
                </div>
              </template>

              <!-- Actions Cell -->
              <template #actions-cell="{ row }">
                <div class="flex items-center justify-end">
                  <UButton
                    size="xs"
                    :variant="selectedGroup?.id === row.original.id ? 'solid' : 'ghost'"
                    :color="selectedGroup?.id === row.original.id ? 'primary' : 'neutral'"
                    class="rounded-lg text-[11px] px-2 py-1"
                    :icon="selectedGroup?.id === row.original.id ? 'i-heroicons-check-circle' : 'i-heroicons-chevron-left'"
                    @click.stop="selectGroup(row.original)"
                  />
                </div>
              </template>
            </UTable>
          </div>
        </div>
      </div>

      <!-- Right Column: Active Group Details (2nd column in grid) -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-4">
        <div v-if="selectedGroup" class="space-y-4">
          <!-- Active Group Summary Banner -->
          <div class="flex items-center justify-between bg-primary/8 dark:bg-primary/15 border border-primary/20 rounded-2xl p-3.5">
            <div class="flex items-center gap-2.5">
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs"
              >
                <UIcon
                  :name="
                    isGroupFinal(selectedGroup)
                      ? 'i-heroicons-trophy-20-solid'
                      : 'i-heroicons-squares-2x2-20-solid'
                  "
                  class="size-4.5"
                />
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    تفاصيل {{ selectedGroup.name }}
                  </h2>
                  <UBadge
                    :color="groupStateBadgeColor(selectedGroup.state)"
                    variant="subtle"
                    size="xs"
                    class="rounded-full text-[10px]"
                  >
                    {{ groupStateBadgeText(selectedGroup.state) }}
                  </UBadge>
                </div>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ selectedGroup.placeId ? `المكان: ${placeLabel(selectedGroup.placeId)}` : 'المكان: غير محدد' }}
                  · {{ isGroupFinal(selectedGroup) ? 'المرحلة النهائية' : 'مرحلة التصفيات' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-arrow-up-right"
                color="neutral"
                variant="ghost"
                size="xs"
                label="المخطط"
                @click="navigateToBracketGroup(selectedGroup.id)"
              />
            </div>
          </div>

          <!-- Render group content (Teams Linking or Rounds/Matches) in detail panel -->
          <Suspense>
            <GroupDetails
              v-if="selectedGroup.state === GroupState.TeamsLinking || selectedGroup.state === GroupState.Created"
              :key="`details-${selectedGroup.id}`"
              :group="selectedGroup"
              :state="tournamentState!"
            />
            <RoundsGroupDetails
              v-else
              :key="`rounds-${selectedGroup.id}`"
              :group="selectedGroup"
              :state="tournamentState!"
            />
            <template #fallback>
              <div class="flex justify-center items-center py-12">
                <Loading />
              </div>
            </template>
          </Suspense>
        </div>

        <!-- No group selected placeholder -->
        <div
          v-else
          class="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center"
        >
          <UIcon name="i-heroicons-cursor-arrow-rays" class="size-8 text-gray-400 mb-2" />
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">اختر مجموعة من القائمة لعرض تفاصيلها</p>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Accordion List -->
    <UAccordion
      v-else
      v-model="active"
      :items="accordionItems"
      class="w-full"
      :ui="{
        root: 'space-y-3',
        item: 'rounded-2xl border border-gray-200/90 dark:border-gray-800/90 overflow-hidden bg-white/95 dark:bg-gray-950/60 shadow-xs ring-1 ring-gray-200/50 dark:ring-gray-800/60 transition-all duration-200',
        trigger: 'flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-start font-semibold text-gray-900 dark:text-white hover:bg-gray-50/90 dark:hover:bg-gray-900/60 transition-colors',
        trailingIcon: 'text-gray-400 group-hover:text-primary transition-colors size-5',
        body: 'border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-950/40 p-2 sm:p-4',
      }"
    >
      <template v-for="(item, index) in accordionItems" :key="`slot-${item.group.id}`" v-slot:[item.slot]>
        <Suspense>
          <GroupDetails
            v-if="item.group.state === GroupState.TeamsLinking || item.group.state === GroupState.Created"
            :group="item.group"
            :state="tournamentState!"
          />
          <RoundsGroupDetails
            v-else
            :group="item.group"
            :state="tournamentState!"
          />
          <template #fallback>
            <div class="flex justify-center items-center py-8">
              <Loading />
            </div>
          </template>
        </Suspense>
      </template>
    </UAccordion>
  </UCard>
</template>

<script lang="ts" setup>
import GroupsHeader from "./GroupsHeader.vue";
import Loading from "~/components/loading.vue";
import GroupDetails from "./GroupDetails.vue";
import RoundsGroupDetails from "./RoundsGroupDetails.vue";
import { GroupState, GroupType, type Group } from "~/features/tournament/models/group";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useGroup } from "~/features/tournament/group/composables/group";
import type { TableColumn } from "@nuxt/ui";

interface Props {
  tournamentId: string;
}

const props = defineProps<Props>();
const active = ref<string | undefined>("0");
const stageFilter = ref<"all" | "qualification" | "final">("all");
const viewMode = ref<"split" | "accordion">("split");

const tourReq = await useSingleTournament().getSingelTournament(props.tournamentId);
const tournamentState = computed(() => tourReq.data.value?.tournament.detailedState);
const groupApi = useGroup();

const { data, pending, error, refresh, status } = groupApi.getGroups(props.tournamentId);

const groups = computed<Group[]>(() => {
  return data.value?.groups || [];
});

const isGroupFinal = (group: Group) => {
  return group.stageType === "Final" || group.type === GroupType.Final;
};

const qualGroups = computed(() => {
  return groups.value.filter(
    (g) => g.stageType === "Qualification" || g.type === GroupType.Qualification,
  );
});

const finalGroups = computed(() => {
  return groups.value.filter(
    (g) => g.stageType === "Final" || g.type === GroupType.Final,
  );
});

const hasMultipleStages = computed(() => {
  return qualGroups.value.length > 0 && finalGroups.value.length > 0;
});

const runningGroupsCount = computed(() => {
  return groups.value.filter((g) => g.state === GroupState.MatchesRunning).length;
});

const completedGroupsCount = computed(() => {
  return groups.value.filter((g) => g.state === GroupState.MatchesFinished).length;
});

const filteredGroups = computed<Group[]>(() => {
  if (stageFilter.value === "qualification") {
    return qualGroups.value;
  }
  if (stageFilter.value === "final") {
    return finalGroups.value;
  }
  return groups.value;
});

const selectedGroupId = ref<string | null>(null);

const selectedGroup = computed<Group | null>(() => {
  if (filteredGroups.value.length === 0) return null;
  if (selectedGroupId.value) {
    const found = filteredGroups.value.find((g) => g.id === selectedGroupId.value);
    if (found) return found;
  }
  return filteredGroups.value[0] || null;
});

const selectGroup = (group: Group) => {
  selectedGroupId.value = group.id;
};

const onRowSelect = (row: any) => {
  if (row?.original?.id) {
    selectedGroupId.value = row.original.id;
  }
};

const navigateToBracketGroup = (groupId: string) => {
  navigateTo({
    path: `/tournament/${props.tournamentId}/Bracket`,
    query: { group: groupId },
  });
};

const { placeLabel } = useTournamentPlaces(() => tourReq.data.value);

const groupStateBadgeText = (st: GroupState): string => {
  const map: Record<GroupState, string> = {
    [GroupState.Created]: "تم الإنشاء",
    [GroupState.TeamsLinking]: "ربط الفرق",
    [GroupState.MatchesGenerated]: "تم توليد المباريات",
    [GroupState.WaitingMatchesStarting]: "في انتظار البدء",
    [GroupState.MatchesRunning]: "المباريات جارية",
    [GroupState.MatchesFinished]: "انتهت المباريات",
  };
  return map[st] ?? st;
};

const groupStateBadgeColor = (st: GroupState): "neutral" | "primary" | "info" | "warning" | "success" => {
  const map: Record<GroupState, "neutral" | "primary" | "info" | "warning" | "success"> = {
    [GroupState.Created]: "neutral",
    [GroupState.TeamsLinking]: "info",
    [GroupState.MatchesGenerated]: "primary",
    [GroupState.WaitingMatchesStarting]: "warning",
    [GroupState.MatchesRunning]: "success",
    [GroupState.MatchesFinished]: "neutral",
  };
  return map[st] ?? "neutral";
};

const groupTableColumns: TableColumn<Group>[] = [
  { accessorKey: "name", header: "المجموعة" },
  { accessorKey: "state", header: "الحالة" },
  { accessorKey: "actions", header: "" },
];

const accordionItems = computed(() => {
  return filteredGroups.value.map((group, index) => {
    const isFinal = isGroupFinal(group);
    const place = group.placeId ? placeLabel(group.placeId) : null;
    const stagePrefix = isFinal ? "🏆 النهائي: " : "⚡ تصفيات: ";
    const title = group.name || `مجموعة ${index + 1}`;
    const statusText = groupStateBadgeText(group.state);

    const fullLabel = place
      ? `${stagePrefix}${title} · ${place} — [${statusText}]`
      : `${stagePrefix}${title} — [${statusText}]`;

    return {
      label: fullLabel,
      slot: `group-${group.id}`,
      group,
      defaultOpen: index === 0,
    };
  });
});
</script>

<style scoped>
</style>
