<template>
  <UModal prevent-close>
    <UCard :ui="{ base: 'flex flex-col ', body: { base: 'grow' } }">
      <template #header>
        <h2 class="text-3xl">{{ serviceAccount.name }} </h2>
      </template>
      <div class="flex flex-col gap-2">
        <h3 class="text-xl ">
          {{ serviceAccount.description }}
        </h3>
        <div class="flex flex-wrap ">
          <UBadge color="gray" v-for=" permission of serviceAccount.permissions" class="m-1">
            {{ permission }}
          </UBadge>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between items-center ">
          <UButton label="close" color="red" @click="emit('close')" />
          <UButton label="copy token " color="green" @click="copyToken" />
        </div>

      </template>
    </UCard>
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