<template>
    <UDrawer v-model:open="open" direction="left" :handle="false">
        <template #header>
            <h1>ربط الفرق المتاحة بالمجموعة</h1>
        </template>
        <template #body>
            <div class="w-[500px] flex flex-col  h-full justify-between ">
                <UTable ref="table" v-if="tableData && tableData.length > 0" v-model:row-selection="selectedTeams"
                    :columns="columns" :data="tableData" class="w-full">

                </UTable>
                <div v-else class="text-center py-8 text-gray-400">
                    <UIcon name="i-heroicons-user-group" class="text-4xl mb-2" />
                    <p>لا توجد فرق متاحة</p>
                </div>
                <div class="flex justify-between">
                    <UButton @click="linkTeam" color="primary" variant="soft"
                        :loading="linkTeamToGroupReq.status.value == 'pending'"
                        :disabled="linkTeamToGroupReq.status.value == 'pending' || selectedTeamsIds.length === 0">ربط
                        الفرق</UButton>
                    <UButton @click="open = false" color="neutral" variant="soft">إغلاق</UButton>
                </div>
            </div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
import type { Group } from "~/models/group";

interface Props {
    group: Group;
}
import { h, resolveComponent } from 'vue'
const UCheckbox = resolveComponent('UCheckbox')

const open = ref(false)
defineExpose({
    open
})
const route = useRoute();
const props = defineProps<Props>();
const tour_id = route.params.id.toString();
const groupId = props.group.id;
const { getNotInGroupTourTeams, linkTeamToGroup } = useTourrnamentTeam()
const getTeamsReq = await getNotInGroupTourTeams()
await getTeamsReq.fetchREQ(tour_id, groupId, 1)
const toast = useToast()
const linkTeamToGroupReq = await linkTeamToGroup()

const linkTeam = async () => {
    await linkTeamToGroupReq.fetchREQ(tour_id, groupId, selectedTeamsIds.value || [])
    if (linkTeamToGroupReq.status.value == "success") {
        toast.add({ title: "تم ربط الفرق بنجاح", color: "success" })
        getTeamsReq.refresh()
        open.value = false
    } else {
        const error = (linkTeamToGroupReq.error.value?.data as any).data.message
        console.log(error)
        toast.add({ title: error, color: "error" })
    }
}
const tableData = computed(() => {
    return getTeamsReq.data.value?.data.items || []
})
const TableRef = useTemplateRef('table');
const selectedTeams = ref({})
const columns = [
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
    {
        accessorKey: 'name',
        header: 'اسم الفريق'
    }
]

const selectedTeamsIds = computed(() => {
    return TableRef?.value?.tableApi?.getFilteredSelectedRowModel().rows?.map((item: any) => item.original.id) || [];
});
</script>