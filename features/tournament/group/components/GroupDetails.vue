<template>
    <UCard class="flex min-h-0 flex-col overflow-hidden ring-1 ring-gray-200/90 dark:ring-gray-800/90" :ui="{
        root: 'rounded-2xl shadow-md shadow-gray-900/5 dark:shadow-none overflow-hidden flex flex-col min-h-[320px]',
        header:
            'border-b border-gray-200/90 bg-gradient-to-l from-gray-50/95 to-white dark:from-gray-950/80 dark:to-gray-950/95 dark:border-gray-800/90 px-4 py-4 sm:px-5',
        body: 'flex flex-col flex-1 min-h-0 p-0 bg-gray-50/30 dark:bg-gray-950/40',
    }">
        <template #header>
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
                                {{ group.name }}
                            </h3>
                            <UBadge v-if="groupDetails" color="neutral" variant="subtle" size="sm" class="font-medium">
                                {{ groupStateLabel(groupDetails.state) }}
                            </UBadge>
                            <UBadge v-else color="neutral" variant="outline" size="sm">
                                جاري التحميل…
                            </UBadge>
                        </div>
                        <p class="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                            إدارة الفرق المرتبطة بهذه المجموعة ثم إنشاء المباريات عند الجاهزية.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-stretch gap-2 sm:justify-end">
                        <UButton color="success" variant="soft" size="sm" icon="i-mdi-tournament"
                            label="إنشاء المباريات" class="min-h-10" @click="createMatches" />
                        <template v-if="groupDetails?.state === GroupState.TeamsLinking">
                            <UButton color="primary" icon="i-mdi-plus" variant="soft" size="sm" label="إضافة فريق"
                                class="min-h-10" @click="linkTeam" />
                            <UButton color="error" icon="i-mdi-account-minus-outline" variant="soft" size="sm"
                                label="إزالة من المجموعة" class="min-h-10" :disabled="selectedTeamsIds.length === 0"
                                @click="unlinkTeam" />
                        </template>
                    </div>
                </div>

                <Transition enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1">
                    <div v-if="groupDetails && selectedTeamsIds.length > 0"
                        class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/25 bg-primary/[0.06] px-3 py-2 text-sm dark:bg-primary/10">
                        <span class="font-medium text-primary">
                            تم تحديد {{ selectedTeamsIds.length }}
                            {{ selectedTeamsIds.length === 1 ? 'فريق' : 'فرق' }}
                        </span>
                        <span class="text-xs text-gray-600 dark:text-gray-400">
                            يمكنك إزالتها من المجموعة بالزر أعلاه
                        </span>
                    </div>
                </Transition>
            </div>
        </template>

        <!-- Loading -->
        <div v-if="groupDetailREQ.pending.value"
            class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
            <loading />
            <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل فرق المجموعة…</p>
        </div>

        <!-- Error -->
        <div v-else-if="groupDetailREQ.error.value" class="flex flex-1 items-center p-4 sm:p-6">
            <UAlert class="w-full" color="error" variant="soft" icon="i-mdi-alert-circle-outline"
                title="تعذّر تحميل تفاصيل المجموعة" :description="groupDetailREQ.error.value.message" />
        </div>

        <!-- Content -->
        <div v-else-if="groupDetails" class="flex min-h-0 flex-1 flex-col">
            <div
                class="mx-3 mb-3 mt-3 flex min-h-0 max-h-[min(72vh,720px)] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white/90 shadow-sm dark:border-gray-800/90 dark:bg-gray-900/50 sm:mx-4 sm:mb-4"
            >
                <template v-if="tableData.length > 0">
                    <!-- تصفية بالاسم + طريقة العرض (جدول / شبكة) -->
                    <div
                        class="flex shrink-0 flex-col gap-3 border-b border-gray-200/90 bg-gray-50/80 px-3 py-2.5 dark:border-gray-800/90 dark:bg-gray-900/40 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                        role="group"
                        aria-label="تصفية الفرق وطريقة العرض"
                    >
                        <div class="min-w-0 flex-1 sm:max-w-lg">
                            <UInput
                                v-model="teamNameFilter"
                                size="sm"
                                placeholder="ابحث باسم الفريق أو أحد اللاعبين…"
                                class="w-full"
                                :ui="{ trailing: 'pe-1' }"
                                aria-label="تصفية الفرق بالاسم"
                                @keydown.escape.prevent="teamNameFilter = ''"
                            >
                                <template v-if="teamNameFilter.trim()" #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="ghost"
                                        icon="i-mdi-close"
                                        size="xs"
                                        class="p-1"
                                        aria-label="مسح البحث"
                                        @click="teamNameFilter = ''"
                                    />
                                </template>
                            </UInput>
                        </div>
                        <div class="flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0">
                            <p
                                v-if="teamNameFilter.trim()"
                                class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
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
                                    @click="teamsViewMode = 'table'"
                                />
                                <UButton
                                    :color="teamsViewMode === 'grid' ? 'primary' : 'neutral'"
                                    :variant="teamsViewMode === 'grid' ? 'solid' : 'ghost'"
                                    size="xs"
                                    icon="i-mdi-view-grid-outline"
                                    label="شبكة"
                                    :aria-pressed="teamsViewMode === 'grid'"
                                    class="min-w-[4.5rem]"
                                    @click="teamsViewMode = 'grid'"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- تلميح + اختصارات تحديد (مرحلة ربط الفرق فقط) -->
                    <div
                        v-if="isTeamsLinking"
                        class="flex shrink-0 flex-col gap-2 border-b border-primary/15 bg-primary/[0.04] px-3 py-3 dark:bg-primary/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-4"
                    >
                        <div class="flex items-start gap-2 text-start">
                            <UIcon name="i-mdi-gesture-tap" class="mt-0.5 size-5 shrink-0 text-primary" />
                            <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                <span class="font-semibold text-gray-800 dark:text-gray-100">
                                    {{ teamsViewMode === 'table' ? 'اختر الفرق بالضغط على الصف.' : 'اختر الفرق بالضغط على البطاقة.' }}
                                </span>
                                ثم استخدم «إزالة من المجموعة» أعلاه.
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 justify-end shrink-0">
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

                    <!-- منطقة تمرير واحدة للفرق (جدول أو شبكة) -->
                    <div
                        class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
                        role="region"
                        aria-label="قائمة الفرق"
                    >
                        <!-- لا نتائج للبحث -->
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
                                @click="teamNameFilter = ''"
                            />
                        </div>

                        <template v-else>
                        <!-- عرض جدولي (صفوف) -->
                        <div
                            v-show="teamsViewMode === 'table'"
                            class="divide-y divide-gray-100 dark:divide-gray-800/90"
                            role="list"
                            :aria-label="isTeamsLinking ? 'قائمة الفرق — اضغط للتحديد' : 'قائمة الفرق'"
                        >
                            <component
                                :is="isTeamsLinking ? 'button' : 'div'"
                                v-for="row in filteredTableData"
                                :key="`t-${row.id}`"
                                :type="isTeamsLinking ? 'button' : undefined"
                                class="flex w-full items-center gap-3 px-3 py-3.5 text-start transition-colors sm:px-4"
                                :class="rowSelectionClasses(row.id)"
                                :aria-pressed="isTeamsLinking ? !!selectedTeams[row.id] : undefined"
                                @click="onRowClick(row.id)"
                            >
                                <div class="flex min-w-0 flex-1 items-start gap-3">
                                    <span
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
                                    >
                                        <UIcon name="i-mdi-account-group-outline" class="size-5" />
                                    </span>
                                    <span class="min-w-0 text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">
                                        {{ row.teamName }}
                                    </span>
                                </div>
                                <span
                                    v-if="isTeamsLinking"
                                    class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
                                    :class="
                                        selectedTeams[row.id]
                                            ? 'border-primary bg-primary text-white shadow-sm shadow-primary/25'
                                            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/80'
                                    "
                                    aria-hidden="true"
                                >
                                    <UIcon
                                        :name="selectedTeams[row.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
                                        class="size-5"
                                        :class="selectedTeams[row.id] ? '' : 'text-gray-400 dark:text-gray-500'"
                                    />
                                </span>
                            </component>
                        </div>

                        <!-- عرض شبكي (بطاقات) -->
                        <div
                            v-show="teamsViewMode === 'grid'"
                            class="p-3 sm:p-4"
                            role="list"
                            :aria-label="isTeamsLinking ? 'بطاقات الفرق — اضغط للتحديد' : 'بطاقات الفرق'"
                        >
                            <div
                                class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                <component
                                    :is="isTeamsLinking ? 'button' : 'div'"
                                    v-for="row in filteredTableData"
                                    :key="`g-${row.id}`"
                                    :type="isTeamsLinking ? 'button' : undefined"
                                    class="relative flex h-full min-h-[8.5rem] flex-col gap-3 rounded-2xl border p-4 text-start transition-all duration-200"
                                    :class="gridCardClasses(row.id)"
                                    :aria-pressed="isTeamsLinking ? !!selectedTeams[row.id] : undefined"
                                    @click="onRowClick(row.id)"
                                >
                                    <div
                                        v-if="isTeamsLinking"
                                        class="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full border-2 transition-all duration-150"
                                        :class="
                                            selectedTeams[row.id]
                                                ? 'border-primary bg-primary text-white shadow-sm'
                                                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/90'
                                        "
                                        aria-hidden="true"
                                    >
                                        <UIcon
                                            :name="selectedTeams[row.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
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

                <div v-else class="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-14 text-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/80">
                        <UIcon name="i-mdi-account-group-outline" class="size-9 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div class="max-w-sm space-y-1">
                        <p class="text-base font-semibold text-gray-900 dark:text-white">لا توجد فرق بعد</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            اربط الفرق بالمجموعة لبدء الترتيب وإنشاء المباريات لاحقاً.
                        </p>
                    </div>
                    <UButton v-if="groupDetails.state === GroupState.TeamsLinking" color="primary" variant="soft"
                        icon="i-mdi-plus" label="إضافة أول فريق" size="md" class="mt-1" @click="linkTeam" />
                </div>
            </div>
        </div>
    </UCard>

    <CreateMatchDrawer ref="createMatchDrawer" :group="group" />
    <LinkTeamDrawer ref="linkTeamDrawer" :group="group" />
