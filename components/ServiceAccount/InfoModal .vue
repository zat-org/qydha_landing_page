<template>
  <UModal prevent-close>
    <template #header>
      <h2 class="text-3xl">{{ serviceAccount.name }} </h2>
    </template>
    <template #body>
      <div class="flex flex-col gap-2">
        <h3 class="text-xl ">
          {{ serviceAccount.description }}
        </h3>
        <div class="flex flex-wrap ">
          <UBadge color="neutral" v-for="permission of serviceAccount.permissions" class="m-1">
            {{ permission }}
          </UBadge>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton label="close" color="error" @click="emit('close')" />
        <UButton label="copy token " color="success" @click="copyToken" />
      </div>

    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { IServiceAccount } from '~/models/serviceAccount';
const emit = defineEmits(['close'])
const toast = useToast()
const props = defineProps<{ serviceAccount: IServiceAccount }>()
const getTokenREQ = await useServiceAccount().getAccountToken()
await getTokenREQ.fetchREQ(props.serviceAccount.id)
const token = computed(() => {
  if (getTokenREQ.data.value) {

    return getTokenREQ.data.value.data.token
  } else {
    console.log('no token || error')
    return null
  }

})
const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(token.value ?? '');
    toast.add({ title: 'token copyied successfuly' })
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
  }
}
</script>

<style></style>