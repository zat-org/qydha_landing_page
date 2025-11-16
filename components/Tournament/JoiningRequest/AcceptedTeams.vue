<template>
    <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">الفرق المقبولة ({{ acceptedTeamsNumber }})</h3>
          </div>
          <UTable :data="acceptedTeams" class="w-full" :columns="teamCols">
            <template #teamName-cell="{ row }">
              <span v-if="row.original">{{ row.original.teamName || `${row.original.ownerUserName} & ${row.original.teammateUserName}` }}</span>
              <span v-else>-</span>
            </template>
            <template #owner-cell="{ row }">
              <span>{{ row.original?.ownerUserName || '-' }}</span>
            </template>
            <template #teammate-cell="{ row }">
              <span>{{ row.original?.teammateUserName || '-' }}</span>
            </template>
            <!-- <template #source-cell="{ row }">
              <UBadge v-if="row.original?.originalType === 'Single'" label="من دمج" color="info" size="xs" />
              <UBadge v-else-if="row.original" label="طلب فريق" color="success" size="xs" />
            </template> -->
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
          <div v-if="acceptedTeams.length === 0" class="text-center text-gray-500 py-8">
            لا توجد فرق مقبولة
          </div>
        </div>
</template>
<script lang="ts" setup>
import { formatDate } from '~/utils/formatDate';

const params= ref({
    pageNumber: 1,
    pageSize: 10
})

const id = useRoute().params.id.toString()

const { getTournamnetAcceptedTeamsJoinRequest, RejectJoinRequest, RevertJoinRequest } = useTournamentJoinRequest()
const RevertReq = RevertJoinRequest()
const getRequest = await getTournamnetAcceptedTeamsJoinRequest(id, params)
// Filter out null/undefined items to prevent errors
const acceptedTeamsNumber = computed(() => getRequest.data.value?.data?.totalCount ?? 0)
const acceptedTeams = computed(() => {
  const items = getRequest.data.value?.data?.items ?? []
  return items.filter(item => item != null)
})
const teamCols = [      
    { accessorKey: 'teamName', header: 'اسم الفريق' },
    { accessorKey: 'ownerUserName', header: 'المالك' },
    { accessorKey: 'teammateUserName', header: 'المتابع' },
    { accessorKey: 'createdAt', header: 'تاريخ الطلب' },
    { accessorKey: 'actions', header: 'الإجراءات' }
]
const handleRejectJoinRequest = async (joinRequestId: string) => {
    await RevertReq.fetchREQ(joinRequestId, id)
}
</script>