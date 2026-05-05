<template>
    <UDrawer
        v-model:open="open"
        direction="left"
        :handle="false"
        :ui="{
            content:
                'max-w-[min(100vw-1rem,100rem)] w-full border-gray-200/90 dark:border-gray-800 sm:max-w-2xl',
            body: 'flex flex-col min-h-0 p-0',
            header: 'border-b border-gray-200/90 dark:border-gray-800',
            footer: 'border-t border-gray-200/90 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-950/50',
        }"
    >
        <template #header>
            <div class="space-y-1 pe-2 text-start">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                    ربط الفرق بالمجموعة
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    اختر فرقاً متاحة ثم اضغط «ربط الفرق». المجموعة:
                    <span class="font-semibold text-gray-700 dark:text-gray-200">{{ group.name }}</span>
                </p>
            </div>
        </template>

        <template #body>
            <div class="flex min-h-0 w-full flex-col gap-3 px-4 py-3">
                <!-- تحميل -->
                <div
                    v-if="getTeamsReq.pending.value"
                    class="flex flex-1 flex-col items-center justify-center gap-2 py-16"
                >
                    <UIcon name="i-mdi-loading" class="size-10 animate-spin text-primary" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل الفرق المتاحة…</p>
                </div>

                <template v-else-if="teamRows.length > 0">
                    <!-- تصفية + طريقة العرض -->
                    <div
                        class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                        role="group"
                        aria-label="تصفية وعرض الفرق"
                    >
                        <div class="min-w-0 flex-1">
                            <UInput
                                v-model="teamFilter"
                                icon="i-mdi-magnify"
                                size="sm"
                                placeholder="ابحث باسم الفريق أو لاعب…"
                                class="w-full"
                                :ui="{ trailing: 'pe-1' }"
                                aria-label="تصفية الفرق"
                                @keydown.escape.prevent="teamFilter = ''"
                            >
                                <template v-if="teamFilter.trim()" #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="ghost"
                                        icon="i-mdi-close"
                                        size="xs"
                                        class="p-1"
                                        aria-label="مسح البحث"
                                        @click="teamFilter = ''"
                                    />
                                </template>
                            </UInput>
                        </div>
                        <div class="flex flex-wrap items-center justify-end gap-2">
                            <p
                                v-if="teamFilter.trim()"
                                class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                            >
                                {{ filteredRows.length }} من {{ teamRows.length }}
                            </p>
                            <div
                                class="inline-flex items-center gap-0.5 rounded-xl border border-gray-200/90 bg-white p-0.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/80"
                            >
                                <UButton
                                    :color="teamsViewMode === 'table' ? 'primary' : 'neutral'"
                                    :variant="teamsViewMode === 'table' ? 'solid' : 'ghost'"
                                    size="xs"
                                    icon="i-mdi-table-row"
                                    label="جدول"
                                    :aria-pressed="teamsViewMode === 'table'"
                                    class="min-w-[4.25rem]"
                                    @click="teamsViewMode = 'table'"
                                />
                                <UButton
                                    :color="teamsViewMode === 'grid' ? 'primary' : 'neutral'"
                                    :variant="teamsViewMode === 'grid' ? 'solid' : 'ghost'"
                                    size="xs"
                                    icon="i-mdi-view-grid-outline"
                                    label="شبكة"
                                    :aria-pressed="teamsViewMode === 'grid'"
                                    class="min-w-[4.25rem]"
                                    @click="teamsViewMode = 'grid'"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- اختصارات تحديد -->
                    <div
                        class="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/[0.05] px-3 py-2 text-xs dark:bg-primary/10"
                    >
                        <span class="text-gray-600 dark:text-gray-300">
                            <UIcon name="i-mdi-gesture-tap" class="me-1 inline size-4 text-primary" />
                            اضغط على الصف أو البطاقة للتحديد — أو استخدم الأزرار أدناه.
                        </span>
                        <div class="flex flex-wrap gap-1.5">
                            <UButton
                                size="xs"
                                color="neutral"
                                variant="soft"
                                icon="i-mdi-checkbox-multiple-marked-outline"
                                label="تحديد الكل (الظاهر)"
                                @click="selectAllFiltered"
                            />
                            <UButton
                                size="xs"
                                color="neutral"
                                variant="ghost"
                                icon="i-mdi-close-circle-outline"
                                label="إلغاء"
                                :disabled="selectedCount === 0"
                                @click="clearSelection"
                            />
                        </div>
                    </div>

                    <div
                        v-if="selectedCount > 0"
                        class="shrink-0 rounded-xl border border-primary/30 bg-primary/[0.08] px-3 py-2 text-sm font-medium text-primary dark:bg-primary/15"
                    >
                        تم تحديد {{ selectedCount }}
                        {{ selectedCount === 1 ? 'فريق' : 'فرق' }}
                    </div>

                    <!-- قائمة قابلة للتمرير -->
                    <div
                        class="min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200/90 bg-white/90 dark:border-gray-800 dark:bg-gray-900/40"
                    >
                        <!-- لا نتائج للتصفية -->
                        <div
                            v-if="filteredRows.length === 0 && teamFilter.trim()"
                            class="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center"
                        >
                            <UIcon name="i-mdi-filter-remove-outline" class="size-10 text-gray-400" />
                            <p class="text-sm text-gray-600 dark:text-gray-300">لا توجد فرق تطابق البحث.</p>
                            <UButton
                                size="xs"
                                color="neutral"
                                variant="soft"
                                label="مسح البحث"
                                @click="teamFilter = ''"
                            />
                        </div>

                        <template v-else>
                            <div
                                class="max-h-[min(52vh,420px)] min-h-[200px] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
                                role="region"
                                aria-label="قائمة الفرق المتاحة"
                            >
                                <!-- جدول -->
                                <div
                                    v-show="teamsViewMode === 'table'"
                                    class="divide-y divide-gray-100 dark:divide-gray-800"
                                >
                                    <button
                                        v-for="row in filteredRows"
                                        :key="`t-${row.id}`"
                                        type="button"
                                        class="flex w-full items-center gap-3 px-3 py-3 text-start transition-colors sm:px-4"
                                        :class="rowClasses(row.id)"
                                        :aria-pressed="!!selectedTeams[row.id]"
                                        @click="toggleTeam(row.id)"
                                    >
                                        <span
                                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
                                        >
                                            <UIcon name="i-mdi-account-group-outline" class="size-5" />
                                        </span>
                                        <span
                                            class="min-w-0 flex-1 text-sm font-medium leading-snug text-gray-900 dark:text-gray-100"
                                        >
                                            {{ row.displayName }}
                                        </span>
                                        <span
                                            class="flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                                            :class="
                                                selectedTeams[row.id]
                                                    ? 'border-primary bg-primary text-white shadow-sm'
                                                    : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/80'
                                            "
                                            aria-hidden="true"
                                        >
                                            <UIcon
                                                :name="selectedTeams[row.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
                                                class="size-4"
                                                :class="selectedTeams[row.id] ? '' : 'text-gray-400 dark:text-gray-500'"
                                            />
                                        </span>
                                    </button>
                                </div>

                                <!-- شبكة -->
                                <div v-show="teamsViewMode === 'grid'" class="p-3">
                                    <div
                                        class="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                                    >
                                        <button
                                            v-for="row in filteredRows"
                                            :key="`g-${row.id}`"
                                            type="button"
                                            class="relative flex min-h-[7.5rem] flex-col gap-2 rounded-2xl border p-3 text-start transition-all"
                                            :class="gridCardClasses(row.id)"
                                            :aria-pressed="!!selectedTeams[row.id]"
                                            @click="toggleTeam(row.id)"
                                        >
                                            <span
                                                class="absolute end-2.5 top-2.5 flex size-8 items-center justify-center rounded-full border-2"
                                                :class="
                                                    selectedTeams[row.id]
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/90'
                                                "
                                                aria-hidden="true"
                                            >
                                                <UIcon
                                                    :name="selectedTeams[row.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
                                                    class="size-3.5"
                                                    :class="selectedTeams[row.id] ? '' : 'text-gray-400'"
                                                />
                                            </span>
                                            <span
                                                class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20"
                                            >
                                                <UIcon name="i-mdi-account-group-outline" class="size-5" />
                                            </span>
                                            <p
                                                class="line-clamp-4 pe-6 text-start text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100"
                                            >
                                                {{ row.displayName }}
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>

                <!-- لا فرق من الخادم -->
                <div
                    v-else
                    class="flex flex-1 flex-col items-center justify-center gap-3 py-14 text-center text-gray-500"
                >
                    <div class="rounded-2xl bg-gray-100 p-4 dark:bg-gray-800/80">
                        <UIcon name="i-mdi-account-off-outline" class="size-12 text-gray-400" />
                    </div>
                    <p class="text-sm font-medium">لا توجد فرق متاحة للربط حالياً</p>
                    <p class="max-w-xs text-xs text-gray-400">
                        قد تكون كل الفرق مرتبطة بمجموعات أو لم يُستوفَ عدد اللاعبين المطلوب.
                    </p>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <UButton
                    color="primary"
                    variant="solid"
                    icon="i-mdi-link-variant"
                    label="ربط الفرق"
                    class="min-h-10"
                    :loading="linkTeamToGroupReq.status.value === 'pending'"
                    :disabled="linkTeamToGroupReq.status.value === 'pending' || selectedCount === 0"
                    @click="linkTeam"
                />
                <UButton color="neutral" variant="soft" label="إغلاق" class="min-h-10" @click="open = false" />
            </div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
