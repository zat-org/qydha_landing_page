<template>
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">جولات المجموعة</h3>
                <UBadge v-if="roundsGroupDetails" color="primary" variant="soft">
                    {{ roundsGroupDetails.rounds?.length || 0 }} جولة
                </UBadge>
            </div>
        </template>

        <!-- Loading State -->
        <div v-if="rounGroupDetailsREQ.pending.value" class="flex justify-center items-center py-12">
            <loading />
        </div>

        <!-- Error State -->
        <div v-else-if="rounGroupDetailsREQ.error.value" class="p-4">
            <UAlert 
                color="error" 
                variant="soft" 
                icon="i-heroicons-exclamation-triangle"
                title="خطأ في تحميل الجولات" 
                :description="rounGroupDetailsREQ.error.value.message" 
            />
        </div>

        <!-- Rounds Table -->
        <div v-else-if="roundsGroupDetails && roundsGroupDetails.rounds?.length > 0" class="overflow-x-auto">
            <UTable 
                ref="roundsTable"
                :data="tableData" 
                :columns="roundColumns"
                v-model:expanded="expandedRows"
                :getRowCanExpand="() => true"
                class="w-full"
            >
                <!-- Expand Column -->
                <template #expand-cell="{ row }">
                    <UButton
                        variant="ghost"
                        color="neutral"
                        size="sm"
                        :icon="row.getIsExpanded() ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                        @click="row.toggleExpanded()"
                    />
                </template>

                <!-- Round Name -->
                <template #name-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-trophy" class="text-primary-500" />
                        <span class="font-medium text-gray-900 dark:text-white">
                            {{ (row.original as RoundRow).round.name }}
                        </span>
                    </div>
                </template>

                <!-- Start Date -->
                <template #startAt-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-calendar" class="text-gray-400" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                            {{ formatDateTime((row.original as RoundRow).round.startAt) }}
                        </span>
                    </div>
                </template>

                <!-- Matches Count -->
                <template #matchesCount-cell="{ row }">
                    <UBadge color="primary" variant="soft" size="sm">
                        {{ (row.original as RoundRow).round.matches?.length || 0 }} مباراة
                    </UBadge>
                </template>

                <!-- Game Settings Summary -->
                <!-- <template #gameSettings-cell="{ row }">
                    <div class="flex flex-wrap gap-1">
                        <UBadge 
                            v-if="(row.original as RoundRow).round.gameSettings.isFlipped"
                            color="success" 
                            variant="soft" 
                            size="xs"
                        >
                            مقلوب
                        </UBadge>
                        <UBadge 
                            v-if="(row.original as RoundRow).round.gameSettings.isAdvancedRecording"
                            color="info" 
                            variant="soft" 
                            size="xs"
                        >
                            متقدم
                        </UBadge>
                        <UBadge 
                            v-if="(row.original as RoundRow).round.gameSettings.isSakkahMashdodahMode"
                            color="warning" 
                            variant="soft" 
                            size="xs"
                        >
                            محصودة
                        </UBadge>
                        <UBadge 
                            v-if="(row.original as RoundRow).round.gameSettings.isVoiceRecording"
                            color="secondary" 
                            variant="soft" 
                            size="xs"
                        >
                            صوتي
                        </UBadge>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ (row.original as RoundRow).round.gameSettings.sakkasCount }} صكة
                        </span>
                    </div>
                </template> -->

                <!-- Expanded Row Content (Matches) -->
                <template #expanded="{ row }">
                    <UTable :data="row.original.round.matches" :columns="matchColumns" >
                        <template #teams-cell="{ row }">
                            <div class="flex items-center gap-2">
                                <span class="text-sm">{{ row.original.themTeamName ?row.original.themTeamName: 'لم يحدد بعد ' }} - {{ row.original.usTeamName ? row.original.usTeamName: 'لم يحدد بعد ' }}</span>
                            </div>
                        </template>
                        <template #table-cell="{ row }">
                            <span class="text-sm">{{ row.original.tableName ? row.original.tableName: 'لم يحدد بعد ' }}</span>
                        </template>
                        <template #state-cell="{ row }">   
                            <UBadge :color="getMatchStateColor(row.original.state)" variant="soft" size="sm">
                                {{ getMatchStateLabel(row.original.state) }}
                            </UBadge>
                        </template>
                        <template #startAt-cell="{ row }">
                            <span class="text-sm">{{ formatDateTime(row.original.startAt) }}</span>
                        </template>
                    </UTable>
                </template>
            </UTable>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-400">
            <UIcon name="i-heroicons-trophy" class="text-4xl mb-2" />
            <p>لا توجد جولات في هذه المجموعة</p>
        </div>
    </UCard>
</template>

<script lang="ts" setup>
import type { Group, RoundGroupDetails, Match } from '~/models/group';
import loading from '~/components/loading.vue';
import type { TableColumn } from '@nuxt/ui';
import { h, resolveComponent } from 'vue';

const route = useRoute();
const tour_id = route.params.id.toString();
const props = defineProps<{
    group: Group;
}>();

const rounGroupDetailsREQ = await useGroup().getRoundsGroupDetails(tour_id, props.group.id);

// Extract rounds group details data
const roundsGroupDetails = computed<RoundGroupDetails | null>(() => {
    return rounGroupDetailsREQ.data.value?.data || null;
});

// Round row interface
interface RoundRow {
    round: RoundGroupDetails['rounds'][0];
}

// Table data for rounds
const tableData = computed<RoundRow[]>(() => {
    if (!roundsGroupDetails.value?.rounds) return [];
    return roundsGroupDetails.value.rounds.map((round) => ({
        round: round
    }));
});

// Expanded rows state
const expandedRows = ref({});

// Table reference
const roundsTable = useTemplateRef('roundsTable');


// Match state helpers
const getMatchStateLabel = (state: string): string => {
    const stateMap: Record<string, string> = {
        'Created': 'تم الإنشاء',
        'Running': 'قيد التشغيل',
        'Paused': 'متوقف',
        'Ended': 'انتهت',
        'Cancelled': 'ملغاة'
    };
    return stateMap[state] || state;
};

const getMatchStateColor = (state: string): 'neutral' | 'success' | 'warning' | 'info' | 'error' => {
    const colorMap: Record<string, 'neutral' | 'success' | 'warning' | 'info' | 'error'> = {
        'Created': 'neutral',
        'Running': 'success',
        'Paused': 'warning',
        'Ended': 'info',
        'Cancelled': 'error'
    };
    return colorMap[state] || 'neutral';
};


// Round table columns
const roundColumns: TableColumn<RoundRow>[] = [
    {
        id: 'expand',
        header: '',
        cell: ({ row }: any) => h(resolveComponent('UButton'), {
            variant: 'ghost',
            color: 'neutral',
            size: 'sm',
            icon: row.getIsExpanded() ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down',
            onClick: () => row.toggleExpanded()
        })
    },
    { accessorKey: 'name', header: 'اسم الجولة' },
    { accessorKey: 'startAt', header: 'تاريخ البدء' },
    { accessorKey: 'matchesCount', header: 'عدد المباريات' },
];

// Match table columns
const matchColumns: TableColumn<Match>[] = [
    { accessorKey: 'teams', header: 'الفرق' },
    { accessorKey: 'table', header: 'الطاولة' },
    { accessorKey: 'state', header: 'الحالة' },
    { accessorKey: 'startAt', header: 'وقت البدء' },
    { accessorKey: 'referee', header: 'الحكم' }
];
</script>