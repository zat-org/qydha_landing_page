<template>
 <UModal prevent-close>
  <UCard>
    <template #header>
    <p>مسح المستخدم</p>
    </template>
    <div>
      <UForm :state="state" :schema="schema" ref="form" @submit="onSubmit" >
      <UFormGroup  name="password" label ="كلمة المرور"  help="سبتم مسح جميع البيانات الخاصة بك ">
        <UInput v-model="state.password"  type="password"/>
      </UFormGroup>
      </UForm>
    </div>
    <template #footer>
      <div>
        <UButton  color="red"   label="حذف"   @click="onDelete"/>
        <UButton  color="green" label="عودة" @click="modal.close()"/> 
      </div>
    </template>
  </UCard>
 </UModal>
</template>

<script lang="ts" setup>
import {object ,string} from "yup"
const modal=useModal()
const form =ref<HTMLFormElement>()
const authApi = useAuth()
const state = reactive({password:""})
const schema = object({password:string().required("برجاء ادخال كلمة المرور")})

const onDelete = ()=>{
  form.value?.submit()
}
const logoutReq = await authApi.logout() 
const onSubmit =async()=>{
  console.log("submited")
  modal.close()
  await logoutReq.fetchREQ()
  if (logoutReq.status.value =="success"){
    return navigateTo('/')
  }
}
</script>

<style>

</style>