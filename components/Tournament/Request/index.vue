<template>
  <UCard  dir="rtl">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="navigateTo('/tournament')"
          />
          <h1 class="text-2xl font-bold">طلبات الانضمام للبطولة</h1>
        </div>
        <UBadge v-if="pendingRequestsCount > 0" color="warning" variant="subtle">
          {{ pendingRequestsCount }} طلب معلق
        </UBadge>

      </div>
    </template>

    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-8">
        <!-- <USpinner size="lg" /> --> 
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <UAlert color="error" title="خطأ في تحميل الطلبات" :description="error.message" />
      </div>

      <!-- No Requests -->
      <div v-else-if="!teams || teams.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات فرق</h3>
        <p class="text-gray-500">لا توجد طلبات انضمام فرق لهذه البطولة حتى الآن.</p>
      </div>

      <!-- Requests Table -->
      <div v-else>
        <UTable 
          :data="teams" 
          :columns="columns"
          :loading="pending"
          class="w-full"
        >
          <!-- Team Name Column -->
          <template #name-cell="{row}">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ row.original.name }}</div>
                <div class="text-sm text-gray-500">رقم الفريق: {{ row.original.id }}</div>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template #status-cell="{ row }">
            <UBadge 
              :color="getStatusColor(row.original.status)" 
              :variant="row.original.status === 'Pending' ? 'soft' : 'subtle'"
            >
              {{ getStatusText(row.original.status) }}
            </UBadge>
          </template>

          <!-- Members Column -->
          <template #members-cell="{ row }">
            <div class="text-sm">
              <div class="font-medium text-gray-900">{{ row.original.players?.length || 0 }} أعضاء</div>
              <div class="text-gray-500">
                <template v-if="row.original.players && row.original.players.length > 0">
                  {{ row.original.players.slice(0, 2).map((p: IPlayer) => p.name).join('، ') }}
                  <span v-if="row.original.players.length > 2">، و{{ row.original.players.length - 2 }} آخرين</span>
                </template>
                <span v-else>لا يوجد أعضاء</span>
              </div>
            </div>
          </template>


          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex gap-2 justify-end">
              <template v-if="row.original.status === 'Pending'">
                <UButton 
                  color="success" 
                  variant="solid" 
                  size="xs"
                  :loading="acceptingTeam === row.original.id"
                  @click="acceptTeam(row.original.id)"
                >
                  <UIcon name="i-heroicons-check" class="w-3 h-3" />
                </UButton>
                <UButton 
                  color="error" 
                  variant="solid" 
                  size="xs"
                  :loading="refusingTeam === row.original.id"
                  @click="refuseTeam(row.original.id)"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </UButton>
              </template>
              
              <template v-else-if="row.original.status === 'Approved'">
                <UButton 
                  color="error" 
                  variant="outline" 
                  size="xs"
                  :loading="refusingTeam === row.original.id"
                  @click="refuseTeam(row.original.id)"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </UButton>
              </template>
              
              <template v-else-if="row.original.status === 'Rejected'">
                <UButton 
                  color="success" 
                  variant="outline" 
                  size="xs"
                  :loading="acceptingTeam === row.original.id"
                  @click="acceptTeam(row.original.id)"
                >
                  <UIcon name="i-heroicons-check" class="w-3 h-3" />
                </UButton>
              </template>

              <!-- View Details Button -->
              <UButton 
                color="neutral" 
                variant="ghost" 
                size="xs"
                @click="viewTeamDetails(row.original)"
              >
                <UIcon name="i-heroicons-eye" class="w-3 h-3" />
              </UButton>
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <!-- Team Details Modal -->
    <UModal v-model:open="showDetailsModal" :title="`تفاصيل الفريق ${selectedTeam?.name}`" description="تفاصيل الفريق" prevent-close>
            
       <template #body>
        <div v-if="selectedTeam" class="space-y-6">
          <!-- Team Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">اسم الفريق</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTeam.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">رقم الفريق</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTeam.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">الشخص المسؤول</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTeam?.additionalData?.contactPerson || 'غير محدد' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">تاريخ التسجيل</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTeam?.additionalData?.registrationDate) }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedTeam?.additionalData?.notes">
            <label class="text-sm font-medium text-gray-700">ملاحظات</label>
            <p class="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">{{ selectedTeam?.additionalData?.notes }}</p>
          </div>

          <!-- Team Members -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-3 block">
              أعضاء الفريق ({{ selectedTeam.players?.length || 0 }})
            </label>
            
            <div v-if="selectedTeam.players && selectedTeam.players.length > 0" class="space-y-2">
              <UTable 
                :data="selectedTeam.players" 
                :columns="playerColumns"
                class="w-full"
              >
                <!-- Player Name Column -->
                <template #name-cell="{ row }">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-user" class="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ row.original.name }}</div>
                      <div class="text-xs text-gray-500">{{ row.original.email }}</div>
                    </div>
                  </div>
                </template>

                <!-- Player Contact Column -->
                <template #contact-cell="{ row }">
                  <div class="text-sm">
                    <div>{{ row.original.phone }}</div>
                    <div v-if="row.original.qydhaUserData?.username" class="text-blue-600">
                      @{{ row.original.qydhaUserData.username }}
                    </div>
                  </div>
                </template>

                <!-- Player Status Column -->
                <template #status-cell="{ row }">
                  <UBadge 
                    :color="getStatusColor(row.original.state)" 
                    size="xs"
                  >
                    {{ getStatusText(row.original.state) }}
                  </UBadge>
                </template>
              </UTable>
            </div>
            
            <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
              <UIcon name="i-heroicons-user-group" class="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p class="text-gray-500 text-sm">لم يتم إضافة لاعبين لهذا الفريق بعد</p>
            </div>
          </div>
        </div>
        </template>

        <template #footer>
          <div class="flex justify-between items-center">
            <!-- Action Buttons -->
            <div class="flex gap-2">
              <template v-if="selectedTeam?.status === 'Pending'">
                <UButton 
                  color="success" 
                  :loading="acceptingTeam === selectedTeam.id"
                  @click="acceptTeam(selectedTeam.id)"
                >
                  <UIcon name="i-heroicons-check" class="w-4 h-4 ml-1" />
                  قبول الفريق
                </UButton>
                <UButton 
                  color="error" 
                  :loading="refusingTeam === selectedTeam.id"
                  @click="refuseTeam(selectedTeam.id)"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                  رفض الفريق
                </UButton>
              </template>
              
              <template v-else-if="selectedTeam?.status === 'Approved'">
                <UButton 
                  color="error" 
                  variant="outline"
                  :loading="refusingTeam === selectedTeam.id"
                  @click="refuseTeam(selectedTeam.id)"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                  رفض الفريق
                </UButton>
              </template>
              
              <template v-else-if="selectedTeam?.status === 'Rejected'">
                <UButton 
                  color="success" 
                  variant="outline"
                  :loading="acceptingTeam === selectedTeam.id"
                  @click="acceptTeam(selectedTeam.id)"
                >
                  <UIcon name="i-heroicons-check" class="w-4 h-4 ml-1" />
                  قبول الفريق
                </UButton>
              </template>
            </div>

            <!-- Close Button -->
            <UButton variant="ghost" @click="showDetailsModal = false">
              إغلاق
            </UButton>
          </div>
        </template>
      
    </UModal>

    <!-- Confirmation Modal -->
    <UModal v-model:open="showConfirmModal" :title="`تأكيد ${modalAction === 'accept' ? 'قبول' : 'رفض'} الفريق ${selectedTeam?.name}`" :description="`تأكيد ${modalAction === 'accept' ? 'قبول' : 'رفض'} الفريق ${selectedTeam?.name}`" prevent-close>
      
        
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
            <UButton 
              :color="modalAction === 'accept' ? 'success' : 'error'"
              :loading="isProcessing"
              @click="confirmAction"
            >
              {{ modalAction === 'accept' ? 'قبول' : 'رفض' }} الفريق
            </UButton>
          </div>
        </template>

    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITeam, IPlayer } from '~/models/tournamentTeam'