</template>

<script lang="ts" setup>
import { GroupState, type Group, type DetailGroup } from "~/features/tournament/models/group";
import loading from "~/components/loading.vue";
import CreateMatchDrawer from "./CreateMatchDrawer.vue";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";

const LinkTeamDrawer = defineAsyncComponent(() => import("./LinkTeamDrawer.vue"));

interface Props {
    group: Group;
}

interface TableRow {
    id: string;
    teamName: string;
    original: DetailGroup["teams"][0];
}

const props = defineProps<Props>();

const route = useRoute();
const tour_id = route.params.id.toString();
const groupApi = useGroup();
const groupDetailREQ = await groupApi.getGroupDetails(tour_id, props.group.id);
const unlinkTeamFromGroupReq = await useTourrnamentTeam().unlinkTeamFromGroup();

const createMatchDrawer = useTemplateRef<InstanceType<typeof CreateMatchDrawer>>("createMatchDrawer");
const linkTeamDrawer = useTemplateRef<InstanceType<typeof LinkTeamDrawer>>("linkTeamDrawer");

const selectedTeams = ref<Record<string, boolean>>({});
const toast = useToast();

/** عرض الفرق: صفوف (جدول) أو بطاقات (شبكة) */
const teamsViewMode = ref<"table" | "grid">("table");

