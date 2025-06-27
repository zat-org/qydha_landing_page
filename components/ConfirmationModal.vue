<template>
  <UModal>
    <UCard>
      <div class="h-[100px] flex justify-center items-center ">
        <h2 class="text-xl text-center ">
          {{ message }}
        </h2>
      </div>
      <template #footer >
        <div class="flex justify-between items-center">
          <UButton color="red" label="cancel" @click="emit('close')" />
          <UButton  color="green" label="ok" @click="onSuccess" />

        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>

const props= defineProps<{message:string}>()
const emit = defineEmits(['success','close'])

function onSuccess() {
  emit('success')
}

</script>

<style></style>