import { PlayerState } from '~/models/Player'

// Props
interface Props {
  tournamentId: string
}
const props = defineProps<Props>()

// Composables
const toast = useToast()
const { getAllTourTeams, acceptTourTeam, refuseTourTeam } = useTourrnamentTeam()

// State
const teams = ref<ITeam[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)
const acceptingTeam = ref<number | null>(null)
const refusingTeam = ref<number | null>(null)
const showConfirmModal = ref(false)
const showDetailsModal = ref(false)
const modalAction = ref<'accept' | 'refuse'>('accept')
const selectedTeam = ref<ITeam | null>(null)
const isProcessing = ref(false)

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

// Dummy Data for Testing
const dummyTeams: ITeam[] = [
  {
    id: 1,
    name: "فريق النصر الذهبي",
    tournamentId: parseInt(props.tournamentId),
    status: PlayerState.Pending,
    additionalData: {
      notes: "فريق محترف بخبرة 5 سنوات في البلوت",
      registrationDate: "2024-01-15",
      contactPerson: "أحمد محمد الأحمد"
    },
    players: [
      {
        id: "1",
        name: "أحمد محمد الأحمد",
        email: "ahmed@example.com",
        phone: "+966501234567",
        tournamentId: props.tournamentId,
        teamId: 1,
        teamName: "فريق النصر الذهبي",
        state: PlayerState.Approved,
        qydhaUserData: {
          id: "user1",
          username: "ahmed_champion",
          name: "أحمد محمد",
          phone: "+966501234567",
          avatarUrl: null
        }
      },
      {
        id: "2",
        name: "سعد عبدالله الحربي",
        email: "saad@example.com",
        phone: "+966507654321",
        tournamentId: props.tournamentId,
        teamId: 1,
        teamName: "فريق النصر الذهبي",
        state: PlayerState.Pending,
        qydhaUserData: {
          id: "user2",
          username: "saad_pro",
          name: "سعد الحربي",
          phone: "+966507654321",
          avatarUrl: null
        }
      }
    ]
  },
  {
    id: 2,
    name: "أبطال الشرق",
    tournamentId: parseInt(props.tournamentId),
    status: PlayerState.Approved,
 
    players: [
      {
        id: "3",
        name: "خالد سعد الغامدي",
        email: "khalid@example.com",
        phone: "+966551122334",
        tournamentId: props.tournamentId,
        teamId: 2,
        teamName: "أبطال الشرق",
        state: PlayerState.Approved,
        qydhaUserData: {
          id: "user3",
          username: "khalid_east",
          name: "خالد الغامدي",
          phone: "+966551122334",
          avatarUrl: null
        }
      },
      {
        id: "4",
        name: "محمد علي القحطاني",
        email: "mohammed@example.com",
        phone: "+966554433221",
        tournamentId: props.tournamentId,
        teamId: 2,
        teamName: "أبطال الشرق",
        state: PlayerState.Approved,
        qydhaUserData: {
          id: "user4",
          username: "mohammed_ali",
          name: "محمد القحطاني",
          phone: "+966554433221",
          avatarUrl: null
        }
      }
    ]
  },
  {
    id: 3,
    name: "نجوم الرياض",
    tournamentId: parseInt(props.tournamentId),
    status: PlayerState.Rejected,
    
    players: [
      {
        id: "5",
        name: "فهد إبراهيم الدوسري",
        email: "fahad@example.com",
        phone: "+966556677889",
        tournamentId: props.tournamentId,
        teamId: 3,
        teamName: "نجوم الرياض",
        state: PlayerState.Rejected,
        qydhaUserData: {
          id: "user5",
          username: "fahad_star",
          name: "فهد الدوسري",
          phone: "+966556677889",
          avatarUrl: null
        }
      },
      {
        id: "6",
        name: "عبدالعزيز ناصر العتيبي",
        email: "abdulaziz@example.com",
        phone: "+966559988776",
        tournamentId: props.tournamentId,
        teamId: 3,
        teamName: "نجوم الرياض",
        state: PlayerState.Pending,
        qydhaUserData: {
          id: "user6",
          username: "aziz_riyadh",
          name: "عبدالعزيز العتيبي",
          phone: "+966559988776",
          avatarUrl: null
        }
      }
    ]
  }
]