/** تصفية بالاسم (اسم الفريق أو أسماء اللاعبين) */
const teamNameFilter = ref("");

function normalizeForSearch(s: string) {
    return s.trim().toLowerCase();
}

function groupStateLabel(state: GroupState): string {
    const map: Record<GroupState, string> = {
        [GroupState.Created]: "تم الإنشاء",
        [GroupState.TeamsLinking]: "ربط الفرق",
        [GroupState.MatchesGenerated]: "تم إنشاء المباريات",
        [GroupState.MatchesRunning]: "المباريات جارية",
        [GroupState.MatchesFinished]: "انتهت المباريات",
    };
    return map[state] ?? state;
}

const groupDetails = computed<DetailGroup | null>(() => {
    return groupDetailREQ.data.value?.data ?? null;
});

const isTeamsLinking = computed(() => groupDetails.value?.state === GroupState.TeamsLinking);

const tableData = computed<TableRow[]>(() => {
    if (!groupDetails.value?.teams) return [];
    return groupDetails.value.teams.map((team) => {
        const teamName =
            team.players && team.players.length > 0
                ? team.players.map((player) => player.name).join(" · ")
                : team.name || "فريق بدون لاعبين";

        return {
            id: team.id,
            teamName,
            original: team,
        };
    });
});

const filteredTableData = computed<TableRow[]>(() => {
    const q = teamNameFilter.value.trim();
    if (!q) {
        return tableData.value;
    }
    const n = normalizeForSearch(q);
    return tableData.value.filter((row) => {
        const parts = [
            row.teamName,
            row.original.name,
            ...(row.original.players?.map((p) => p.name) ?? []),
        ];
        const hay = normalizeForSearch(parts.join(" "));
        return hay.includes(n);
    });
});

