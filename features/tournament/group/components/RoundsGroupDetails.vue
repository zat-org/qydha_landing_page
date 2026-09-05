<template>
    <UCard :ui="{
        root: 'overflow-hidden rounded-2xl border border-gray-200/90 shadow-sm dark:border-gray-800',
        header:
            'border-b border-gray-200/90 bg-gradient-to-l from-gray-50/80 to-white dark:from-gray-950/60 dark:to-gray-900/40 dark:border-gray-800',
        body: 'p-0 sm:p-0',
    }">
        <template #header>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex min-w-0 items-start gap-3">
                    <span
                        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20 dark:bg-primary/20">
                        <UIcon name="i-mdi-trophy-outline" class="size-6" />
                    </span>
                    <div class="min-w-0 space-y-0.5">
                        <div class="flex items-center gap-2">
                            <h3 class="text-lg font-bold leading-tight text-gray-900 dark:text-white">جولات المجموعة</h3>
                            <UBadge :color="groupStateBadgeColor(props.group.state)" variant="subtle" size="sm">
                                {{ groupStateLabel(props.group.state) }}
                            </UBadge>
                        </div>
                        <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                            {{ props.group.name }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                    <UBadge v-if="roundsGroupDetails && (roundsGroupDetails.rounds?.length ?? 0) > 0" color="primary"
                        variant="subtle" size="md" class="rounded-full px-3">
                        {{ roundsGroupDetails.rounds?.length ?? 0 }} جولة
                    </UBadge>

                    <!-- Final group controls -->
                    <template v-if="isFinalGroup && canRevertOrRegenerateFinalGroup">
                        <UButton icon="i-mdi-refresh" color="primary" variant="soft" size="sm"
                            label="اعادة الإنشاء للمباريات" class="min-h-9" :disabled="isRevertPending"
                            @click="openRegenerateMatchesDrawer" />
                        <UButton icon="i-mdi-account-group-outline" color="neutral" variant="soft" size="sm"
                            label="تراجع عن إنشاء المباريات" class="min-h-9" :loading="isRevertPending"
                            :disabled="isRevertPending" @click="revertFinalGroupGeneratedMatches" />
                    </template>

                    <!-- Qualification group runtime controls -->
                    <template v-if="isQualificationGroup && canModify">
                        <!-- Start group -->
                        <UButton
                            v-if="canStartQualGroup"
                            icon="i-mdi-play"
                            color="primary"
                            variant="solid"
                            size="sm"
                            label="بدء مباريات المجموعة"
                            class="min-h-9"
                            :loading="isQualActionPending"
                            :disabled="isQualActionPending"
                            @click="handleStartQualGroup"
                        />

                        <!-- Reset group -->
                        <UButton
                            v-if="canResetQualGroup"
                            icon="i-mdi-restore"
                            color="warning"
                            variant="soft"
                            size="sm"
                            label="إعادة ضبط المجموعة"
                            class="min-h-9"
                            :loading="isQualActionPending"
                            :disabled="isQualActionPending || !allGamesCreated"
                            @click="handleResetQualGroup"
                        />

                        <!-- Finish group -->
                        <UButton
                            v-if="canFinishQualGroup"
                            icon="i-mdi-trophy"
                            color="success"
                            variant="soft"
                            size="sm"
                            label="إنهاء المجموعة"
                            class="min-h-9"
                            :loading="isQualActionPending"
                            :disabled="isQualActionPending || !allGamesEnded"
                            @click="handleFinishQualGroup"
                        />

                        <!-- Resume group -->
                        <UButton
                            v-if="canResumeQualGroup"
                            icon="i-mdi-play-pause"
                            color="primary"
                            variant="soft"
                            size="sm"
                            label="استئناف المجموعة"
                            class="min-h-9"
                            :loading="isQualActionPending"
                            :disabled="isQualActionPending"
                            @click="handleResumeQualGroup"
                        />
                    </template>
                </div>
            </div>
        </template>

        <!-- Loading -->
        <div v-if="rounGroupDetailsREQ.pending.value && rounGroupDetailsREQ.data.value == null"
            class="flex flex-col items-center justify-center gap-3 px-4 py-16">
            <UIcon name="i-mdi-loading" class="size-10 animate-spin text-primary" />
            <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل الجولات…</p>
        </div>

        <!-- Error -->
        <div v-else-if="rounGroupDetailsREQ.error.value" class="p-4 sm:p-6">
            <UAlert color="error" variant="soft" icon="i-mdi-alert-circle-outline" title="تعذّر تحميل الجولات"
                :description="rounGroupDetailsREQ.error.value.message" />
        </div>

        <!-- Rounds table -->
        <div v-else-if="roundsGroupDetails && roundsGroupDetails.rounds && roundsGroupDetails.rounds.length > 0"
            class="px-0">
            <div class="overflow-x-auto">
                <UTable v-model:expanded="expandedRows" :data="tableData" :columns="roundColumns"
                    :get-row-can-expand="() => true" :ui="{
                        tr: 'cursor-pointer',
                        td: 'align-middle',
                        th: 'text-gray-600 dark:text-gray-300 font-semibold text-xs uppercase tracking-wide',
                    }" class="min-w-160" @select="onRoundRowSelect">
                    <template #expand-cell="{ row }">
                        <UButton variant="ghost" color="neutral" size="sm" square :aria-expanded="row.getIsExpanded()"
                            :aria-label="row.getIsExpanded() ? 'طي المباريات' : 'عرض المباريات'"
                            :icon="row.getIsExpanded() ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" class="rounded-lg"
                            @click.stop="row.toggleExpanded()" />
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
                        <UButton icon="i-mdi-pencil-outline" color="warning" variant="soft" size="sm" square
                            aria-label="تعديل الجولة" class="rounded-lg"
                            @click.stop="openUpdateRoundDrawer((row.original as RoundRow).round.id)" />
                    </template>

                    <template #expanded="{ row }">
                        <div
                            class="border-t border-gray-200/90 bg-linear-to-b from-gray-50/90 to-white px-3 py-4 dark:border-gray-800 dark:from-gray-950/80 dark:to-gray-900/60 sm:px-5">
                            <div class="mb-3 flex flex-wrap items-center gap-2">
                                <UIcon name="i-mdi-soccer" class="size-5 text-primary" />
                                <span class="text-sm font-bold text-gray-800 dark:text-gray-100">مباريات الجولة</span>
                                <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
                                    {{ (row.original as RoundRow).round.matches?.length ?? 0 }}
                                </UBadge>
                            </div>
                            <div
                                class="overflow-x-auto rounded-xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-900/3 dark:border-gray-700 dark:bg-gray-900/40 dark:ring-white/5">
                                <UTable :data="(row.original as RoundRow).round.matches ?? []" :columns="matchColumns"
                                    :ui="{
                                        td: 'text-sm py-2.5',
                                        th: 'text-xs font-semibold text-gray-600 dark:text-gray-400',
                                    }" class="min-w-130">
                                    <template #teams-cell="{ row: m }">
                                        <div class="flex flex-wrap items-center gap-2 py-0.5">
                                            <span
                                                class="inline-flex max-w-44 truncate rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                                {{ m.original.themTeamName?.trim() || "لم يحدد بعد" }}
                                            </span>
                                            <span
                                                class="select-none text-[10px] font-bold uppercase tracking-wider text-gray-400">ضد</span>
                                            <span
                                                class="inline-flex max-w-44 truncate rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
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
                                        <UBadge :color="getMatchStateColor(m.original.state)" variant="soft" size="sm"
                                            class="rounded-full">
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
                                        <div class="flex items-center gap-1.5" v-if="canModify">
                                            <UButton 
                                                icon="i-heroicons-pencil-square" 
                                                color="warning" 
                                                variant="soft" 
                                                size="xs"
                                                label="تعديل"
                                                class="rounded-lg"
                                                @click="openEditMatchModal(m.original)" 
                                            />
                                            <UDropdownMenu
                                                v-if="m.original.state === 'Created' && m.original.usTeamId && m.original.themTeamId"
                                                :items="getWithdrawMenuItems(m.original)"
                                                :popper="{ placement: 'bottom-end' }"
                                            >
                                                <UButton
                                                    icon="i-heroicons-arrow-right-on-rectangle"
                                                    color="error"
                                                    variant="soft"
                                                    size="xs"
                                                    label="انسحاب"
                                                    class="rounded-lg"
                                                    :loading="matchWithdrawReq.status.value === 'pending'"
                                                />
                                            </UDropdownMenu>
                                            <UButton
                                                v-else-if="m.original.state === 'Running' || m.original.state === 'Ended'"
                                                icon="i-heroicons-arrow-path"
                                                color="neutral"
                                                variant="soft"
                                                size="xs"
                                                label="إعادة ضبط"
                                                class="rounded-lg"
                                                :loading="matchResetReq.status.value === 'pending'"
                                                @click="handleResetMatch(m.original)"
                                            />
                                        </div>
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
            <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/80">
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

    <UpdateRoundDrawer ref="updateRoundDrawer" :round="selectedRound" :tour-id="tour_id" :group-id="props.group.id" />

    <CreateMatchDrawer ref="regenerateMatchesDrawer" :group="props.group" />