// Computed
const pendingRequestsCount = computed(() => {
  return teams.value?.filter(team => team.status === PlayerState.Pending).length || 0
})

// Methods
const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case PlayerState.Approved:
    case 'Approved':
      return 'success'
    case PlayerState.Pending:
    case 'Pending':
      return 'warning'
    case PlayerState.Rejected:
    case 'Rejected':
      return 'error'
    default:
      return 'neutral'
  }
}

const getStatusText = (status: string | undefined) => {
  switch (status) {
    case PlayerState.Approved:
    case 'Approved':
      return 'مقبول'
    case PlayerState.Pending:
    case 'Pending':
      return 'معلق'
    case PlayerState.Rejected:
    case 'Rejected':
      return 'مرفوض'
    default:
      return 'غير محدد'
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadTeams = async () => {
  try {
    pending.value = true
    error.value = null
    
    // Use dummy data for now
    teams.value = dummyTeams
    
    // Uncomment below when API is ready
    // const { data: teamsData, fetchREQ } = await getAllTourTeams()
    // await fetchREQ(props.tournamentId)
    // if (teamsData.value?.data?.items) {
    //   teams.value = teamsData.value.data.items.map(team => ({
    //     ...team,
    //     status: team.status || PlayerState.Pending
    //   }))
    // }
  } catch (err) {
    error.value = err as Error
    toast.add({
      title: 'خطأ',
      description: 'فشل في تحميل طلبات الفرق',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}

const viewTeamDetails = (team: ITeam) => {
  console.log('viewTeamDetails called with team:', team)
  console.log('showDetailsModal before:', showDetailsModal.value)
  selectedTeam.value = team
  showDetailsModal.value = true
  console.log('showDetailsModal after:', showDetailsModal.value)
  console.log('selectedTeam set to:', selectedTeam.value)
}

const acceptTeam = async (teamId: number) => {
  console.log('acceptTeam called with teamId:', teamId)
  console.log('showConfirmModal before:', showConfirmModal.value)
  const team = teams.value.find(t => t.id === teamId)
  if (!team) {
    console.log('Team not found with id:', teamId)
    return
  }
  
  selectedTeam.value = team
  modalAction.value = 'accept'
  showConfirmModal.value = true
  console.log('showConfirmModal after:', showConfirmModal.value)
  console.log('modalAction set to:', modalAction.value)
}

const refuseTeam = async (teamId: number) => {
  console.log('refuseTeam called with teamId:', teamId)
  const team = teams.value.find(t => t.id === teamId)
  if (!team) {
    console.log('Team not found with id:', teamId)
    return
  }
  
  selectedTeam.value = team
  modalAction.value = 'refuse'
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!selectedTeam.value) return
  
  try {
    isProcessing.value = true
    
    if (modalAction.value === 'accept') {
      acceptingTeam.value = selectedTeam.value.id
      // For dummy data, just update locally
      const teamIndex = teams.value.findIndex(t => t.id === selectedTeam.value!.id)
      if (teamIndex !== -1) {
        teams.value[teamIndex].status = PlayerState.Approved
      }
      
      // Uncomment when API is ready
      // const { fetchREQ: acceptTeam } = await acceptTourTeam()
      // await acceptTeam(props.tournamentId, selectedTeam.value.id.toString())
    } else {
      refusingTeam.value = selectedTeam.value.id
      // For dummy data, just update locally
      const teamIndex = teams.value.findIndex(t => t.id === selectedTeam.value!.id)
      if (teamIndex !== -1) {
        teams.value[teamIndex].status = PlayerState.Rejected
      }
      
      // Uncomment when API is ready
      // const { fetchREQ: refuseTeam } = await refuseTourTeam()
      // await refuseTeam(props.tournamentId, selectedTeam.value.id.toString())
    }
    
    toast.add({
      title: 'نجح العملية',
      description: `تم ${modalAction.value === 'accept' ? 'قبول' : 'رفض'} فريق "${selectedTeam.value.name}" بنجاح`,
      color: modalAction.value === 'accept' ? 'success' : 'warning'
    })
    
    showConfirmModal.value = false
    showDetailsModal.value = false
  } catch (err) {
    toast.add({
      title: 'خطأ',
      description: `فشل في ${modalAction.value === 'accept' ? 'قبول' : 'رفض'} طلب الفريق`,
      color: 'error'
    })
  } finally {
    isProcessing.value = false
    acceptingTeam.value = null
    refusingTeam.value = null
  }
}

// Test modal function for debugging
const testModal = () => {
  console.log('Test modal clicked')
  console.log('Current teams:', teams.value)
  if (teams.value.length > 0) {
    console.log('Setting selectedTeam to first team')
    selectedTeam.value = teams.value[0]
    showDetailsModal.value = true
    console.log('showDetailsModal set to:', showDetailsModal.value)
  } else {
    console.log('No teams available')
  }
}

// Refresh teams data
const refresh = () => {
  loadTeams()
}

// Load teams on mount
onMounted(() => {
  loadTeams()
})

// Expose refresh method for parent components
defineExpose({
  refresh
})
</script>

<style scoped>
/* RTL specific styles */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}
</style>
