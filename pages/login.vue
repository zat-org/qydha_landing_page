<template>
  <div class="mx-auto w-1/2 mt-[100px]">
    <UForm :state="state" :schema="schema" class="flex flex-col gap-10" @submit="loginClick">
      <UFormGroup label="اسم المستخدم " name="username" size="xl">
        <UInput v-model="state.username" color="blue" />
      </UFormGroup>

      <UFormGroup label="كلمة المرور" name="password" size="xl">
        <UInput v-model="state.password" type="password" color="blue" />
      </UFormGroup>


      <UButton type="submit" block class="w-1/2  mx-auto " size="xl" color="blue">
        تسجيل الدخول
      </UButton>

        
      <UAlert v-if="login.error && login.status.value =='error'"
    icon="material-symbols:error"
    color="red"
    variant="subtle"
    description="اسم المستخدم او كلمة المرور غير صحيحة"
  />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { object, string, } from 'yup'
const schema = object({
  username: string().required(" برجاء ادخال  اسم المستخدم"),
  password: string().required("  برجاء ادخال كلمة المرور ")
})
const state = reactive({ username: "", password: "" })
const authApi=useAuth() 
const login  =await authApi.login()
const loginClick =async()=>{
 await login.fetchREQ(state)
}
</script>

<style></style>