</template>

<script lang="ts" setup>
import { ConfirmationModal } from "#components";
import type { Group, RoundGroupDetails, Match } from "~/features/tournament/models/group";
import { GroupState } from "~/features/tournament/models/group";
import { formatDateTime } from "~/utils/formatDate";
import type { TableColumn } from "@nuxt/ui";
import UpdateRoundDrawer from "./Round/UpdateRoundDrawer.vue";
import UpdateMatchDrawer from "./Match/UpdateMatchDrawer.vue";
import EditModal from "~/features/tournament/bracket/components/EditModal.vue";
import CreateMatchDrawer from "./CreateMatchDrawer.vue";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useGroup } from "~/features/tournament/group/composables/group";
import { useQualificationStage } from "~/features/tournament/detail/composables/api/useQualificationStage";
import { useMatch } from "~/features/tournament/shared/composables/match";
import { useMyAuthStore } from "~/store/Auth";

const route = useRoute();
const tour_id = route.params.id?.toString() ?? "";
const props = defineProps<{
    group: Group;
    state: TournamentDetailedState;
}>();

const authStore = useMyAuthStore();
const rounGroupDetailsREQ = useGroup().getRoundsGroupDetails(tour_id, props.group.id);

const roundsGroupDetails = computed<RoundGroupDetails | null>(() => {
    return rounGroupDetailsREQ.data.value || null;
});

