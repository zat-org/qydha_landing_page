<template>
  <UCard dir="rtl">
    <template #header>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="navigateTo('/tournament')" />
          <h1 class="text-2xl font-bold">طلبات الانضمام للبطولة</h1>
        </div>
        <!-- <div class="flex w-full gap-4">
          <UFormField class="flex-1">
            <USelect :items="getTournamentJoinRequestStateOptions()" v-model="params.state" />
          </UFormField>
          <UFormField class="flex-1">
            <USelect :items="getTournamentJoinRequestTypeOptions()" v-model="params.type" />
          </UFormField>
        </div> -->
      </div>
    </template>

    <!-- Auto Complete Button -->
    <div class="mb-6 flex justify-end">
      <UButton color="primary" icon="i-heroicons-sparkles" 
        @click="onAutoComplete" :loading="isProcessing" :disabled="canSubmit()">
        إكمال تلقائي للفرق
      </UButton>
    </div>

    <!-- Validation Display -->
    <UAlert v-if="!canSubmit() && (acceptedTeams.length > 0 || acceptedSingles.length > 0)" 
      color="warning" variant="subtle" icon="i-heroicons-exclamation-triangle" class="mb-4">
      <template #description>
        <p>
          الفرق المقبولة: {{ acceptedTeams.length }} | 
          الطلبات الفردية المقبولة: {{ acceptedSingles.length }} | 
          العدد المطلوب: {{ expectedTeamsCount }}
        </p>
        <p class="mt-2">
          العدد الحالي: {{ currentCount }} / {{ expectedTeamsCount }}
        </p>
      </template>
    </UAlert>

    <UAlert v-if="canSubmit()" color="success" variant="subtle" icon="i-heroicons-check-circle" class="mb-4">
      <template #description>
        <p>تم الوصول للعدد المطلوب من الفرق. يمكنك الآن الإرسال.</p>
      </template>
    </UAlert>

    <!-- Tabs Section -->
    <UTabs :items="tabItems" v-model="selectedTab" class="mb-6" dir="rtl">
      <!-- Tab 1: All Requests -->
      <template #all-requests>
        <div class="flex flex-col gap-4 items-center h-full flex-1">
          <ClientOnly>
            <UAlert v-if="!actionAvilabel && status == 'success'" color="warning" variant="subtle" 
              icon="i-heroicons-exclamation-triangle">
              <template #description>
                <p>لا يمكنك القيام بهذا الإجراء في هذا الوقت لان البطولة لم تبدأ بعد او لم ينتهي الوقت للانضمام</p>
              </template>
            </UAlert>
          </ClientOnly>
            {{ availableRequests.length }}
          <Loading v-if="getRequest.status.value == 'pending'" />
          <UTable v-else :data="availableRequests" class="w-full" :columns="cols">
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
            <template #actions-cell="{ row }">
              <UButtonGroup>
                <!-- :disabled="!actionAvilabel" -->
                <UButton v-if="canAct(row.original.state) && canAddMore()" 
                  color="success" variant="outline" icon="i-lucide-check" 
                  :loading="actionLoadingId === row.original.id && actionType==='accept'"
                  @click="onAcceptRequest(row.original)" ></UButton>
                <UButton v-if="canAct(row.original.state)" color="error" variant="outline" icon="i-lucide-x" 
                  :loading="actionLoadingId === row.original.id && actionType==='reject'"
                  @click="onReject(row.original.id)" ></UButton>
              </UButtonGroup>
            </template>
          </UTable>
          
          <UPagination class="mt-auto" v-model="params.pageNumber" 
            :total="getRequest.data.value?.data.totalCount ?? 0" :page-size="params.pageSize" />
        </div>
      </template>

      <!-- Tab 2: Accepted Singles -->
      <template #accepted-singles>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">الطلبات الفردية المقبولة ({{ acceptedSingles.length }})</h3>
            <div class="flex gap-2">
              <UButton v-if="acceptedSingles.length >= 2" 
                color="primary" variant="soft" size="sm" 
                @click="showMergeModal = true">
                دمج الطلبات
              </UButton>
            </div>
          </div>
          <UTable :data="acceptedSingles" class="w-full" :columns="singleCols">
            <template #owner-cell="{ row }">
              <span>{{ row.original.ownerUserName }}</span>
            </template>
            <template #createdAt-cell="{ row }">
              <span>{{ formatDate(row.original.createdAt as string) }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UButton color="error" variant="outline" icon="i-heroicons-x-mark" size="sm"
                @click="onCancelSingle(row.original)" />
            </template>
          </UTable>
          <div v-if="acceptedSingles.length === 0" class="text-center text-gray-500 py-8">
            لا توجد طلبات فردية مقبولة
          </div>
        </div>
      </template>

      <!-- Tab 3: Accepted Teams -->
      <template #accepted-teams>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">الفرق المقبولة ({{ acceptedTeams.length }})</h3>
          </div>
          <UTable :data="acceptedTeams" class="w-full" :columns="teamCols">
            <template #teamName-cell="{ row }">
              <span>{{ row.original.teamName || `${row.original.ownerUserName} & ${row.original.teammateUserName}` }}</span>
            </template>
            <template #owner-cell="{ row }">
              <span>{{ row.original.ownerUserName }}</span>
            </template>
            <template #teammate-cell="{ row }">
              <span>{{ row.original.teammateUserName || '-' }}</span>
            </template>
            <template #source-cell="{ row }">
              <UBadge v-if="row.original.originalType === 'Single'" label="من دمج" color="info" size="xs" />
              <UBadge v-else label="طلب فريق" color="success" size="xs" />
            </template>
            <template #createdAt-cell="{ row }">
              <span>{{ formatDate(row.original.createdAt as string) }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UButton color="error" variant="outline" icon="i-heroicons-x-mark" size="sm"
                @click="onCancelTeam(row.original)" />
            </template>
          </UTable>
          <div v-if="acceptedTeams.length === 0" class="text-center text-gray-500 py-8">
            لا توجد فرق مقبولة
          </div>
        </div>
      </template>
    </UTabs>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end">
      <UButton color="success" size="lg" :disabled="!canSubmit()" :loading="isSubmitting"
        @click="onSubmit">
        إرسال الفرق المقبولة
      </UButton>
    </div>

    <!-- Merge Modal -->
    <UModal v-model:open="showMergeModal" title="دمج الطلبات الفردية">
      <template #body>
        <div class="space-y-4">
          <UFormField label="طريقة الدمج">
            <URadioGroup v-model="mergeMode" :options="mergeModeOptions" />
          </UFormField>
          
          <div v-if="mergeMode === 'manual'">
            <UFormField label="اختر الطلب الأول">
              <USelect v-model="selectedSingle1" :items="availableSinglesForMerge" 
                :value="selectedSingle1 ?? undefined" />
            </UFormField>
            <UFormField label="اختر الطلب الثاني" class="mt-4">
              <USelect v-model="selectedSingle2" 
                :items="availableSinglesForMerge.filter(s => s.value !== selectedSingle1)" 
                :value="selectedSingle2 ?? undefined" />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showMergeModal = false">إلغاء</UButton>
          <UButton color="primary" @click="onMerge" :disabled="mergeMode === 'manual' && (!selectedSingle1 || !selectedSingle2)">
            دمج
          </UButton>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
import { useTournamentJoinRequest } from '~/composables/TournamentJoinRequest';
import type { DetailTournament } from '~/models/tournament';
import { 
  type GetTournamentJoinRequestParams, 
  TournamentJoinRequestState,
  TournamentJoinRequestType,
  type TournamentJoinRequest,
  type SingleJoinRequest,
  type TeamJoinRequest,
  type AcceptedTeam,
} from '~/models/TournamentJoinRequest';
import { useTournamentJoinRequestStore } from '~/store/tournamentJoinRequest';
import { formatDate } from '~/utils/formatDate';
import Loading from '../../loading.vue';

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

// Store
const store = useTournamentJoinRequestStore()

onMounted(()=>{
  store.addDummyData()

})


// get data from single tournament with usenuxt data
const id = useRoute().params.id.toString()
const TOURAPI = useTournament()
const { data: tournament, status } = await TOURAPI.getSingelTournament(id)

// Initialize store
watch(tournament, (newTournament) => {
  if (newTournament?.data) {
    store.setTournament(newTournament.data)
  }
}, { immediate: true })

// update action available with date 
const actionAvilabel = computed(() => {
  const beforestartdate = new Date(tournament.value?.data.tournament.startAt ?? '') > new Date()
  const afterJoinEnd = new Date(tournament.value?.data.tournament.joinRequestEndAt ?? '') < new Date()
  if (beforestartdate && afterJoinEnd) return true
  return false
})

// Composables
const toast = useToast()
const { 
  getTournamentJoinRequests, 
  ApproveJoinRequest, 
  RejectJoinRequest,
  getTournamentJoinRequestStateOptions,
  getTournamentJoinRequestTypeOptions,
  submitAcceptedTeams,
} = useTournamentJoinRequest()
const getRequest = getTournamentJoinRequests(props.tournamentId, params)

// Initialize store with requests
// watch(() => getRequest.data.value?.data.items, (items) => {
//   if (items) {
//     // store.setAllRequests(items)
//   }
// }, { immediate: true })

// Store state
const acceptedTeams = computed(() => store.acceptedTeams)
const acceptedSingles = computed(() => store.acceptedSingles)
const expectedTeamsCount = computed(() => tournament.value?.data.tournament.expectedTeamsCount ?? 0)
const currentCount = computed(() => 
  acceptedTeams.value.length + Math.floor(acceptedSingles.value.length / 2)
)

// Tab state
const selectedTab = ref(0)
const tabItems = [
  { label: 'جميع الطلبات', value: 0, slot: 'all-requests' as const },
  { label: 'الطلبات الفردية المقبولة', value: 1, slot: 'accepted-singles' as const },
  { label: 'الفرق المقبولة', value: 2, slot: 'accepted-teams' as const },
]

// Available requests (not yet accepted)
const availableRequests = computed(() => {
  
  
  return store.allrequest
})

// Helpers
type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
const stateOptions = getTournamentJoinRequestStateOptions()
const typeOptions = getTournamentJoinRequestTypeOptions()
const getState = (state: any) => {
  const found = stateOptions.find((o: any) => o.value === state)
  return found ? { label: found.label, color: (found.color ?? 'neutral') as BadgeColor } : { label: state, color: 'neutral' as BadgeColor }
}
const getType = (type: any) => {
  const found = typeOptions.find((o: any) => o.value === type)
  return found ? { label: found.label, color: (found.color ?? 'neutral') as BadgeColor } : { label: type, color: 'neutral' as BadgeColor }
}

// Validation
const canAddMore = () => store.canAddMore()
const canSubmit = () => store.canSubmit()

// Action handling
const actionLoadingId = ref<string | null>(null)
const actionType = ref<'approve' | 'reject' | 'accept' | null>(null)
const isProcessing = ref(false)
const isSubmitting = ref(false)

const canAct = (state: TournamentJoinRequestState) => 
  [TournamentJoinRequestState.WaitingApproval].includes(state)

const onAcceptRequest = (request: TournamentJoinRequest) => {
  if (!canAddMore()) {
    toast.add({ title: 'لا يمكن إضافة المزيد من الفرق', color: 'warning' })
    return
  }

  actionLoadingId.value = request.id
  actionType.value = 'accept'
  
  if (request.type === TournamentJoinRequestType.Team) {
    store.AddAcceptedTeams(request as TeamJoinRequest)
    toast.add({ title: 'تم قبول الفريق', color: 'success' })
  } else {
    store.AddAcceptedSingles(request as SingleJoinRequest)
    toast.add({ title: 'تم قبول الطلب الفردي', color: 'success' })
  }
  
  actionLoadingId.value = null
  actionType.value = null
}

const onCancelTeam = (team: AcceptedTeam) => {
  store.RemoveAcceptedTeams(team)
  toast.add({ title: 'تم إلغاء الفريق', color: 'info' })
}

const onCancelSingle = (single: SingleJoinRequest) => {
  store.RemoveAcceptedSingles(single)
  toast.add({ title: 'تم إلغاء الطلب الفردي', color: 'info' })
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

// Auto Complete handler
const onAutoComplete = async () => {
  if (canSubmit()) {
    toast.add({ title: 'تم الوصول للعدد المطلوب من الفرق', color: 'info' })
    return
  }

  isProcessing.value = true
  try{
    store.autoSelectTeams()
  }
  catch(e){
    toast.add({ title: 'فشل العملية التلقائية', color: 'error' })
  }
  // try {
  //   // Step 1: Accept all available single requests
  //   const availableSingles = availableRequests.value.filter(
  //     req => req.type === TournamentJoinRequestType.Single
  //   ) as SingleJoinRequest[]
    
    

  //   // Step 2: Merge all accepted singles into teams (randomly)
  //   // Wait a tick to ensure reactive updates
  //   await nextTick()
  //   if (acceptedSingles.value.length >= 2) {
  //     store.mergeAllSinglesRandomly()
  //   }

  //   // Step 3: Randomly select teams from available team requests to complete expected count
  //   await nextTick()
  //   const needed = expectedTeamsCount.value - currentCount.value
  //   if (needed > 0) {
  //     const availableTeamRequests = availableRequests.value.filter(
  //       req => req.type === TournamentJoinRequestType.Team
  //     ) as TeamJoinRequest[]
      
  //     // Shuffle and select needed teams
  //     const shuffled = [...availableTeamRequests].sort(() => Math.random() - 0.5)
  //     const toAccept = shuffled.slice(0, Math.min(needed, shuffled.length))
      
  //     toAccept.forEach(team => {
  //       if (canAddMore()) {
  //         store.AddAcceptedTeams(team)
  //       }
  //     })
  //   }

  //   toast.add({ title: 'تم الإكمال التلقائي للفرق', color: 'success' })
  // } catch (e) {
  //   toast.add({ title: 'فشل العملية التلقائية', color: 'error' })
  // } 
  finally {
    isProcessing.value = false
  }
}

// Merge modal
const showMergeModal = ref(false)
const mergeMode = ref<'auto' | 'manual'>('auto')
const selectedSingle1 = ref<string | undefined>(undefined)
const selectedSingle2 = ref<string | undefined>(undefined)

const mergeModeOptions = [
  { label: 'تلقائي (عشوائي)', value: 'auto' },
  { label: 'يدوي', value: 'manual' },
]

const availableSinglesForMerge = computed(() => 
  acceptedSingles.value.map(s => ({
    label: s.ownerUserName,
    value: s.id,
  }))
)

const onMerge = () => {
  if (mergeMode.value === 'auto') {
    // Auto merge: randomly pair all singles
    store.mergeAllSinglesRandomly()
    toast.add({ title: 'تم دمج الطلبات الفردية تلقائياً', color: 'success' })
  } else {
    // Manual merge: merge selected singles
    if (selectedSingle1.value && selectedSingle2.value) {
      const single1 = store.getAcceptedSingleById(selectedSingle1.value)
      const single2 = store.getAcceptedSingleById(selectedSingle2.value)
      if (single1 && single2) {
        store.mergeAcceptedSinglesToAcceptedTeam(single1, single2)
        toast.add({ title: 'تم دمج الطلبات', color: 'success' })
      }
    }
  }
  showMergeModal.value = false
  selectedSingle1.value = undefined
  selectedSingle2.value = undefined
}

// Submit
const onSubmit = async () => {
  if (!canSubmit()) {
    toast.add({ title: 'العدد المطلوب من الفرق غير مكتمل', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    const teams = store.submitAcceptedTeams()
    const req = await submitAcceptedTeams(props.tournamentId, teams)
    await req.execute()
    toast.add({ title: 'تم إرسال الفرق المقبولة بنجاح', color: 'success' })
  } catch (e) {
    toast.add({ title: 'فشل إرسال الفرق المقبولة', color: 'error' })
  } finally {
    isSubmitting.value = false
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

// Accepted Singles Table Columns
const singleCols = [
  { accessorKey: 'owner', header: 'المالك' },
  { accessorKey: 'createdAt', header: 'تاريخ الطلب' },
  { id: 'actions', header: '#' }
]

// Accepted Teams Table Columns
const teamCols = [
  { accessorKey: 'teamName', header: 'اسم الفريق' },
  { accessorKey: 'owner', header: 'المالك' },
  { accessorKey: 'teammate', header: 'الزميل' },
  { accessorKey: 'source', header: 'المصدر' },
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
