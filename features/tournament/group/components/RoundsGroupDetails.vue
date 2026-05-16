<template>
    <UCard
        :ui="{
            root: 'overflow-hidden rounded-2xl border border-gray-200/90 shadow-sm dark:border-gray-800',
            header:
                'border-b border-gray-200/90 bg-gradient-to-l from-gray-50/80 to-white dark:from-gray-950/60 dark:to-gray-900/40 dark:border-gray-800',
            body: 'p-0 sm:p-0',
        }"
    >
        <template #header>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex min-w-0 items-start gap-3">
                    <span
                        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20 dark:bg-primary/20"
                    >
                        <UIcon name="i-mdi-trophy-outline" class="size-6" />
                    </span>
                    <div class="min-w-0 space-y-0.5">
                        <h3 class="text-lg font-bold leading-tight text-gray-900 dark:text-white">جولات المجموعة</h3>
                        <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                            {{ props.group.name }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                    <UBadge
                        v-if="roundsGroupDetails && (roundsGroupDetails.rounds?.length ?? 0) > 0"
                        color="primary"
                        variant="subtle"
                        size="md"
                        class="rounded-full px-3"
                    >
                        {{ roundsGroupDetails.rounds?.length ?? 0 }} جولة
                    </UBadge>
                    <UButton
                        icon="i-mdi-refresh"
                        color="primary"
                        variant="soft"
                        size="sm"
                        label="اعادة الإنشاء للمباريات"
                        class="min-h-9"
                        :disabled="isRevertPending"
                        @click="openRegenerateMatchesDrawer"
                    />
                    <UButton
                        icon="i-mdi-account-group-outline"
                        color="neutral"
                        variant="soft"
                        size="sm"
                        label="تراجع عن إنشاء المباريات"
                        class="min-h-9"
                        :loading="isRevertPending"
                        :disabled="isRevertPending"
                        @click="revertFinalGroupGeneratedMatches"
                    />
                </div>
            </div>
        </template>

        <!-- Loading -->
         {{ rounGroupDetailsREQ.pending.value }} {{ rounGroupDetailsREQ.data.value?.data == null }}
        <div
            v-if="rounGroupDetailsREQ.pending.value && rounGroupDetailsREQ.data.value?.data == null"
            class="flex flex-col items-center justify-center gap-3 px-4 py-16"
        >
            <UIcon name="i-mdi-loading" class="size-10 animate-spin text-primary" />
            <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل الجولات…</p>
        </div>

        <!-- Error -->
        <div v-else-if="rounGroupDetailsREQ.error.value" class="p-4 sm:p-6">
            <UAlert
                color="error"
                variant="soft"
                icon="i-mdi-alert-circle-outline"
                title="تعذّر تحميل الجولات"
                :description="rounGroupDetailsREQ.error.value.message"
            />
        </div>

        <!-- Rounds table -->
        <div v-else-if="roundsGroupDetails && roundsGroupDetails.rounds && roundsGroupDetails.rounds.length > 0" class="px-0">
            <div class="overflow-x-auto">
                <UTable
                    v-model:expanded="expandedRows"
                    :data="tableData"
                    :columns="roundColumns"
                    :get-row-can-expand="() => true"
                    :ui="{
                        td: 'align-middle',
                        th: 'text-gray-600 dark:text-gray-300 font-semibold text-xs uppercase tracking-wide',
                    }"
                    class="min-w-[640px]"
                >
                    <template #expand-cell="{ row }">
                        <UButton
                            variant="ghost"
                            color="neutral"
                            size="sm"
                            square
                            :aria-expanded="row.getIsExpanded()"
                            :aria-label="row.getIsExpanded() ? 'طي المباريات' : 'عرض المباريات'"
                            :icon="row.getIsExpanded() ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
                            class="rounded-lg"
                            @click="row.toggleExpanded()"
                        />
                    </template>

                    <template #name-cell="{ row }">
                        <div class="flex items-center gap-2.5">
                            <UIcon name="i-mdi-flag-checkered" class="size-5 shrink-0 text-primary" />
                            <span class="font-semibold text-gray-900 dark:text-white">
                                {{ (row.original as RoundRow).round.name }}
                            </span>
                        </div>
                    </template>

                    <template #startAt-cell="{ row }">
                        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <UIcon name="i-mdi-calendar-clock" class="size-4 shrink-0 text-gray-400" />
                            {{ formatDateTime((row.original as RoundRow).round.startAt) }}
                        </div>
                    </template>

                    <template #matchesCount-cell="{ row }">
                        <UBadge color="primary" variant="soft" size="sm" class="rounded-full font-medium">
                            {{ (row.original as RoundRow).round.matches?.length ?? 0 }} مباراة
                        </UBadge>
                    </template>

                    <template #actions-cell="{ row }">
                        <UButton
                            icon="i-mdi-pencil-outline"
                            color="warning"
                            variant="soft"
                            size="sm"
                            square
                            aria-label="تعديل الجولة"
                            class="rounded-lg"
                            @click="openUpdateRoundDrawer((row.original as RoundRow).round.id)"
                        />
                    </template>

                    <template #expanded="{ row }">
                        <div
                            class="border-t border-gray-200/90 bg-gradient-to-b from-gray-50/90 to-white px-3 py-4 dark:border-gray-800 dark:from-gray-950/80 dark:to-gray-900/60 sm:px-5"
                        >
                            <div class="mb-3 flex flex-wrap items-center gap-2">
                                <UIcon name="i-mdi-soccer" class="size-5 text-primary" />
                                <span class="text-sm font-bold text-gray-800 dark:text-gray-100">مباريات الجولة</span>
                                <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
                                    {{ (row.original as RoundRow).round.matches?.length ?? 0 }}
                                </UBadge>
                            </div>
                            <div
                                class="overflow-x-auto rounded-xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-900/[0.03] dark:border-gray-700 dark:bg-gray-900/40 dark:ring-white/5"
                            >
                                <UTable
                                    :data="(row.original as RoundRow).round.matches ?? []"
                                    :columns="matchColumns"
                                    :ui="{
                                        td: 'text-sm py-2.5',
                                        th: 'text-xs font-semibold text-gray-600 dark:text-gray-400',
                                    }"
                                    class="min-w-[520px]"
                                >
                                    <template #teams-cell="{ row: m }">
                                        <div class="flex flex-wrap items-center gap-2 py-0.5">
                                            <span
                                                class="inline-flex max-w-[11rem] truncate rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                {{ m.original.themTeamName?.trim() || "لم يحدد بعد" }}
                                            </span>
                                            <span
                                                class="select-none text-[10px] font-bold uppercase tracking-wider text-gray-400"
                                                >ضد</span
                                            >
                                            <span
                                                class="inline-flex max-w-[11rem] truncate rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                {{ m.original.usTeamName?.trim() || "لم يحدد بعد" }}
                                            </span>
                                        </div>
                                    </template>
                                    <template #table-cell="{ row: m }">
                                        <div class="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                                            <UIcon name="i-mdi-table-furniture" class="size-4 text-gray-400" />
                                            {{ m.original.tableName?.trim() || "لم يحدد بعد" }}
                                        </div>
                                    </template>
                                    <template #state-cell="{ row: m }">
                                        <UBadge
                                            :color="getMatchStateColor(m.original.state)"
                                            variant="soft"
                                            size="sm"
                                            class="rounded-full"
                                        >
                                            {{ getMatchStateLabel(m.original.state) }}
                                        </UBadge>
                                    </template>
                                    <template #startAt-cell="{ row: m }">
                                        <span class="text-sm tabular-nums text-gray-700 dark:text-gray-300">{{
                                            formatDateTime(m.original.startAt)
                                        }}</span>
                                    </template>
                                    <template #referee-cell="{ row: m }">
                                        <div class="flex items-center gap-1.5 text-sm">
                                            <UIcon name="i-mdi-whistle" class="size-4 shrink-0 text-amber-500/90" />
                                            <span class="text-gray-800 dark:text-gray-200">{{
                                                m.original.referee?.username || "لم يحدد بعد"
                                            }}</span>
                                        </div>
                                    </template>
                                    <template #actions-cell="{ row: m }">
                                        <UButton
                                            icon="i-mdi-pencil-outline"
                                            color="warning"
                                            variant="soft"
                                            size="sm"
                                            square
                                            aria-label="تعديل المباراة"
                                            class="rounded-lg"
                                            @click="openUpdateMatchDrawer(m.original.id)"
                                        />
                                    </template>
                                </UTable>
                            </div>
                        </div>
                    </template>
                </UTable>
            </div>
        </div>

        <!-- Empty -->
        <div v-else class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span
                class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/80"
            >
                <UIcon name="i-mdi-trophy-broken" class="size-9 text-gray-400" />
            </span>
            <div class="space-y-1">
                <p class="text-base font-semibold text-gray-700 dark:text-gray-200">لا توجد جولات بعد</p>
                <p class="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                    ستظهر الجولات هنا بعد إنشائها لهذه المجموعة.
                </p>
            </div>
        </div>
    </UCard>

    <UpdateRoundDrawer
        ref="updateRoundDrawer"
        :round="selectedRound"
        :tour-id="tour_id"
        :group-id="props.group.id"
    />

    <CreateMatchDrawer ref="regenerateMatchesDrawer" :group="props.group" />