const isFinalGroup = computed(
    () => props.group.stageType === "Final" || props.group.type === "Final",
);
const isQualificationGroup = computed(
    () => props.group.stageType === "Qualification" || props.group.type === "Qualification",
);

const canModify = computed(() => {
    return authStore.isAdmin || authStore.permissions.includes("ModifyTournamentData");
});

const canRevertOrRegenerateFinalGroup = computed(() => {
    return (
        props.state === TournamentDetailedState.LinkingFinalGroupTeams ||
        props.state === TournamentDetailedState.ManagingFinalGroupBracket
    );
});

const canStartQualGroup = computed(() => {
    return (
        props.group.state === GroupState.WaitingMatchesStarting &&
        (props.state === TournamentDetailedState.WaitingQualificationStageStarting ||
            props.state === TournamentDetailedState.QualificationStageRunning)
    );
});

const canResetQualGroup = computed(() => {
    return (
        props.group.state === GroupState.MatchesRunning &&
        props.state === TournamentDetailedState.QualificationStageRunning
    );
});

const canFinishQualGroup = computed(() => {
    return (
        props.group.state === GroupState.MatchesRunning &&
        props.state === TournamentDetailedState.QualificationStageRunning
    );
});

const canResumeQualGroup = computed(() => {
    return (
        props.group.state === GroupState.MatchesFinished &&
        (props.state === TournamentDetailedState.QualificationStageRunning ||
            props.state === TournamentDetailedState.QualificationStageFinished)
    );
});

