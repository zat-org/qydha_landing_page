<template>
  <UCard class="max-w-2xl mx-auto my-8 p-6">
    <template #header>
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 class="text-2xl font-bold text-red-600 dark:text-red-400">حذف المستخدم</h2>
        <div class="flex gap-2 w-full sm:w-auto">
          <UButton
            color="primary"
            size="lg" 
            to="/me"
            icon="mdi:arrow-left"
            class="w-full sm:w-auto transition-colors duration-200"
          >
            عودة
          </UButton>
          <UButton 
            color="error" 
            size="lg"
            icon="mdi:delete" 
            @click="openDeleteModal"
            class="w-full sm:w-auto transition-colors duration-200 hover:bg-red-700"
          >
            مسح المستخدم
          </UButton>
        </div>
      </div>
    </template>

    <div class="mt-6 space-y-6">
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400 text-lg">الاسم:</span>
            <span class="text-xl font-medium">{{ user?.user.username }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400 text-lg">الهاتف:</span>
            <span class="text-xl font-medium">{{ user?.user.phone }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400 text-lg">الفئة:</span>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="role in user?.user.roles"
                :key="role"
                color="warning"
                variant="subtle"
                class="text-base"
              >
                {{ role }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-6">
        <p class="text-red-600 dark:text-red-400 text-sm">
          تحذير: سيؤدي حذف حسابك إلى إزالة جميع بياناتك بشكل دائم. هذا الإجراء لا يمكن التراجع عنه.
        </p>
      </div>
    </div>

  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';
import UserDeleteModal from './Modal.vue';
const userStore = useMyAuthStore()
const { user } = storeToRefs(userStore)
const overlay = useOverlay()
const openDeleteModal = () => {
  overlay.create(UserDeleteModal).open()
}
</script>

<style></style>