</template>

<script lang="ts" setup>
import type { Group, RoundGroupDetails, Match } from "~/features/tournament/models/group";
import { formatDateTime } from "~/utils/formatDate";
import type { TableColumn } from "@nuxt/ui";
import UpdateRoundDrawer from "./Round/UpdateRoundDrawer.vue";
import UpdateMatchDrawer from "./Match/UpdateMatchDrawer.vue";
import CreateMatchDrawer from "./CreateMatchDrawer.vue";

const route = useRoute();
const tour_id = route.params.id.toString();
const props = defineProps<{
    group: Group;
}>();

const rounGroupDetailsREQ = await useGroup().getRoundsGroupDetails(tour_id, props.group.id);

const roundsGroupDetails = computed<RoundGroupDetails | null>(() => {
    return rounGroupDetailsREQ.data.value?.data || null;
});

interface RoundRow {
    round: RoundGroupDetails["rounds"][0];
}

const tableData = computed<RoundRow[]>(() => {
    if (!roundsGroupDetails.value?.rounds) return [];
    return roundsGroupDetails.value.rounds.map((round) => ({
        round,
    }));
});

const expandedRows = ref<Record<string, boolean>>({});

const getMatchStateLabel = (state: string): string => {
    const stateMap: Record<string, string> = {
        Created: "تم الإنشاء",
        Running: "قيد التشغيل",
        Paused: "متوقف",
        Ended: "انتهت",
        Cancelled: "ملغاة",
    };
    return stateMap[state] || state;
};

