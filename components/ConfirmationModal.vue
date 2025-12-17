<template>
  <UModal title="تاكيد العملية" description="هل أنت متأكد من أنك تريد إتمام العملية؟" >
    <template #body>
      <div class="h-[100px] flex justify-center items-center ">
        <h2 class="text-xl text-center ">
          {{ message }}
        </h2>
      </div>
    </template>
      <template #footer >
        <div class="flex justify-between items-center w-full">
          <UButton  color="success" label="تأكيد" @click="emit('close',true)"  size="xl"/>
          <UButton color="error" label="الغاء " @click="emit('close',false)"  size="xl"/>

        </div>
      </template>
  </UModal>
</template>

<script lang="ts" setup>

const props= defineProps<{message:string}>()
const emit = defineEmits(['success','close'])

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  console.log(e)
  if (e.key === 'Enter') {
    emit('success')
    emit('close', true)
  }
}


</script>

<style></style>