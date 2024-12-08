<template>
  <div class="w-full  relative flex justify-center ">
    <div
      class="absolute z-0 inset-0 bg-no-repeat bg-cover bg-center bg-gradient-to-r from-blue-500 to-violet-500 blur-2xl opacity-35"
    ></div>

    <UCard
      class="z-10 bg-white/35 p-5"
      :ui="{
        base: 'w-[80%] mx-auto mt-20  ',
        ring: '',
        divide: 'divide-none',
        shadow: '',
      }"
    >
    <template #header >
      <div class="flex justify-center ">
        <h2 class="text-3xl " >
          تسجيل الدخول في قيدها
        </h2>
      </div>
    </template>
      <UForm
        class="w-[80%] mx-auto space-y-4"
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
              wrapper: 'flex content-center items-center justify-center  ',
            },
          }"
        >
          <UInput
          dir="ltr"
            v-model="state.username"
            variant="none"
            :ui="{
              base: 'border-b border-gray-500  text-center ',
              rounded: '',
            }"
          />
        </UFormGroup>
        <UFormGroup
          label="كلمة المرور"
          name="password"
          :ui="{
            label: {
              wrapper: 'flex content-center items-center justify-center  ',
            },
          }"
        >
          <UInput
          dir="ltr"
            v-model="state.password"
            type="password"
            variant="none"
            :ui="{
              base: 'border-b border-gray-500  text-center ',
              rounded: '',
            }"
          />
        </UFormGroup>
      </UForm>
      <div v-if="errormesage" class="p-2 w-[80%] mx-auto text-center bg-red-500/5 text-red-500 border border-red-500 mt-5 rounded-xl text-sm " >{{ errormesage }}</div>
      <template #footer>
        <UButton
          label="تسيجل الدخول "
          @click="loginForm?.submit()"
          block
          class="w-[40%] mx-auto"
          :loading="loginREQ.status.value=='pending'"
        />
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
const  errormesage  =computed(()=>{
  if(loginREQ.error.value?.data){
    if(loginREQ.error.value.data.code == "InvalidCredentials"){
      return "اسم المستخدم او كلمة المرور غير صحيح "
    }
  }else{
    return null
  }
})
</script>

<style scoped></style>