const getMatchStateColor = (state: string): "neutral" | "success" | "warning" | "info" | "error" => {
    const colorMap: Record<string, "neutral" | "success" | "warning" | "info" | "error"> = {
        Created: "neutral",
        Running: "success",
        Paused: "warning",
        Ended: "info",
        Cancelled: "error",
    };
    return colorMap[state] || "neutral";
};

const roundColumns: TableColumn<RoundRow>[] = [
    {
        id: "expand",
        header: "",
    },
    { accessorKey: "name", header: "اسم الجولة" },
    { accessorKey: "startAt", header: "تاريخ البدء" },
    { accessorKey: "matchesCount", header: "عدد المباريات" },
    { accessorKey: "actions", header: "الإجراءات" },
];

const matchColumns: TableColumn<Match>[] = [
    { accessorKey: "teams", header: "الفرق" },
    { accessorKey: "table", header: "الطاولة" },
    { accessorKey: "state", header: "الحالة" },
    { accessorKey: "startAt", header: "وقت البدء" },
    { accessorKey: "referee", header: "الحكم" },
    { accessorKey: "actions", header: "الإجراءات" },
];

const selectedRound = ref<RoundGroupDetails["rounds"][0] | null>(null);
const updateRoundDrawer = useTemplateRef<{ open: boolean }>("updateRoundDrawer");
const regenerateMatchesDrawer = useTemplateRef<InstanceType<typeof CreateMatchDrawer>>("regenerateMatchesDrawer");

const openRegenerateMatchesDrawer = () => {
    if (regenerateMatchesDrawer.value) {
        regenerateMatchesDrawer.value.open = true;
    }
};

const openUpdateRoundDrawer = (roundId: string) => {
    selectedRound.value = roundsGroupDetails.value?.rounds?.find((r) => r.id === roundId) || null;
    if (updateRoundDrawer.value) {
        updateRoundDrawer.value.open = true;
    }
};

const overlay = useOverlay();
const matchDrawer = overlay.create(UpdateMatchDrawer);

const openUpdateMatchDrawer = async (matchId: string) => {
    matchDrawer.open({
        matchId,
    });
};

const toast = useToast();

const revertFinalGroupGeneratedMatchesReq = await useGroup().revertFinalGroupGeneratedMatches();
const isRevertPending = computed(() => revertFinalGroupGeneratedMatchesReq.status.value === "pending");

const revertFinalGroupGeneratedMatches = async () => {
    await revertFinalGroupGeneratedMatchesReq.fetchREQ(tour_id, props.group.id);
    if (revertFinalGroupGeneratedMatchesReq.status.value === "success") {
        toast.add({ title: "تم تعديل الفرق بنجاح", color: "success" });
        await rounGroupDetailsREQ.refresh();
    } else {
        const err = revertFinalGroupGeneratedMatchesReq.error.value as { data?: { data?: { message?: string } }; message?: string } | null;
        const msg =
            err?.data?.data?.message ?? (err as { message?: string })?.message ?? "تعذّر تنفيذ العملية";
        toast.add({ title: msg, color: "error" });
    }
};
</script>