const allMatches = computed<Match[]>(() => {
    if (!roundsGroupDetails.value?.rounds) return [];
    return roundsGroupDetails.value.rounds.flatMap((r) => r.matches ?? []);
});

const allGamesCreated = computed(() => {
    return allMatches.value.length > 0 && allMatches.value.every((m) => m.state === "Created");
});

const allGamesEnded = computed(() => {
    return allMatches.value.length > 0 && allMatches.value.every((m) => m.state === "Ended");
});

const groupStateLabel = (st: GroupState): string => {
    const map: Record<GroupState, string> = {
        [GroupState.Created]: "تم الإنشاء",
        [GroupState.TeamsLinking]: "ربط الفرق",
        [GroupState.MatchesGenerated]: "تم توليد المباريات",
        [GroupState.WaitingMatchesStarting]: "في انتظار البدء",
        [GroupState.MatchesRunning]: "جارية",
        [GroupState.MatchesFinished]: "انتهت",
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

const onRoundRowSelect = (
    eventOrRow: unknown,
    maybeRow?: { toggleExpanded?: () => void },
) => {
    const row = maybeRow ?? (eventOrRow as { toggleExpanded?: () => void });
    row?.toggleExpanded?.();
};

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
const editMatchModal = overlay.create(EditModal);
const confirmationModal = overlay.create(ConfirmationModal);

const { MatchWithdraw, MatchReset } = useMatch();
const matchWithdrawReq = MatchWithdraw();
const matchResetReq = MatchReset();

const openEditMatchModal = (match: Match) => {
    editMatchModal.open({
        match,
    });
};

const handleWithdraw = async (match: Match, side: "Us" | "Them" | "All") => {
    if (!match.qydhaGameId) {
        toast.add({ title: "معرف لعبة قيدها غير متوفر", color: "error" });
        return;
    }
    await matchWithdrawReq.fetchREQ(match.qydhaGameId, side);
    if (matchWithdrawReq.status.value === "success") {
        toast.add({ title: "تم تسجيل الانسحاب بنجاح", color: "success" });
        await rounGroupDetailsREQ.refresh();
    } else {
        toast.add({
            title: "تعذّر تسجيل الانسحاب",
            description: matchWithdrawReq.error.value?.message || "حدث خطأ أثناء الانسحاب",
            color: "error",
        });
    }
};

const handleResetMatch = async (match: Match) => {
    if (!match.qydhaGameId) {
        toast.add({ title: "معرف لعبة قيدها غير متوفر", color: "error" });
        return;
    }
    const instance = confirmationModal.open({
        message: `هل أنت متأكد من إعادة ضبط هذه المباراة؟`,
    });
    if (await instance.result) {
        await matchResetReq.fetchREQ(match.qydhaGameId);
        if (matchResetReq.status.value === "success") {
            toast.add({ title: "تمت إعادة ضبط المباراة بنجاح", color: "success" });
            await rounGroupDetailsREQ.refresh();
        } else {
            toast.add({
                title: "تعذّر إعادة الضبط",
                description: matchResetReq.error.value?.message || "حدث خطأ أثناء إعادة الضبط",
                color: "error",
            });
        }
    }
};

const getWithdrawMenuItems = (match: Match) => {
    return [
        [
            {
                label: `انسحاب: ${match.themTeamName || 'الفريق الأول'}`,
                icon: 'i-heroicons-user-minus',
                onSelect: () => handleWithdraw(match, 'Them'),
            },
            {
                label: `انسحاب: ${match.usTeamName || 'الفريق الثاني'}`,
                icon: 'i-heroicons-user-minus',
                onSelect: () => handleWithdraw(match, 'Us'),
            },
            {
                label: 'انسحاب كلا الفريقين',
                icon: 'i-heroicons-user-group',
                onSelect: () => handleWithdraw(match, 'All'),
            },
        ],
    ];
};

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

// Qualification stage runtime handlers
const qualStageApi = useQualificationStage();
const startQualReq = qualStageApi.startGroup();
const resetQualReq = qualStageApi.resetGroup();
const finishQualReq = qualStageApi.finishGroup();
const resumeQualReq = qualStageApi.resumeGroup();

const isQualActionPending = computed(
    () =>
        startQualReq.pending.value ||
        resetQualReq.pending.value ||
        finishQualReq.pending.value ||
        resumeQualReq.pending.value,
);

const handleStartQualGroup = async () => {
    await startQualReq.fetchREQ(tour_id, props.group.id);
    if (startQualReq.status.value === "success") {
        toast.add({ title: "تم بدء مباريات المجموعة بنجاح", color: "success" });
        await rounGroupDetailsREQ.refresh();
    } else {
        const err = startQualReq.error.value as { data?: { message?: string }; message?: string } | null;
        toast.add({ title: "تعذّر بدء المجموعة", description: err?.data?.message ?? err?.message, color: "error" });
    }
};

const handleResetQualGroup = async () => {
    const instance = confirmationModal.open({
        message: `هل أنت متأكد من إعادة ضبط المجموعة "${props.group.name}"؟`,
    });
    if (await instance.result) {
        await resetQualReq.fetchREQ(tour_id, props.group.id);
        if (resetQualReq.status.value === "success") {
            toast.add({ title: "تمت إعادة ضبط المجموعة", color: "success" });
            await rounGroupDetailsREQ.refresh();
        } else {
            const err = resetQualReq.error.value as { data?: { message?: string }; message?: string } | null;
            toast.add({ title: "تعذّر إعادة ضبط المجموعة", description: err?.data?.message ?? err?.message, color: "error" });
        }
    }
};

const handleFinishQualGroup = async () => {
    const instance = confirmationModal.open({
        message: `هل أنت متأكد من إنهاء المجموعة "${props.group.name}" واحتساب الفرق المتأهلة؟`,
    });
    if (await instance.result) {
        await finishQualReq.fetchREQ(tour_id, props.group.id);
        if (finishQualReq.status.value === "success") {
            toast.add({ title: "تم إنهاء المجموعة بنجاح", color: "success" });
            await rounGroupDetailsREQ.refresh();
        } else {
            const err = finishQualReq.error.value as { data?: { message?: string }; message?: string } | null;
            toast.add({ title: "تعذّر إنهاء المجموعة", description: err?.data?.message ?? err?.message, color: "error" });
        }
    }
};

const handleResumeQualGroup = async () => {
    const instance = confirmationModal.open({
        message: `هل أنت متأكد من استئناف المجموعة "${props.group.name}"؟ سيتم إلغاء سجلات الفرق المتأهلة السابقة لهذه المجموعة.`,
    });
    if (await instance.result) {
        await resumeQualReq.fetchREQ(tour_id, props.group.id);
        if (resumeQualReq.status.value === "success") {
            toast.add({ title: "تم استئناف المجموعة بنجاح", color: "success" });
            await rounGroupDetailsREQ.refresh();
        } else {
            const err = resumeQualReq.error.value as { data?: { message?: string }; message?: string } | null;
            toast.add({ title: "تعذّر استئناف المجموعة", description: err?.data?.message ?? err?.message, color: "error" });
        }
    }
};
</script>
