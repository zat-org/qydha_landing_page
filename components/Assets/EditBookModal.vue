<template>
  <UModal prevent-close title="تعديل الكتاب" description="تعديل الكتاب">

 <template #body>
      <UForm :state="state" :scheam="schema" ref="BookForm" @submit="onSubmit">
        <UFormField label="book" name="file">
          <UInput type="file" v-model="state.file" ref="fileInput" @change="fileChanged" accept="application/pdf" />
        </UFormField>

      </UForm>
    </template>
      <template #footer>
        <div class="flex justify-between items-center ">

          <UButton label="حفظ" color="primary" @click="BookForm?.submit()" :loading="updateREQ.status.value=='pending'"/>
          <UButton label="اغلاق" color="error" @click="emit('close')" />
        </div>

      </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'
const emit = defineEmits(['close'])
const toast = useToast()
const updateREQ = await useAssets().updateBook()
const BookForm = ref<HTMLFormElement>()
const fileInput = ref()
const new_file = ref<File>()

const state = reactive
  <{ file: string }>
  ({
    file: ""
  })

const schema = object({
  file: string()
})

const fileChanged = (event: Event) => {
  const _new_file = (event.target as HTMLInputElement).files?.item(0)
  if (_new_file) {
    new_file.value = _new_file
  }
}
const onSubmit = async () => {
  if (new_file.value) {
    await updateREQ.fetchREQ(new_file.value)
    if (updateREQ.status.value == 'success') {
      toast.add({ title: 'update  done' })
      refreshNuxtData("getBook")
      emit('close')
    } else if (updateREQ.status.value == 'error') {
      toast.add({ title: 'error happend ' })

    }
  }
  else {
    emit('close')
  }


}

</script>

<style></style>