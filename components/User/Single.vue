<template>
  <UCard>
    <div class="flex flex-col gap-6">
      <!-- Profile Header -->
      <div class="flex flex-col items-center gap-4 p-4">
        <div class="relative w-[150px] h-[150px] rounded-full overflow-hidden shadow-lg">
          <img 
            v-if="userData?.user.avatarUrl" 
            class="w-full h-full object-cover"
            :src="userData?.user.avatarUrl" 
          />
          <UIcon 
            v-else 
            name="i-heroicons-user-circle" 
            class="w-full h-full text-primary-500 dark:text-primary-400" 
          />
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-bold mb-2">{{ userData?.user.username }}</h2>
          <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
            <UIcon name="i-heroicons-phone" class="text-xl" />
            <span dir="ltr">{{ userData?.user.phone }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <USelect
            :popper="{ placement: 'bottom' }" 
            value-attribute="value" 
            option-attribute="value"
            v-if="userStore.user?.user.roles.includes('SuperAdmin')||userStore.user?.user.roles.includes('StaffAdmin')"
            v-model="roles" 
            multiple 
            :items="rolesOption"
            class="w-full"

          />
          <div v-else class="flex flex-wrap justify-center gap-2">
            <UBadge
              v-for="role in userData?.user.roles"
              :key="role"
              :color="getRoleColor(role)"
              variant="soft"
            >
              {{ role }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="w-full">
        <UTabs 
          :items="tabsItems" 
          dir="rtl" 
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <template #promo>
            <div class="overflow-x-auto">
              <UTable :data="userData?.promoCodes" :columns="promocols" hover />
            </div>
          </template>
          <template #purchase>
            <div class="overflow-x-auto">
              <UTable :data="userData?.purchases" :columns="purchaseCols" hover />
            </div>
          </template>
          <template #influncer>
            <div class="overflow-x-auto">
              <UTable :data="userData?.influencerCodes" :columns="influncerCols" hover>
                <template #category-cell="{row}">
                  <p>{{ row.original.categoryName }}</p>
                </template>
              </UTable>
            </div>
          </template>
        </UTabs>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between p-4">
        <UButton 
          color="error" 
          variant="soft"
          icon="i-heroicons-arrow-left"
          @click="router.back()"
        >
          عودة
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const router = useRouter()
const props = defineProps<{ id: string }>()
const userApi = useUsers()
const getREQ = await userApi.getSingleUser()
const updateREQ = await userApi.updateUser()
const toast = useToast()
const userStore = useMyAuthStore()

await getREQ.fetchREQ(props.id)
if (getREQ.status.value == "error") {
  navigateTo('/user')
}

const userData = computed(() => {
  return getREQ.data.value?.data
})

const roles = ref<string[]>(userData.value?.user.roles!)

const rolesOption = [
  { label: 'ادمن', value: 'SuperAdmin', disabled: true },
  { label: 'استف', value: 'StaffAdmin', disabled: false },
  { label: 'استريمر', value: 'Streamer', disabled: false },
  { label: 'مستخدم ', value: 'User', disabled: true },
]

const getRoleColor = (role: string): 'error' | 'success' | 'primary' | 'secondary' | 'warning' | 'neutral' => {
  switch(role) {
    case 'SuperAdmin': return 'primary'
    case 'StaffAdmin': return 'success'
    case 'Streamer': return 'warning'
    default: return 'neutral'
  }
}

watch(roles, async (newValue, oldValue) => {
  await updateREQ.fetchREQ(userData.value?.user.id!, newValue)
  if (updateREQ.status.value == "success") {
    toast.add({ 
      title: "تم تحديث الصلاحيات بنجاح",
      color: 'success'
    })
  }
})

const tabsItems = [
  { slot: 'promo', label: 'الاكواد' },
  { slot: 'purchase', label: 'المشتريات' },
  { slot: 'influncer', label: 'اكواد المؤثريين' },
]

const promocols = [
  { accessorKey: 'code', header: 'الاسم ' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'usedAt', header: 'استخدم في ' ,
  cell: ({row}:{row:any}) => {
    return row.original!.usedAt ? new Date(row.original.usedAt).toLocaleDateString() : 'لم يستخدم'
  }
  },
]

const purchaseCols = [
  { accessorKey: 'type', header: 'النوع' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'purchaseDate', header: 'تاريخ الشراء',
    cell: ({row}:{row:any}) => {
    return row.original!.purchaseDate ? new Date(row.original.purchaseDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'لم يشتري'
  }
   },

]

const influncerCols = [
  { accessorKey: 'influencerCodeName', header: 'الكود' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'category.name', header: ' النوع' },
  { accessorKey: 'usedAt', header: 'استخدم في' ,
  cell: ({row}:{row:any}) => {
    return row.original!.usedAt ? new Date(row.original.usedAt).toLocaleDateString() : 'لم يستخدم'
  }
  },

]
</script>

<style></style>