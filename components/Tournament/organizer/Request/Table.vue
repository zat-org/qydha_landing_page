<template>
    <UTable :data="rows" :columns="cols" hover class="flex-1">
        <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 px-4">
                <UIcon name="i-heroicons-inbox" class="text-4xl text-gray-400 mb-2" />
                <p class="text-gray-500">لا توجد بطولات متاحة</p>
            </div>
        </template>

        <template #title-cell="{ row }">
            <div class="flex gap-2 items-center">
                <ClientOnly>
                    <UAvatar size="2xl" :src="row.original.logo" :text="row.original.title[0]" />
                </ClientOnly>
                <p> {{ row.original.title }}</p>
            </div>
        </template>
        <template #createdByUserName-cell="{ row }">
            <UButton :label="row.original.createdByUserName ?? '--'" variant="ghost"
                :to="'/user/' + row.original.createdByUserId" :disabled="!row.original.createdByUserId" />
        </template>
        <template #state-cell="{ getValue }">
            <p :class="'w-fit px-4 py-2 rounded font-semibold text-sm transation-colors   ' +getState(getValue() as string)?.color " >
                {{ getState(getValue() as string)?.label ?? getValue() }}
            </p>
        </template>
        <template #type-cell="{ getValue }">
            <p :class="'w-fit px-4 py-2 rounded font-semibold text-sm transation-colors   ' +getType(getValue() as string)?.color " >
                {{ getType(getValue() as string)?.label ?? getValue() }}
            </p>
        </template>

        <template #actions-cell="{row}">
            <!-- if state is pending ==> reject - approve  -->
            <!-- if state is approve => can  reject it  ask  -->
            <!-- if state is rejected it  => can  approve it    ask  -->
            <UButtonGroup >
                <UButton   icon="i-lucide-eye"   :to="'/tournament/request/'+row.original.id" />
                <UButton  v-if="row.original.state == TournamentRequestState.Pending"  icon="i-lucide-check" color="success" @click="handelCancel(row.original.id)" />
                <UButton  v-if="row.original.state == TournamentRequestState.Pending" icon="i-lucide-edit-2" color="warning" :to="'/tournament/request/'+row.original.id+'/update'" />
            </UButtonGroup>
        </template>

        <!-- 
        <template #links-cell="{ row }">
            <UButtonGroup>
                <UDropdownMenu :items="[
                    {
                        label: 'الخريطة',
                        icon: 'i-heroicons-chart-bar',
                        to: `/tournament/${row.original.id}/bracket`
                    },
                    {
                        label: 'المسؤولين',
                        icon: 'i-heroicons-user-group',
                        to: `/tournament/${row.original.id}/moderator`
                    },
                    {
                        label: 'الطلبات',
                        icon: 'i-heroicons-inbox-stack',
                        to: `/tournament/${row.original.id}/request`
                    },
                    {
                        label: 'اللاعبين',
                        icon: 'i-heroicons-users',
                        to: `/tournament/${row.original.id}/player`
                    },
                    {
                        label: 'الطاولات',
                        icon: 'i-heroicons-table-cells',
                        to: `/tournament/${row.original.id}/table`
                    },
                    {
                        label: 'المجموعات',
                        icon: 'i-heroicons-user-circle',
                        to: `/tournament/${row.original.id}/group`
                    }
                ]">
                    <UButton color="primary" variant="ghost">
                        <UIcon name="i-heroicons-ellipsis-vertical" />
                        إدارة البطولة
                    </UButton>
                </UDropdownMenu>


            </UButtonGroup>

        </template> -->
    </UTable>

    <!-- <pre dir="ltr">
        {{res?.data.items }}
        </pre> -->
</template>
<script setup lang="ts">
import {  } from '~/models/tournament';
import  {type getTournamentResponse ,TournamentRequestState} from '~/models/tournamentRequest';
const { data: res } = useNuxtData<getTournamentResponse>('OrganizerTourReqests')
const rows = computed(() => {
    return unref(res)?.data.items ?? []
})
const { getTournamentTypeOptions, getTournamnetStateOptions  ,OrganizerCancelRequest} = useTournamentRequest()
const stateOptions = getTournamnetStateOptions()
const typeOptions = getTournamentTypeOptions()
const cancelReq = OrganizerCancelRequest()

const getState = (value: string) => {
    return stateOptions.find(op => op.value == value)
}

const getType = (value: string) => {
    return typeOptions.find(op => op.value == value)

}
const cols = computed(() => {
    const result: any[] = [
        {
            accessorKey: "title",
            header: "الاسم ",
        },
        {
            accessorKey: "state",
            header: "الحالة"
        },
        {
            accessorKey: "type",
            header: "النوع"
        },
        {
            accessorKey: "createdByUserName",
            header: "مالك البطوله "
        },
        {
            id:'actions',
            header:'#'
        }
    ]
    return result;
});

const handelCancel =async(id:string)=>{
   await  cancelReq.fetchREQ(id)
}


</script>
<style scoped></style>