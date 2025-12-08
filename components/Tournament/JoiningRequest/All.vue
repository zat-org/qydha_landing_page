<template>
    <div class="flex flex-col gap-4 items-center h-full flex-1">

        <div class="flex w-full gap-4">
            <UFormField class="flex-1">
                <USelect :items="getTournamentJoinRequestStateOptions()" v-model="params.state" />
            </UFormField>
            <UFormField class="flex-1">
                <USelect :items="getTournamentJoinRequestTypeOptions()" v-model="params.type" />
            </UFormField>
        </div>

        <div class="flex w-full justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
                إجمالي المستخدمين المراد الانضمام إلى البطولة: <strong>{{ numebrofUsers }}</strong>
            </span>
            <UButton color="primary" variant="soft" size="sm" @click="() => refreshNumebrofUsers()">تحديث</UButton>
        </div>

        <UTable :data="availableRequests" class="w-full" :columns="cols">
            <template #type-cell="{ row }">
                <UBadge :label="getType(row.original.type).label" :color="getType(row.original.type).color"
                    variant="outline" />
            </template>
            <template #state-cell="{ row }">
                <UBadge :label="getState(row.original.state).label" :color="getState(row.original.state).color"
                    variant="outline" />
            </template>
            <template #owner-cell="{ row }">
                <span>{{ row.original.ownerUserName }}</span>
            </template>
            <template #teammate-cell="{ row }">
                <span>{{ row.original.type === 'Team' ? (row.original.teammateUserName || '-') : '-' }}</span>
            </template>
            <template #teamName-cell="{ row }">
                <span>{{ row.original.type === 'Team' ? (row.original.teamName || '-') : '-' }}</span>
            </template>
            <template #createdAt-cell="{ row }">
                <span>{{ formatDate(row.original.createdAt as string) }}</span>
            </template>
            <!-- :disabled="!actionAvilabel" -->
            <template #actions-cell="{ row }">
                <UButtonGroup v-if="row.original.state == TournamentJoinRequestState.WaitingApproval && canAction">
                    <UButton v-if="canAcceptMore" color="success" variant="outline" icon="i-lucide-check"
                        @click="handleAcceptJoinRequest(row.original.id)"></UButton>
                    <UButton color="error" variant="outline" icon="i-lucide-x"
                        @click="handleRejectJoinRequest(row.original.id)"></UButton>
                </UButtonGroup>
            </template>
        </UTable>

        <UPagination class="mt-auto" v-model:page="params.pageNumber"
            :total="getRequest.data.value?.data.totalCount ?? 0" :page-size="params.pageSize" />
    </div>
</template>
<script lang="ts" setup>
import { TournamentJoinRequestState, type GetTournamentJoinRequestParams } from '~/models/TournamentJoinRequest';

const id = useRoute().params.id.toString()
const props = defineProps<{
    canAction: boolean
    canAcceptMore: boolean
}>()

const params = ref<GetTournamentJoinRequestParams>({
    state: TournamentJoinRequestState.WaitingApproval,
    type: null,
    pageNumber: 1,
    pageSize: 9
})

const { getTournamentJoinRequests,
    getTournamentJoinRequestStateOptions,
    getTournamentJoinRequestTypeOptions,
    getTouranmentnumberofUserWantstoIn,
    getType,
    getState,
    AcceptJoinRequest,
    RejectJoinRequest } = useTournamentJoinRequest()
const getRequest = getTournamentJoinRequests(id, params)
const { data: numebrofUsers, refresh: refreshNumebrofUsers } = await getTouranmentnumberofUserWantstoIn(id)


const availableRequests = computed(() => getRequest.data.value?.data.items ?? [])
const totalCount = computed(() => getRequest.data.value?.data.totalCount ?? 0)

const cols = [
    { accessorKey: 'teamName', header: 'اسم الفريق' },
    { accessorKey: 'owner', header: 'المالك' },
    { accessorKey: 'teammate', header: 'المتابع' },
    { accessorKey: 'type', header: 'النوع' },
    { accessorKey: 'state', header: 'الحالة' },
    { accessorKey: 'createdAt', header: 'تاريخ الطلب' },
    { accessorKey: 'actions', header: 'الإجراءات' }
]
const AcceptReq = AcceptJoinRequest()
const RejectReq = RejectJoinRequest()
const handleAcceptJoinRequest = async (joinRequestId: string) => {
    await AcceptReq.fetchREQ(joinRequestId, id)
}
const handleRejectJoinRequest = async (joinRequestId: string) => {
    await RejectReq.fetchREQ(joinRequestId, id)
}
</script>