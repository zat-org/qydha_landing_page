<template>
  <UCard dir="rtl">
    <template #header>
      <div class="flex  flex-col  gap-4 ">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="navigateTo('/tournament')" />
          <h1 class="text-2xl font-bold">طلبات الانضمام للبطولة</h1>
        </div>
        <div class="flex  w-full gap-4" >
          <UFormField class="flex-1">
          <USelect :items="getTournamentJoinRequestStateOptions()" v-model="params.state" />
          </UFormField>
          <UFormField class="flex-1">
          <USelect :items="getTournamentJoinRequestTypeOptions()" v-model="params.type" />
          </UFormField>

        </div>
        <!-- <UBadge v-if
         ="pendingRequestsCount > 0" color="warning" variant="subtle">
          {{ pendingRequestsCount }} طلب معلق
        </UBadge> -->

      </div>
    </template>

      <!-- Loading State -->


      <!-- Error State -->

      <!-- No Requests -->
      <!-- <div  class="text-center py-8">
        <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات فرق</h3>
        <p class="text-gray-500">لا توجد طلبات انضمام فرق لهذه البطولة حتى الآن.</p>
      </div> -->

      <!-- Requests Table -->
      <div class="flex flex-col gap-4 items-center  h-full  flex-1">
        <Loading v-if="getRequest.status.value == 'pending'" />
        <UTable v-else :data="data" class="w-full" :columns="cols">
          <template #type-cell="{ row }">
            <UBadge :label="getType(row.original.type).label" :color="getType(row.original.type).color" variant="outline" />
          </template>
          <template #state-cell="{ row }">
            <UBadge :label="getState(row.original.state).label" :color="getState(row.original.state).color" variant="outline" />
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
          <template #actions-cell="{ row }">
            <UButtonGroup>
              <UButton v-if="canAct(row.original.state)" color="success" variant="outline" icon="i-lucide-check" :loading="actionLoadingId === row.original.id && actionType==='approve'"
                @click="onApprove(row.original.id)"></UButton>
              <UButton v-if="canAct(row.original.state)" color="error" variant="outline" icon="i-lucide-x" :loading="actionLoadingId === row.original.id && actionType==='reject'"
                @click="onReject(row.original.id)"></UButton>
            </UButtonGroup>
          </template>
        </UTable>
        
        <UPagination  class="mt-auto" v-model="params.pageNumber" :total="getRequest.data.value?.data.totalCount ?? 0" :page-size="params.pageSize" />
      </div>

   

    <!-- Confirmation Modal -->
    <!-- <UModal v-model:open="showConfirmModal"
      :title="`تأكيد ${modalAction === 'accept' ? 'قبول' : 'رفض'} الفريق ${selectedTeam?.name}`"
      :description="`تأكيد ${modalAction === 'accept' ? 'قبول' : 'رفض'} الفريق ${selectedTeam?.name}`" prevent-close>


      <template #body>
        <div class="text-gray-600">
          <p class="mb-3">
            هل أنت متأكد من {{ modalAction === 'accept' ? 'قبول' : 'رفض' }} فريق "{{ selectedTeam?.name }}"؟
          </p>
          <p class="text-sm">
            {{ modalAction === 'accept'
              ? 'سيتم الموافقة على مشاركتهم في البطولة.'
              : 'سيتم رفض طلبهم للانضمام إلى البطولة.'
            }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showConfirmModal = false">
            إلغاء
          </UButton>
          <UButton :color="modalAction === 'accept' ? 'success' : 'error'" :loading="isProcessing"
            @click="confirmAction">
            {{ modalAction === 'accept' ? 'قبول' : 'رفض' }} الفريق
          </UButton>
        </div>
      </template>

    </UModal> -->
  </UCard>
</template>

<script lang="ts" setup>
import { useTournamentJoinRequest } from '~/composables/TournamentJoinRequest';
import  { type GetTournamentJoinRequestParams, TournamentJoinRequestState } from '~/models/TournamentJoinRequest';

// Props
interface Props {
  tournamentId: string
}
const props = defineProps<Props>()
const params = ref<GetTournamentJoinRequestParams>({
  state: null,
  type: null,
  pageNumber: 1,
  pageSize: 10
})
// Composables
const toast = useToast()
const { getTournamentJoinRequests, ApproveJoinRequest, RejectJoinRequest ,getTournamentJoinRequestStateOptions,getTournamentJoinRequestTypeOptions} = useTournamentJoinRequest()
const getRequest = getTournamentJoinRequests(props.tournamentId, params)
const data = computed(() => getRequest.data.value?.data.items ?? [])
// Helpers
type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
const stateOptions = getTournamentJoinRequestStateOptions()
const typeOptions = getTournamentJoinRequestTypeOptions()
const getState = (state: any) => {
  const found = stateOptions.find((o:any) => o.value === state)
  return found ? { label: found.label, color: (found.color ?? 'neutral') as BadgeColor } : { label: state, color: 'neutral' as BadgeColor }
}
const getType = (type: any) => {
  const found = typeOptions.find((o:any) => o.value === type)
  return found ? { label: found.label, color: (found.color ?? 'neutral') as BadgeColor } : { label: type, color: 'neutral' as BadgeColor }
}

// Action handling
const actionLoadingId = ref<string | null>(null)
const actionType = ref<'approve' | 'reject' | null>(null)
const canAct = (state: TournamentJoinRequestState) => [TournamentJoinRequestState.WaitingApproval].includes(state)
const onApprove = async (id: any) => {
  actionLoadingId.value = id
  actionType.value = 'approve'
  try {
    const req = await ApproveJoinRequest(id)
    await req.execute()
    toast.add({ title: 'تمت الموافقة على الطلب', color: 'success' })
  } catch (e) {
    toast.add({ title: 'فشل قبول الطلب', color: 'error' })
  } finally {
    actionLoadingId.value = null
    actionType.value = null
  }
}
const onReject = async (id: any) => {
  actionLoadingId.value = id
  actionType.value = 'reject'
  try {
    const req = await RejectJoinRequest(id)
    await req.execute()
    toast.add({ title: 'تم رفض الطلب', color: 'success' })
  } catch (e) {
    toast.add({ title: 'فشل رفض الطلب', color: 'error' })
  } finally {
    actionLoadingId.value = null
    actionType.value = null
  }
}

// Table Columns
const cols = [
  { accessorKey: 'teamName', header: 'الفريق' },
  { accessorKey: 'owner', header: 'المالك' },
  { accessorKey: 'teammate', header: 'الزميل' },
  { accessorKey: 'type', header: 'النوع' },
  { accessorKey: 'state', header: 'الحالة' },
  { accessorKey: 'createdAt', header: 'تاريخ الطلب' },
  { id: 'actions', header: '#' }
]

</script>

<style scoped>
/* RTL specific styles */
.space-x-reverse> :not([hidden])~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}
</style>