import type { Group } from "~/features/tournament/models/group";
import type { ITeam } from "~/features/tournament/models/tournamentTeam";

interface Props {
    group: Group;
}

interface TeamRow {
    id: string;
    displayName: string;
    original: ITeam;
}

const props = defineProps<Props>();

const open = ref(false);
/** يتوافق مع الأب: ref.open = true بدلاً من ref.open.value */
defineExpose({
    get open() {
        return open.value;
    },
    set open(v: boolean) {
        open.value = v;
    },
});

const route = useRoute();
const tour_id = route.params.id.toString();
const groupId = props.group.id;

const { getNotInGroupTourTeams, linkTeamToGroup } = useTourrnamentTeam();
const getTeamsReq = await getNotInGroupTourTeams();
await getTeamsReq.fetchREQ(tour_id, groupId, 1);
const toast = useToast();
const linkTeamToGroupReq = await linkTeamToGroup();

const teamFilter = ref("");
const teamsViewMode = ref<"table" | "grid">("table");
const selectedTeams = ref<Record<string, boolean>>({});

const teamRows = computed<TeamRow[]>(() => {
    const items = getTeamsReq.data.value?.data.items ?? [];
    return items.map((team) => {
        const displayName =
            team.players?.length > 0
                ? team.players.map((p) => p.name).join(" · ")
                : team.name || "فريق";
        return {
            id: String(team.id),
            displayName,
            original: team,
        };
    });
});

