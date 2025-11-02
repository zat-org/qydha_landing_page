<template>
<UCard>
  <template #header>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold"> ملف المنظم</h2>
      <!-- <UButton 
          color="primary"
          variant="solid"
          icon="i-heroicons-user"
          :to="`/user/${userData?.id}`"
        >
          الملف الشخصي
        </UButton> -->
        </div>
  </template>
  <div class="bg-gray-50 dark:bg-gray-900 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <UButton 
          color="neutral" 
          variant="ghost"
          icon="i-heroicons-arrow-right"
          @click="$router.back()"
          class="mb-4"
        >
          العودة
        </UButton>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          ملف المنظم
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          معلومات تفصيلية عن المنظم والفعاليات التي قام بتنظيمها
        </p>
      </div>

      <!-- Tabs Content -->
      <UTabs 
        :items="tabItems" 
        v-model="currentTab"
        value-attribute="key"
        dir="rtl" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        <!-- Organization Profile Tab -->
        <template #profile>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserOrganizerProfile :organization-data="organizationData" />
            <UserOrganizerContact 
              :contact-phone="organizationData.qydhaContactPhone"
              :email="userData?.email"
              :last-login="userData?.lastLogin"
            />
          </div>
        </template>

        <!-- Documents Tab -->
        <template #documents>
          <UserOrganizerDocuments 
            :documents="organizationData.legalDocuments"
            @view-document="viewDocument"
          />
        </template>

        <!-- Tournaments Tab -->
        <template #tournaments>
          <UserOrganizerTournaments :tournaments="organizationData.tournaments" />
        </template>

        <!-- Statistics Tab -->
        <template #stats>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UserOrganizerStats :stats="stats" />
            
            <!-- Additional Stats Cards -->
            <UCard class="md:col-span-1 lg:col-span-3">
              <template #header>
                <h3 class="text-lg font-semibold">إحصائيات تفصيلية</h3>
              </template>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {{ stats.totalParticipants }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    إجمالي المشاركين
                  </div>
                </div>
                
                <div class="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ ((stats.completedTournaments / organizationData.tournamentsCount) * 100).toFixed(0) }}%
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    معدل إتمام البطولات
                  </div>
                </div>
                
                <div class="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {{ Math.round(stats.totalParticipants / organizationData.tournamentsCount) }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    متوسط المشاركين لكل بطولة
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </template>

        <!-- Actions Tab -->
        <template #actions>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserOrganizerActions 
              :can-edit="canEdit"
              @contact-organizer="contactOrganizer"
              @generate-report="generateReport"
              @edit-organizer="editOrganizer"
            />
            
            <!-- Quick Info Card -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">معلومات سريعة</h3>
              </template>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">حالة المنظم</span>
                  <UBadge color="success" variant="soft">نشط</UBadge>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">تاريخ التسجيل</span>
                  <span class="text-sm font-medium">{{ formatDate(organizationData.registrationDate) }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">الوثائق المعتمدة</span>
                  <span class="text-sm font-medium">
                    {{ organizationData.legalDocuments.filter(d => d.verified).length }} / {{ organizationData.legalDocuments.length }}
                  </span>
                </div>
              </div>
            </UCard>

            <!-- Performance Card -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">الأداء</h3>
              </template>
              
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>التقييم العام</span>
                    <span>{{ stats.averageRating }}/5</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${(stats.averageRating / 5) * 100}%` }"
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>البطولات المكتملة</span>
                    <span>{{ stats.completedTournaments }}/{{ organizationData.tournamentsCount }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${(stats.completedTournaments / organizationData.tournamentsCount) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </div>

    <!-- Document Viewer Modal -->
    <UserOrganizerDocumentModal 
      v-model:is-open="showDocumentModal"
      :selected-document="selectedDocument"
    />
  </div>
</UCard>
</template> 

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth'
import {formatDate} from '~/utils/formatDate' 
// Props
const props = defineProps<{
  id?: string
}>()

// Store
const authStore = useMyAuthStore()
const { hasRole } = usePermissions()

// Router
const route = useRoute()
const router = useRouter()

// Reactive data
const showDocumentModal = ref(false)
const selectedDocument = ref<any>(null)

// Tab items
const tabItems = [
  { 
    slot: 'profile',
    key: 'profile',
    label: 'الملف الشخصي',
    icon: 'i-heroicons-building-office'
  },
  { 
    slot: 'documents',
    key: 'documents', 
    label: 'الوثائق القانونية',
    icon: 'i-heroicons-document-text'
  },
  { 
    slot: 'tournaments',
    key: 'tournaments',
    label: 'البطولات',
    icon: 'i-heroicons-trophy'
  },
  { 
    slot: 'stats',
    key: 'stats',
    label: 'الإحصائيات',
    icon: 'i-heroicons-chart-bar'
  },
  { 
    slot: 'actions',
    key: 'actions',
    label: 'الإجراءات',
    icon: 'i-heroicons-cog-6-tooth'
  }
]

// Get valid tab slots for validation

// Initialize current tab from URL or default to 'profile'
const getInitialTab = () => {
  const urlTab = route.query.tab as string  
  return urlTab  ? urlTab : '0'
}

// Current tab state
const currentTab = ref(getInitialTab())

// Watch for tab changes and update URL
watch(currentTab, (newTab) => {
  if (newTab !== route.query.tab) {
    router.replace({
      query: { ...route.query, tab: newTab }
    })
  }
})

// Watch for URL changes and update tab
watch(() => route.query.tab, (newTab) => {
  const tabValue = newTab as string
  if (tabValue && tabValue !== currentTab.value) {
    currentTab.value = tabValue
  } else if (!newTab && currentTab.value !== '0') {
    currentTab.value = '0'
  }
})

// Set initial URL if no tab query parameter exists
onMounted(() => {
  if (!route.query.tab) {
    router.replace({
      query: { ...route.query, tab: '0' }
    })
  }
})

// Fetch user data
const userApi = useUsers()
const getUserReq = await userApi.getSingleUser()
await getUserReq.fetchREQ(props.id || '')

const userData = computed(() => {
  return getUserReq.data.value?.data?.user
})

// Mock organization data - in real app, this would come from API
const organizationData = ref({
  organizationName: 'شركة الفعاليات الرياضية المحدودة',
  commercialRegistration: '1234567890',
  location: 'الرياض، حي العليا، طريق الملك فهد، مبنى الأعمال التجارية، الطابق الخامس',
  qydhaContactPhone: '+966501234567',
  tournamentsCount: 12,
  registrationDate: '2023-01-15T00:00:00Z',
  legalDocuments: [
    {
      id: '1',
      name: 'السجل التجاري',
      description: 'صورة من السجل التجاري للشركة',
      verified: true,
      uploadDate: '2023-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'ترخيص النشاط',
      description: 'ترخيص مزاولة نشاط تنظيم الفعاليات',
      verified: true,
      uploadDate: '2023-01-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'شهادة التأمين',
      description: 'شهادة التأمين على الفعاليات والمشاركين',
      verified: false,
      uploadDate: '2023-12-01T00:00:00Z'
    }
  ],
  tournaments: [
    {
      id: '1',
      name: 'بطولة الرياض الكبرى للبلوت',
      description: 'بطولة بلوت تنافسية لأفضل اللاعبين في المملكة',
      city: 'الرياض',
      startAt: '2024-02-01T00:00:00Z',
      endAt: '2024-02-03T00:00:00Z',
      status: 'completed'
    },
    {
      id: '2',
      name: 'دوري جدة الشتوي',
      description: 'دوري بلوت موسمي في مدينة جدة',
      city: 'جدة',
      startAt: '2024-01-15T00:00:00Z',
      endAt: '2024-03-15T00:00:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'كأس الدمام للناشئين',
      description: 'بطولة خاصة للاعبين الناشئين تحت 18 سنة',
      city: 'الدمام',
      startAt: '2024-03-01T00:00:00Z',
      endAt: '2024-03-03T00:00:00Z',
      status: 'upcoming'
    }
  ]
})

// Stats computation
const stats = computed(() => {
  const tournaments = organizationData.value.tournaments
  return {
    completedTournaments: tournaments.filter(t => t.status === 'completed').length,
    activeTournaments: tournaments.filter(t => t.status === 'active').length,
    totalParticipants: 245, // Mock data
    averageRating: 4.8 // Mock data
  }
})

// Permissions
const canEdit = computed(() => {
  return hasRole(['SuperAdmin', 'StaffAdmin']) || authStore.user?.user.id === props.id
})

// Methods
// const formatDate = (dateString: string | undefined) => {
//   if (!dateString) return 'غير محدد'
//   return new Date(dateString).toLocaleDateString('ar-SA', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   })
// }

const viewDocument = (document: any) => {
  selectedDocument.value = document
  showDocumentModal.value = true
}

const contactOrganizer = () => {
  // In real app, this would open a contact modal or redirect to messaging
  console.log('Contacting organizer...')
}

const generateReport = () => {
  // In real app, this would generate and download a detailed report
  console.log('Generating report...')
}

const editOrganizer = () => {
  // In real app, this would open an edit modal
  console.log('Editing organizer...')
}

// Meta
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
