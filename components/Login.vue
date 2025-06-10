<template>
  <div class="w-full relative flex justify-center items-center px-[var(--spacing-md)] bg-[var(--color-background)] dark:bg-[var(--color-background-secondary)]">
    <UCard
      class="z-10 w-full max-w-md mx-auto"
      :ui="{
        base: 'bg-[var(--color-background)]/[var(--opacity-background)] dark:bg-[var(--color-background-secondary)]/[var(--opacity-background)] backdrop-blur-sm border border-[var(--color-border)] dark:border-[var(--color-border)]',
        ring: 'ring-1 ring-[var(--color-border)] dark:ring-[var(--color-border)]',
        divide: 'divide-[var(--color-border)] dark:divide-[var(--color-border)]',
        shadow: 'shadow-[var(--shadow-lg)]',
        rounded: 'rounded-[var(--radius-xl)]',
        header: {
          base: 'p-[var(--spacing-lg)]',
          padding: 'py-[var(--spacing-lg)] px-[var(--spacing-lg)]'
        },
        body: {
          base: 'p-[var(--spacing-lg)]',
          padding: 'py-[var(--spacing-lg)] px-[var(--spacing-lg)]'
        },
        footer: {
          base: 'p-[var(--spacing-lg)]',
          padding: 'py-[var(--spacing-lg)] px-[var(--spacing-lg)]'
        }
      }"
    >
      <!-- Rest of the code remains unchanged -->
      <template #header>
        <div class="flex flex-col items-center space-y-[var(--spacing-md)]">
          <img src="@/assets/images/qydha-logo.svg" alt="Qydha" class="w-24 mb-[var(--spacing-md)]" />
          <h2 class="text-2xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
            تسجيل الدخول في قيدها
          </h2>
          <p class="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
            مرحباً بعودتك! سجل دخولك للوصول إلى حسابك
          </p>
        </div>
      </template>

      <UForm
        class="space-y-[var(--spacing-lg)]"
        ref="loginForm"
        :state="state"
        :schema="schema"
        @submit="onSubmit"
      >
        <UFormGroup
          label="اسم المستخدم"
          name="username"
          :ui="{
            label: {
              wrapper: 'flex items-center justify-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]',
              base: 'text-sm font-medium mb-[var(--spacing-sm)]'
            },
          }"
        >
          <UInput
            dir="ltr"
            v-model="state.username"
            :ui="{
              base: 'w-full bg-[var(--color-background)] dark:bg-[var(--color-background-secondary)] border border-[var(--color-border)] dark:border-[var(--color-border)] rounded-[var(--radius-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-light)] focus:border-transparent',
              rounded: 'rounded-[var(--radius-md)]',
            }"
          />
        </UFormGroup>

        <UFormGroup
          label="كلمة المرور"
          name="password"
          :ui="{
            label: {
              wrapper: 'flex items-center justify-center text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]',
              base: 'text-sm font-medium mb-[var(--spacing-sm)]'
            },
          }"
        >
          <UInput
            dir="ltr"
            v-model="state.password"
            type="password"
            :ui="{
              base: 'w-full bg-[var(--color-background)] dark:bg-[var(--color-background-secondary)] border border-[var(--color-border)] dark:border-[var(--color-border)] rounded-[var(--radius-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-light)] focus:border-transparent',
              rounded: 'rounded-[var(--radius-md)]',
            }"
          />
        </UFormGroup>

        <div v-if="errormesage" 
             class="p-[var(--spacing-md)] text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-[var(--radius-md)] text-sm">
          {{ errormesage }}
        </div>

        <UButton
          label="تسجيل الدخول"
          @click="loginForm?.submit()"
          block
          color="amber"
          :loading="loginREQ.status.value=='pending'"
          class="w-full py-[var(--spacing-sm)] text-base font-medium hover-transition"
        />
      </UForm>

      <template #footer>
        <div class="text-center space-y-[var(--spacing-md)]">
          <p class="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
            ليس لديك حساب؟
            <NuxtLink 
              to="/register" 
              class="text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] dark:hover:text-[var(--color-primary)] font-medium hover-transition"
            >
              سجل الآن
            </NuxtLink>
          </p>
          <NuxtLink 
            to="/forgot-password" 
            class="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover-transition"
          >
            نسيت كلمة المرور؟
          </NuxtLink>
        </div>
      </template>
    </UCard>
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
/* Component specific styles */
.card {
  --card-padding: var(--spacing-lg);
}
</style>