function normalizeSearch(s: string) {
    return s.trim().toLowerCase();
}

const filteredRows = computed(() => {
    const q = teamFilter.value.trim();
    if (!q) return teamRows.value;
    const n = normalizeSearch(q);
    return teamRows.value.filter((row) => {
        const hay = normalizeSearch(
            [row.displayName, row.original.name, ...(row.original.players?.map((p) => p.name) ?? [])].join(" "),
        );
        return hay.includes(n);
    });
});

const selectedCount = computed(
    () => Object.values(selectedTeams.value).filter(Boolean).length,
);

const selectedTeamsIds = computed((): string[] =>
    Object.entries(selectedTeams.value)
        .filter(([, on]) => on)
        .map(([id]) => id),
);

function rowClasses(id: string) {
    return selectedTeams.value[id]
        ? "cursor-pointer bg-primary/[0.08] ring-1 ring-inset ring-primary/30 hover:bg-primary/[0.1] dark:bg-primary/15"
        : "cursor-pointer hover:bg-gray-50 active:bg-gray-100/80 dark:hover:bg-gray-800/50";
}

function gridCardClasses(id: string) {
    return selectedTeams.value[id]
        ? "cursor-pointer border-primary/50 bg-primary/[0.06] ring-2 ring-primary/30 shadow-sm dark:bg-primary/15"
        : "cursor-pointer border-gray-200/90 bg-white/95 hover:border-primary/30 dark:border-gray-800 dark:bg-gray-900/45";
}

function toggleTeam(id: string) {
    selectedTeams.value = {
        ...selectedTeams.value,
        [id]: !selectedTeams.value[id],
    };
}

function selectAllFiltered() {
    const next = { ...selectedTeams.value };
    for (const row of filteredRows.value) {
        next[row.id] = true;
    }
    selectedTeams.value = next;
}

function clearSelection() {
    selectedTeams.value = {};
}

watch(open, async (isOpen) => {
    if (!isOpen) return;
    teamFilter.value = "";
    teamsViewMode.value = "table";
    selectedTeams.value = {};
    await getTeamsReq.fetchREQ(tour_id, groupId, 1);
});

async function linkTeam() {
  

    await linkTeamToGroupReq.fetchREQ(tour_id, groupId, selectedTeamsIds.value);
    if (linkTeamToGroupReq.status.value === "success") {
        toast.add({ title: "تم ربط الفرق بنجاح", color: "success" });
        await getTeamsReq.refresh();
        open.value = false;
        clearSelection();
    } else {
        const err = (linkTeamToGroupReq.error.value?.data as { data?: { message?: string } })?.data?.message;
        toast.add({ title: err ?? "تعذّر ربط الفرق", color: "error" });
    }
}
</script>
