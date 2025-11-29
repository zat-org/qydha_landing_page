<template>
    <UCard>
        <template #header>
            <UButtonGroup>
                <UButton color="success" variant="soft" size="sm" @click="createMatches">انشاء المباريات </UButton>
                <UButton color="primary" icon="i-heroicons-plus" variant="soft" size="sm" @click="linkTeam">اضافة فريق
                </UButton>
                <UButton color="error" icon="i-heroicons-minus" variant="soft" size="sm" @click="unlinkTeam"
                    :disabled="selectedTeamsIds.length === 0">حذف الفريق </UButton>
            </UButtonGroup>
        </template>
        <!-- Loading State -->
        <div v-if="groupDetailREQ.pending.value" class="flex justify-center items-center py-8">
            <loading />
        </div>

        <!-- Error State -->
        <div v-else-if="groupDetailREQ.error.value" class="p-4">
            <UAlert color="error" variant="soft" icon="i-heroicons-exclamation-triangle"
                title="خطأ في تحميل تفاصيل المجموعة" :description="groupDetailREQ.error.value.message" />
        </div>

        <!-- Teams Table -->
        <div v-else-if="groupDetails" class="h-[50vh] overflow-y-auto">

            <UTable ref="table" v-if="tableData && tableData.length > 0" v-model:row-selection="selectedTeams"
                :data="tableData" :columns="columns" :loading="groupDetailREQ.pending.value" class="w-full">
                <template #teamName-cell="{ row }">
                    <div class="flex items-center gap-2">
                        <span class="text-sm">{{ (row.original as TableRow).teamName }}</span>
                    </div>
                </template>

            </UTable>

            <div v-else class="text-center py-8 text-gray-400">
                <UIcon name="i-heroicons-user-group" class="text-4xl mb-2" />
                <p>لا توجد فرق في هذه المجموعة</p>
            </div>
        </div>
    </UCard>
<CreateMatchDrawer ref="createMatchDrawer" :group="group" />


</template>

<script lang="ts" setup>
import type { Group, DetailGroup } from "~/models/group";
import loading from "~/components/loading.vue";
import CreateMatchDrawer from "./CreateMatchDrawer.vue";


const createMatchDrawer = useTemplateRef('createMatchDrawer');

interface Props {
    group: Group;
}

interface TableRow {
    id: string;
    teamName: string;
    original: DetailGroup['teams'][0];
}

const props = defineProps<Props>();
const route = useRoute();
const tour_id = route.params.id.toString();
const groupApi = useGroup();
const groupDetailREQ = await groupApi.getGroupDetails(tour_id, props.group.id);

const selectedTeams = ref();

// Extract group details data
const groupDetails = computed<DetailGroup | null>(() => {
    return groupDetailREQ.data.value?.data || null;
});

const TableRef = useTemplateRef('table');
// Create table data with team names from players
const tableData = computed<TableRow[]>(() => {
    if (!groupDetails.value?.teams) return [];
    return groupDetails.value.teams.map((team) => {
        // Create team name from players' names joined by "|"
        const teamName = team.players && team.players.length > 0
            ? team.players.map(player => player.name).join(' | ')
            : team.name || 'فريق بدون لاعبين';

        return {
            id: team.id,
            teamName,
            original: team
        };
    });
});

import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UCheckbox = resolveComponent('UCheckbox')
// Table columns
const columns: TableColumn<TableRow>[] = [
    {
        id: 'select',
        header: ({ table }: any) =>
            h(UCheckbox, {
                modelValue: table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : table.getIsAllPageRowsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    table.toggleAllPageRowsSelected(!!value),
                'aria-label': 'Select all'
            }),
        cell: ({ row }: any) =>
            h(UCheckbox, {
                modelValue: row.getIsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.selected = row.toggleSelected(!!value),
                'aria-label': 'Select team'
            }),
    },
    { accessorKey: 'teamName', header: 'اسم الفريق' },
];

const selectedTeamsIds = computed(() => {
    return TableRef?.value?.tableApi?.getFilteredSelectedRowModel().rows?.map((item: any) => item.original.id ) ||[];
});

const createMatches = () => {
    console.log('createMatches');
    if (createMatchDrawer.value) {
        createMatchDrawer.value.open = true;
    }
}
const linkTeam = () => {
    console.log('linkTeam');
    console.log(selectedTeamsIds.value);
}

const unlinkTeam = () => {
    console.log('unlinkTeam', selectedTeamsIds.value);
}


</script>
