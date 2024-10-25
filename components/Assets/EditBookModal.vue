<template>
  <UModal prevent-close>
        <UCard>
      <template #header>
          update book 
      </template>
      <UForm :state="state" :scheam="schema" ref="BookForm" @submit="onSubmit">
        <UFormGroup label="book" name="file">
          <UInput type="file" v-model="state.file" ref="fileInput" @change="fileChanged" accept="application/pdf" />
        </UFormGroup>

      </UForm>
      <template #footer>
        <div class="flex justify-between items-center ">

          <UButton label="save" color="green" @click="BookForm?.submit()" :loading="updateREQ.status.value=='pending'"/>
          <UButton label="back" color="red" @click="modal.close()" />
        </div>

      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'
const modal = useModal()
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

const fileChanged = (event: FileList) => {
  const _new_file = event.item(0)
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
      modal.close()
    } else if (updateREQ.status.value == 'error') {
      toast.add({ title: 'error happend ' })

    }
  }
  else {
    modal.close()
  }


}

</script>

<style></style>