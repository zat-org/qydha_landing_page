<template>
  <UModal title="تاكيد العملية" description="هل أنت متأكد من أنك تريد إتمام العملية؟">
    <template #body>
      <div class="h-[100px] flex justify-center items-center ">
        <h2 class="text-xl text-center ">
          {{ message }}
        </h2>
      </div>
    </template>
      <template #footer >
        <div class="flex justify-between items-center">
          <UButton color="error" label="cancel" @click="emit('close')" />
          <UButton  color="success" label="ok" @click="onSuccess" />

        </div>
      </template>
  </UModal>
</template>

<script lang="ts" setup>

const props= defineProps<{message:string}>()
const emit = defineEmits(['success','close'])

function onSuccess() {
  emit('success')
  emit('close')
}

</script>

<style></style>