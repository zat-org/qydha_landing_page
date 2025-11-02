<template>
 
  <div class="w-full mx-auto p-4 flex flex-col flex-1 "  >
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center h-64">
      <Loading />
      <!-- <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-primary-500" /> -->
    </div>

    <!-- Error State -->
    <UAlert v-else-if="status === 'error'" color="error" variant="soft" icon="i-heroicons-exclamation-triangle">
      <template #title>خطأ في تحميل البيانات</template>
      <template #description>حدث خطأ أثناء تحميل بيانات طلب البطولة</template>
    </UAlert>

    <!-- Tournament Request Card -->
    <UCard v-else-if="data"  :ui="{root:'flex flex-col max-h-[calc(100vh-100px)] ',body:'flex-1 overflow-y-auto'}">
      <!-- Header -->
      <template #header>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

            
          <div class="flex items-center gap-4">
            <UButton 
              to="/tournament/request"
              icon="i-heroicons-arrow-left"
              variant="ghost"
              size="sm"
              class="mr-2 flex-shrink-0"
            >
              العودة
            </UButton>
            <UAvatar 
              size="3xl" 
              :src="data.logoUrl" 
              :text="data.title[0]" 
              class="ring-2 ring-primary-200 dark:ring-primary-800"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.title }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDateTime(data.createdAt) }}
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-2">
            <UBadge 
              v-if="currentState"
              :color="getStateColor(currentState)" 
              variant="subtle" 
              size="lg"
              class="text-sm font-medium"
            >
              {{ getStateLabel().find(op=>op.value==currentState)?.label }}
            </UBadge>
            <UBadge 
              :color="data.type === 'Public' ? 'info' : 'success'" 
              variant="outline" 
              size="xl"
              class="text-sm font-medium"
            >
              {{ data.type === 'Public' ? 'عامة' : 'خاصة' }}
            </UBadge>
          </div>
        </div>
      </template>

      <!-- Body -->
      <div class="space-y-6">
        <!-- Description -->
        <div v-if="data.description">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">الوصف</h3>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ data.description }}</p>
        </div>

        <!-- Tournament Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">معلومات البطولة</h3>
            
            <div class="space-y-1.5">
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ البداية</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 truncate">{{ formatDate(data.startAt) }}</span>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ النهاية</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 truncate">{{ formatDate(data.endAt) }}</span>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">عدد الفرق</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ data.teamsCount }}</span>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">عدد الطاولات</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ data.tablesCount }}</span>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">إضافة اللاعبين من قيدها</span>
                <div>
                  <UBadge :color="data.isAddPlayersByQydha ? 'success' : 'error'" variant="subtle" size="lg">
                    {{ data.isAddPlayersByQydha ? 'نعم' : 'لا' }}
                  </UBadge>
                </div>
              </div>
              <template v-if="data.isAddPlayersByQydha">
                <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700" v-if="data.joinRequestStartAt">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">بداية استقبال طلبات الانضمام</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(data.joinRequestStartAt) }}</span>
                </div>
                <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700" v-if="data.joinRequestEndAt">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">نهاية استقبال طلبات الانضمام</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(data.joinRequestEndAt) }}</span>
                </div>
                <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700" v-if="data.joinRequestMaxCount">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">الحد الأقصى لطلبات الانضمام</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ data.joinRequestMaxCount }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Contact & Location -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">معلومات التواصل والموقع</h3>
            
            <div class="space-y-1.5">
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الهاتف</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-900 dark:text-gray-100" dir="ltr">{{ data.contactPhone }}</span>
                  <div class="flex gap-1">
                    <UBadge v-if="data.isContactPhoneCall" color="success" variant="subtle" size="lg">مكالمة</UBadge>
                    <UBadge v-if="data.isContactPhoneWhatsapp" color="success" variant="subtle" size="lg">واتساب</UBadge>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-start py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">وصف الموقع</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 text-right">{{ data.locationDescription }}</span>
              </div>
              
              <div class="grid grid-cols-[auto_1fr] gap-x-4 items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">الإحداثيات</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <UButton
                    variant="soft"
                    color="primary"
                    size="xs"
                    icon="i-heroicons-map"
                    class="ml-2"
                    target="blank"
                    :to="'https://www.google.com/maps?q='+data.location.latitude+','+data.location.longitude"
                  >
                    عرض على الخريطة
                  </UButton>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sponsors -->
        <div v-if="data.sponsorsUrls && data.sponsorsUrls.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">الرعاة</h3>
          <div class="flex gap-4">
            <div v-for="(sponsor, index) in data.sponsorsUrls" :key="index" class="relative">
              <img 
                :src="sponsor" 
                :alt="`راعي ${index + 1}`"
                class="w-fit h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        <!-- Prizes -->
        <div v-if="data.prizes && data.prizes.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">الجوائز</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard v-for="(prize, index) in data.prizes" :key="index" class="p-4">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900 dark:text-gray-100">المركز {{ getPrizePosition(prize.type) }}</span>
                  <div class="flex gap-2">
                    <UBadge v-if="prize.isFinancial" color="success" variant="subtle" size="lg">مالية</UBadge>
                    <UBadge v-if="prize.isNonFinancial" color="info" variant="subtle" size="lg">غير مالية</UBadge>
                  </div>
                </div>
                
                <div v-if="prize.isFinancial && prize.financialPrizeAmount > 0" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ prize.financialPrizeAmount }} {{ getCurrencyLabel(prize.financialPrizeCurrency) }}
                </div>
                
                <div v-if="prize.isNonFinancial && prize.nonFinancialPrizes.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
                  <div v-for="nonFinancialPrize in prize.nonFinancialPrizes" :key="nonFinancialPrize" class="mb-1">
                    • {{ nonFinancialPrize }}
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Rules -->
        <div v-if="data.rules && data.rules.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">قوانين البطولة</h3>
          <div class="space-y-2">
            <div v-for="(rule, index) in data.rules" :key="index" class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="text-primary-600 dark:text-primary-400 font-bold text-sm">{{ index + 1 }}.</span>
              <span class="text-gray-700 dark:text-gray-300 text-sm">{{ rule }}</span>
            </div>
          </div>
        </div>

        <!-- Approval Info -->
        <div v-if="data.approvedByUserName" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">معلومات الموافقة</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">تم الموافقة بواسطة</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ data.approvedByUserName }}</span>
            </div>
            <div v-if="data.approvedAt" class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ الموافقة</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(data.approvedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span>تم الإنشاء في: {{ formatDateTime(data.createdAt) }}</span>
          </div>
          
          <UButtonGroup v-if="(userStore.isStaffAdmin || userStore.isSuperAdmin ) && currentState === TournamentRequestState.Pending">
            <UButton 
              color="success" 
              icon="i-heroicons-check"
              @click="handleApprove"
              :loading="approveStatus =='pending'"
            >
              موافقة
            </UButton>
            <UButton 
              color="error" 
              icon="i-heroicons-x-mark"
              @click="handleReject"
              :loading="rejectStatus=='pending'"
            >
              رفض
            </UButton>
            <UButton 
              color="primary" 
              icon="i-heroicons-pencil"
              variant="outline"
              @click="handleEdit"
            >
              تعديل
            </UButton>
          </UButtonGroup>
          <UButtonGroup v-if="userStore.isOrganizer && currentState === TournamentRequestState.Pending">
            <UButton 
              color="error" 
              icon="i-lucide-circle-x"
              @click="handleCancel"
              :loading="approveStatus =='pending'"
            >
              الغاء
            </UButton>
            
            <UButton 
              color="primary" 
              icon="i-heroicons-pencil"
              variant="outline"
              @click="handleEdit"
            >
              تعديل
            </UButton>
          </UButtonGroup>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from '~/store/Auth';
import { TournamentPrizeType, TournamentPrizeCurrency  } from '~/models/tournamentPrize';
import { TournamentRequestState } from '~/models/tournamentRequest';
import {formatDateTime,formatDate} from'~/utils/formatDate'

const props = defineProps<{id:string}>()
const { 
  AdminGetSingleTournamentRequest, 
  OrganizerGetSingleTournamentRequest,
  OrganizerCancelRequest,
  AdminApproveRequest, 
  AdminRejectRequest,
  getTournamnetStateOptions:getStateLabel,
  getStateColor,
  getTournamentPrizeCurrency
} = useTournamentRequest()

const userStore = useMyAuthStore()
const apiFetch = computed(()=>{
  if(userStore.isStaffAdmin || userStore.isSuperAdmin){
    return AdminGetSingleTournamentRequest
  }else {
    return OrganizerGetSingleTournamentRequest
  }
})
const { data:res, status, pending } = apiFetch.value(props.id)
const data =computed(()=>{
    if(res.value?.data) return res.value.data
})
const currentState = computed(()=>{
  if(!data.value) return undefined
  // prefer new status if backend provides it, else fallback to state
  // @ts-ignore
  return (data.value.status ?? data.value.state) as TournamentRequestState
})
// Approval/Rejection handlers
const { fetchREQ: approveRequest, status: approveStatus } = AdminApproveRequest()
const { fetchREQ: rejectRequest, status: rejectStatus } = AdminRejectRequest()
const { fetchREQ: cancelRequest, status: cancelStatus } = OrganizerCancelRequest()


const handleApprove = async () => {
  if(!data.value)return 
  await approveRequest(data.value.id)
  if (status.value === 'success') {
    // Refresh data or show success message
    await refreshNuxtData(`AdminGetSingleTournamentRequest-${data.value.id}`)
  }
}

const handleReject = async () => {
  if(!data.value)return 
  await rejectRequest(data.value.id)
  if (status.value === 'success' ) {
    // Refresh data or show success message
    await refreshNuxtData(`AdminGetSingleTournamentRequest-${data.value.id}`)
  }
}
const handleCancel = async () => {
  if(!data.value)return 
  await cancelRequest(data.value.id)
  if (status.value === 'success' ) {
    // Refresh data or show success message
    await refreshNuxtData(`OrganizerGetSingleTournamentRequest-${data.value.id}`)
    await refreshNuxtData(`AdminGetSingleTournamentRequest-${data.value.id}`)

  }
}


const handleEdit = () => {
  // Navigate to edit page or open modal
  navigateTo(`/tournament/request/${props.id}/update/`)
}



// const getStateLabel = (state: TournamentRequestState) => {
//   const stateLabels: Record<TournamentState, string> = {
//     [TournamentState.Pending]: "جاري المراجعة",
//     [TournamentState.Approved]: "تم الموافقة",
//     [TournamentState.Rejected]: "تم الرفض",
//     [TournamentState.Canceled]: "تم الإلغاء",
//   }
//   return stateLabels[state]
// }



const getPrizePosition = (type: TournamentPrizeType) => {
  const positions: Record<TournamentPrizeType, string> = {
    [TournamentPrizeType.one]: "الأول",
    [TournamentPrizeType.two]: "الثاني",
    [TournamentPrizeType.three]: "الثالث",
    [TournamentPrizeType.four]: "الرابع",
  }
  return positions[type]
}

const getCurrencyLabel = (currency: TournamentPrizeCurrency) => {
  const currencyLabels: Record<TournamentPrizeCurrency, string> = {
    [TournamentPrizeCurrency.USD]: 'دولار أمريكي (USD)',
    [TournamentPrizeCurrency.EGP]: "جنيه مصري (EGP)",
    [TournamentPrizeCurrency.SAR]: 'ريال سعودي (SAR)',
    [TournamentPrizeCurrency.AED]: 'درهم إماراتي (AED)',
    [TournamentPrizeCurrency.EUR]: 'يورو (EUR)',
    [TournamentPrizeCurrency.JOD]: 'دينار أردني (JOD)',
    [TournamentPrizeCurrency.KWD]: 'دينار كويتي (KWD)',
    [TournamentPrizeCurrency.TRY]: 'ليرة تركية (TRY)',
    [TournamentPrizeCurrency.GBP]: 'جنيه إسترليني (GBP)'
  }
  return currencyLabels[currency]
}
</script>

<style scoped></style>