<template>
  <div class="min-h-screen w-full flex justify-center items-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <!-- Header -->
      <div class="p-6 text-center border-b border-gray-200 dark:border-gray-700">
        <img src="@/assets/images/qydha-logo.svg" alt="Qydha" class="w-24 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          تسجيل الدخول في قيدها
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          مرحباً بعودتك! سجل دخولك للوصول إلى حسابك
        </p>
      </div>

      <!-- Form -->
      <div class="p-6">
        <UForm
          class="space-y-6"
          ref="loginForm"
          :state="state"
          :schema="schema"
          @submit="onSubmit"
        >
          <!-- Username Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              اسم المستخدم
            </label>
            <input
              dir="ltr"
              v-model="state.username"
              type="text"
              class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              placeholder="ادخل اسم المستخدم"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              كلمة المرور
            </label>
            <input
              dir="ltr"
              v-model="state.password"
              type="password"
              class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              placeholder="ادخل كلمة المرور"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errormesage" 
               class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm text-center">
            {{ errormesage }}
          </div>

          <!-- Submit Button -->
          <button
            @click="loginForm?.submit()"
            type="button"
            :disabled="loginREQ.status.value === 'pending'"
            class="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loginREQ.status.value === 'pending'">جاري التحميل...</span>
            <span v-else>تسجيل الدخول</span>
          </button>
        </UForm>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 text-center space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ليس لديك حساب؟
          <NuxtLink 
            to="/register" 
            class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-200"
          >
            سجل الآن
          </NuxtLink>
        </p>
        <NuxtLink 
          to="/forgot-password" 
          class="block text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
        >
          نسيت كلمة المرور؟
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
const authApi = useAuth();
const loginREQ = await authApi.login();
const loginForm = ref<HTMLFormElement>();
const state = reactive<{ username: string; password: string }>({
  username: "",
  password: "",
});
const schema = object({
  username: string().required("اسم المستخدم مطلوب"),
  password: string().required("كلمة المرور مطلوبة"),
});
const onSubmit = async () => {
   await loginREQ.fetchREQ(state);
};
const errormesage = computed(() => {
  if(loginREQ.error.value?.data) {
    if(loginREQ.error.value.data.code == "InvalidCredentials") {
      return "اسم المستخدم او كلمة المرور غير صحيح"
    }
  }
  return null;
});
</script>

<style scoped>
/* Ensure no CSS conflicts */
</style>
