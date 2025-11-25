<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between mb-4">
            <div class="flex gap-2 justify-between w-full">
                <h3 class="text-lg font-semibold ">الطلبات الفردية المقبولة ({{ acceptedSinglesNumber }})</h3>
                <UButton   v-if="acceptedSinglesNumber >= 2" color="primary" variant="soft" size="sm" @click="handelMergeSingles">
                    دمج الطلبات
                </UButton>
            </div>
        </div>
        <UTable :data="acceptedSingles" class="w-full" :columns="singleCols">
            <template #owner-cell="{ row }">
                <span>{{ row.original?.ownerUserName || '-' }}</span>
            </template>
            <template #createdAt-cell="{ row }">
                <span v-if="row.original?.createdAt">{{ formatDate(row.original.createdAt as string) }}</span>
                <span v-else>-</span>
            </template>
            <template #actions-cell="{ row }">
                <UButton 
                    v-if="row.original?.id"
                    color="error" 
                    variant="outline" 
                    icon="i-heroicons-x-mark" 
                    size="sm"
                    @click="handleRejectJoinRequest(row.original.id)" />
            </template>
        </UTable>
        <div v-if="acceptedSingles.length === 0" class="text-center text-gray-500 py-8">
            لا توجد طلبات فردية مقبولة
        </div>
    </div>
</template>
<script lang="ts" setup>
import { TournamentJoinRequestState, TournamentJoinRequestType, type GetTournamentJoinRequestParams } from '~/models/TournamentJoinRequest';
import { formatDate } from '~/utils/formatDate';

const id = useRoute().params.id.toString()

const params = ref<GetTournamentJoinRequestParams>({
    state: TournamentJoinRequestState.InConsideration,
    type: TournamentJoinRequestType.Single,
    pageNumber: 1,
    pageSize: 9
})



const {
    getTournamnetAcceptedSingleJoinRequest,
    RejectJoinRequest,
    MergeSingles,
    RevertJoinRequest
} = useTournamentJoinRequest()
const getRequest = await getTournamnetAcceptedSingleJoinRequest(id, params)

// Filter out null/undefined items to prevent errors
const acceptedSinglesNumber = computed(() => getRequest.data.value?.data?.totalCount ?? 0)

const acceptedSingles = computed(() => {
  const items = getRequest.data.value?.data?.items ?? []
  return items.filter(item => item != null)
})

const singleCols = [
    { accessorKey: 'ownerUserName', header: 'المالك' },
    { accessorKey: 'createdAt', header: 'تاريخ الطلب' },
    { accessorKey: 'actions', header: 'الإجراءات' }

]
const RevertReq = RevertJoinRequest()
const handleRejectJoinRequest = async (joinRequestId: string) => {
    console.log("joinRequestId" , joinRequestId)
    console.log("id" , id)
    await RevertReq.fetchREQ(joinRequestId, id as string)
}
const MergeReq = MergeSingles()
const handelMergeSingles = async () => {
    
    await MergeReq.fetchReq(id as string)
}
</script>