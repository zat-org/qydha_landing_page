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
                            {{ headerDescription }}
                        </p>
                    </div>

                    <div class="flex flex-wrap items-stretch gap-2 sm:justify-end">
                        <UButton color="success" variant="soft" size="sm" icon="i-mdi-tournament"
                            label="إنشاء المباريات" class="min-h-10" @click="groupDetailsActions.createMatches" />
                        <template v-if="isTeamsLinking">
                            <UButton color="primary" icon="i-mdi-plus" variant="soft" size="sm" label="إضافة فريق"
                                class="min-h-10" @click="groupDetailsActions.linkTeam" />
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
                    <div v-if="groupDetails && isTeamsLinking && selectedTeamsIds.length > 0"
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

        <div v-if="groupDetailREQ.pending.value"
            class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
            <loading />
            <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل فرق المجموعة…</p>
        </div>

        <div v-else-if="groupDetailREQ.error.value" class="flex flex-1 items-center p-4 sm:p-6">
            <UAlert class="w-full" color="error" variant="soft" icon="i-mdi-alert-circle-outline"
                title="تعذّر تحميل تفاصيل المجموعة" :description="groupDetailREQ.error.value.message" />
        </div>

        <div v-else-if="groupDetails" class="flex min-h-0 flex-1 flex-col">
            <GroupDetailsDispatcher
                :group-details="groupDetails"
                :actions="groupDetailsActions"
                v-model:selected-teams="selectedTeams"
            />
        </div>
    </UCard>

    <CreateMatchDrawer ref="createMatchDrawer" :group="group" />
    <LinkTeamDrawer ref="linkTeamDrawer" :group="group" />
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { GroupState, type Group, type DetailGroup } from "~/features/tournament/models/group";
import loading from "~/components/loading.vue";
import CreateMatchDrawer from "./CreateMatchDrawer.vue";
import GroupDetailsDispatcher from "~/features/tournament/group/group-details/components/GroupDetailsDispatcher.vue";
import {
    GROUP_DETAILS_HEADER_DESCRIPTION,
    GROUP_DETAILS_HEADER_DESCRIPTION_DEFAULT,
    groupStateLabel,
} from "~/features/tournament/group/group-details/constants";
import type { GroupDetailsActions } from "~/features/tournament/group/group-details/types";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";

const LinkTeamDrawer = defineAsyncComponent(() => import("./LinkTeamDrawer.vue"));

interface Props {
    group: Group;
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

const groupDetails = computed<DetailGroup | null>(() => {
    return groupDetailREQ.data.value?.data ?? null;
});

const effectiveState = computed(
    () => groupDetails.value?.state ?? props.group.state,
);

const isTeamsLinking = computed(
    () => effectiveState.value === GroupState.TeamsLinking,
);

const headerDescription = computed(() => {
    return (
        GROUP_DETAILS_HEADER_DESCRIPTION[effectiveState.value] ??
        GROUP_DETAILS_HEADER_DESCRIPTION_DEFAULT
    );
});

const selectedTeamsIds = computed((): string[] => {
    return Object.entries(selectedTeams.value)
        .filter(([, on]) => on)
        .map(([id]) => id);
});

watch(effectiveState, () => {
    selectedTeams.value = {};
});

const groupDetailsActions: GroupDetailsActions = {
    createMatches() {
        if (createMatchDrawer.value) {
            createMatchDrawer.value.open = true;
        }
    },
    linkTeam() {
        if (linkTeamDrawer.value) {
            linkTeamDrawer.value.open = true;
        }
    },
    async refresh() {
        await groupDetailREQ.refresh();
    },
};

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
