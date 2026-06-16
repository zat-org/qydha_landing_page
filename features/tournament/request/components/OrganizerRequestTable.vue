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
            <UBadge :label="getState(getValue() as string)?.label ?? getValue()" size="xl"
                :color="getState(getValue() as string)?.color" variant="outline" />

        </template>
        <template #type-cell="{ getValue }">
            <UBadge :label="getType(getValue() as string)?.label ?? getValue()" size="xl"
                :color="getType(getValue() as string)?.color" variant="outline" />

        </template>

        <template #actions-cell="{row}">
            <UFieldGroup >
                <UButton   icon="i-lucide-eye"   :to="'/tournament/request/'+row.original.id" />
                <UButton  v-if="row.original.state == TournamentRequestState.Pending"  icon="i-lucide-x" color="error" @click="handelCancel(row.original.id)" />
                <UButton  v-if="row.original.state == TournamentRequestState.Pending" icon="i-lucide-edit-2" color="warning" :to="'/tournament/request/'+row.original.id+'/update'" />
            </UFieldGroup>
        </template>
    </UTable>
</template>
<script setup lang="ts">
import {type getTournamentRequestResponse ,TournamentRequestState} from '~/features/tournament/models/tournamentRequest';
const { data: res } = useNuxtData<getTournamentRequestResponse>('OrganizerTourReqests')
const rows = computed(() => {
    return unref(res)?.data.items ?? []
})
const { getTournamentTypeOptions, getTournamnetStateOptions  ,OrganizerCancelRequest} = useTournamentRequest()
const stateOptions = getTournamnetStateOptions()
const typeOptions = getTournamentTypeOptions()
const cancelReq = OrganizerCancelRequest()
const getState = (value: string): any => {
    const result = stateOptions.find(op => op.value == value)
    if (!result) return { label: "", value: TournamentRequestState.Pending, color: "warn" }
    return result
}

const getType = (value: string): any => {
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
