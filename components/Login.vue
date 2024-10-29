<template>

  <UCard :ui="{ base: 'w-[80%] mx-auto mt-[50px]' }">

    <div class="flex justify-center">
      <!-- <img src="/images/qydha_logo.png" class="w-20" /> -->
    </div>
    <UForm :schema="usernameSchema" :state="state" class="space-y-3"
      v-if="state.formState == FormState.waitUsernameInput">
      <UFormGroup name="username" label="يوزر قيدها" hint="مطلوب">
        <UInput :disabled="state.formState !== FormState.waitUsernameInput" dir="ltr" v-model="state.username"
          type="text" icon="i-heroicons-at-symbol-20-solid" placeholder="username" />
        <template #help>
          <span class="text-sm text-gray-500 dark:text-gray-300  flex items-center">
            <UIcon name="i-heroicons-bell-alert-solid" class="text-xl me-2" />
            بيوصلك إشعار على قيدها به رمز الدخول
            <br>
            ( تأكد من تسجيل الدخول بالتطبيق )
          </span>

        </template>
      </UFormGroup>
      <UAlert icon="material-symbols:error-outline" color="red" variant="soft" v-if="loginWithQydha.error.value"
        :description="loginWithQydha.error.value.statusCode==404 ?'this username not exist ':' has erro '" />
      <div class="flex justify-end">
        <UButton v-if="state.formState === FormState.waitUsernameInput" type="submit" @click="onLogInQydha"
          icon="i-heroicons-paper-airplane-16-solid">ارسال الرمز</UButton>
      </div>

    </UForm>



    <UForm :schema="otpSchema" @submit="onConfirm" v-if="state.formState === FormState.waitOtpInput" :state="state"
      class=" my-2 space-y-3">
      <UFormGroup label="رمز الدخول" name="otp" hint="مطلوب">

        <UInput dir="ltr" v-model="state.otp" type="text" icon="i-heroicons-key" placeholder="123456" />
      </UFormGroup>

      <div class="flex justify-between items-center ">

        <UButton type="button" color="red" @click="onReset">
          عودة
        </UButton>
        <UButton type="submit" icon="i-heroicons-paper-airplane-16-solid">
          تسجيل الدخول
        </UButton>
      </div>
    </UForm>

  </UCard>

</template>

<script setup lang="ts">
import { object, string } from 'yup'
const authApi = useAuth()
const loginWithQydha = await authApi.loginWithQydha()
const confirmREQ = await authApi.confirmLoginWithQydha()

const onLogInQydha = async () => {
  await loginWithQydha.fetchREQ(state.username)
  if (loginWithQydha.status.value == 'success' && loginWithQydha.data.value?.data) {
    state.requestId = loginWithQydha.data.value?.data.requestId
    state.formState = FormState.waitOtpInput
  }

}
const onConfirm = async () => {
  await confirmREQ.fetchREQ(state.requestId, state.otp)
  if (confirmREQ.status.value == 'success') {
    // navigate tour nament 
  }
}

enum FormState {
  waitUsernameInput,
  waitOtpInput,
}
const state = reactive<{ username: string, otp: string, requestId: string, formState: FormState }>({
  username: "",
  otp: "",
  requestId: "",
  formState: FormState.waitUsernameInput
})

const usernameSchema = object({
  username: string().trim().required("هذا الحقل مطلوب").min(3, "يجب ان يكون اسم المستخدم 3 حروف او اكثر برجاء تعديل يوزر قيدها والمحاولة مرة اخرى")
});

const otpSchema = object({
  otp: string().trim().required("هذا الحقل مطلوب").length(6, "برجاء ادخال رمز صحيح"),
})
const onReset = () => {
  state.username = ""
  state.otp = ""
  state.requestId = ""
  state.formState = FormState.waitUsernameInput
}

</script>

<style scoped></style>