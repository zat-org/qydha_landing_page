<template>
  <UModal prevent-close title="مسح المستخدم" description="سبتم مسح جميع البيانات الخاصة بك ">


    <template #body>
      <div>
        <UForm :state="state" :schema="schema" ref="form" @submit="onSubmit">
          
          <UFormField name="password" label="كلمة المرور" help="سبتم مسح جميع البيانات الخاصة بك ">
            <UInput v-model="state.password" type="password" />
          </UFormField>
        </UForm>
      </div>
    </template>
    <template #footer>
      <div>
        <UButton color="error" label="حذف" @click="onDelete" />
        <UButton color="primary" label="عودة" @click="emit('close')" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from "yup"
const emit = defineEmits(['close'])
const form = ref<HTMLFormElement>()
const authApi = useAuth()
const state = reactive({ password: "" })
const schema = object({ password: string().required("برجاء ادخال كلمة المرور") })

const onDelete = () => {
  form.value?.submit()
}
const logoutReq = await authApi.logout()
const onSubmit = async () => {
  emit('close')
  await logoutReq.fetchREQ()
  if (logoutReq.status.value == "success") {
    navigateTo('/')
  }
}
</script>

<style></style>