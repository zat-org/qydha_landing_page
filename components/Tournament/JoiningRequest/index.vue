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

    <div class="space-y-6">
      <!-- Loading State -->


      <!-- Error State -->

      <!-- No Requests -->
      <!-- <div  class="text-center py-8">
        <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات فرق</h3>
        <p class="text-gray-500">لا توجد طلبات انضمام فرق لهذه البطولة حتى الآن.</p>
      </div> -->

      <!-- Requests Table -->
      <div>
        <UTable :data="[]" :columns="columns" class="w-full">
          <!-- Team Name Column -->
          <template #name-cell="{ row }">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <!-- <div>
                <div class="text-sm font-medium text-gray-900">{{ row.original.name }}</div>
                <div class="text-sm text-gray-500">رقم الفريق: {{ row.original.id }}</div>
              </div> -->
            </div>
          </template>

          <!-- Status Column -->
          <template #status-cell="{ row }">
            <!-- <UBadge :color="getStatusColor(row.original.status)"
              :variant="row.original.status === 'Pending' ? 'soft' : 'subtle'">
              {{ getStatusText(row.original.status) }}
            </UBadge> -->
          </template>

          <!-- Members Column -->
          <template #members-cell="{ row }">
            <!-- <div class="text-sm">
              <div class="font-medium text-gray-900">{{ row.original.players?.length || 0 }} أعضاء</div>
              <div class="text-gray-500">
                <template v-if="row.original.players && row.original.players.length > 0">
                  {{row.original.players.slice(0, 2).map((p: IPlayer) => p.name).join('، ')}}
                  <span v-if="row.original.players.length > 2">، و{{ row.original.players.length - 2 }} آخرين</span>
                </template>
                <span v-else>لا يوجد أعضاء</span>
              </div>
            </div> -->
          </template>


          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <!-- <div class="flex gap-2 justify-end">
              <template v-if="row.original.status === 'Pending'">
                <UButton color="success" variant="solid" size="xs" :loading="acceptingTeam === row.original.id"
                  @click="acceptTeam(row.original.id)">
                  <UIcon name="i-heroicons-check" class="w-3 h-3" />
                </UButton>
                <UButton color="error" variant="solid" size="xs" :loading="refusingTeam === row.original.id"
                  @click="refuseTeam(row.original.id)">
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </UButton>
              </template>

              <template v-else-if="row.original.status === 'Approved'">
                <UButton color="error" variant="outline" size="xs" :loading="refusingTeam === row.original.id"
                  @click="refuseTeam(row.original.id)">
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </UButton>
              </template>

              <template v-else-if="row.original.status === 'Rejected'">
                <UButton color="success" variant="outline" size="xs" :loading="acceptingTeam === row.original.id"
                  @click="acceptTeam(row.original.id)">
                  <UIcon name="i-heroicons-check" class="w-3 h-3" />
                </UButton>
              </template>

              <UButton color="neutral" variant="ghost" size="xs" @click="viewTeamDetails(row.original)">
                <UIcon name="i-heroicons-eye" class="w-3 h-3" />
              </UButton>
            </div> -->
          </template>
        </UTable>
      </div>
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
import type { GetTournamentJoinRequestParams } from '~/models/TournamentJoinRequest';

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

// Table Columns
const columns = [
  {
    accessorKey: 'name',
    header: 'اسم الفريق',
    sortable: true
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    sortable: true
  },
  {
    accessorKey: 'members',
    header: 'الأعضاء',
    sortable: false
  },

  {
    accessorKey: 'actions',
    header: 'الإجراءات',
    sortable: false
  }
]

const playerColumns = [
  {
    accessorKey: 'name',
    header: 'الاسم',
    sortable: true
  },
  {
    accessorKey: 'contact',
    header: 'الاتصال',
    sortable: false
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    sortable: true
  }
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