function rowSelectionClasses(teamId: string) {
    if (!isTeamsLinking.value) {
        return "";
    }
    return selectedTeams.value[teamId]
        ? "cursor-pointer bg-primary/[0.08] ring-1 ring-inset ring-primary/35 hover:bg-primary/[0.11] dark:bg-primary/20"
        : "cursor-pointer hover:bg-gray-50 active:bg-gray-100/80 dark:hover:bg-gray-800/60 dark:active:bg-gray-800";
}

function gridCardClasses(teamId: string) {
    if (!isTeamsLinking.value) {
        return "border-gray-200/90 bg-white/95 dark:border-gray-800 dark:bg-gray-900/45";
    }
    return selectedTeams.value[teamId]
        ? "cursor-pointer border-primary/55 bg-primary/[0.07] shadow-md shadow-primary/10 ring-2 ring-primary/35 dark:bg-primary/15"
        : "cursor-pointer border-gray-200/90 bg-white/95 hover:border-primary/35 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/45 dark:hover:border-primary/40";
}

function onRowClick(id: string) {
    if (!isTeamsLinking.value) {
        return;
    }
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

const selectedTeamsIds = computed((): string[] => {
    return Object.entries(selectedTeams.value)
        .filter(([, on]) => on)
        .map(([id]) => id);
});

function createMatches() {
    if (createMatchDrawer.value) {
        createMatchDrawer.value.open = true;
    }
}

function linkTeam() {
    if (linkTeamDrawer.value) {
        linkTeamDrawer.value.open = true;
    }
}

async function unlinkTeam() {
    await unlinkTeamFromGroupReq.fetchREQ(tour_id, props.group.id, selectedTeamsIds.value);
    if (unlinkTeamFromGroupReq.status.value === "success") {
        toast.add({ title: "تم إزالة الفريق بنجاح", color: "success" });
        await groupDetailREQ.refresh();
    } else {
        const error = (unlinkTeamFromGroupReq.error.value?.data as { data?: { message?: string } })?.data
            ?.message;
        toast.add({ title: error ?? "حدث خطأ", color: "error" });
    }
    selectedTeams.value = {};
}
</script>
