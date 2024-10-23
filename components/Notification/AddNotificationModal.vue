<template>
  <UModal prevent-close>
    <UCard>

      <UTabs :items="tabItems" @change="onChange">
        <template #notification>
          <NotificationForm ref="notForm" />
        </template>

        <template #popup>
          <NotificationPopupForm ref="popForm" />
        </template>
      </UTabs>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="close" color="red" @click="modal.close()" />
          <UButton label="add" color="green" @click="onAdd" />
        </div>

      </template>
    </UCard>

  </UModal>
</template>

<script lang="ts" setup>

const notForm = ref()
const popForm = ref()
const index = ref(0)
const modal = useModal()

const tabItems = [{ slot: 'notification', label: 'اشعار' }, { slot: 'popup', label: ' اشعار المنبثق' }]

const onAdd = () => {
  if (index.value==0){
    notForm.value?.AddNotificatoion()
  }else if (index.value==1){
    popForm.value.AddNotificatoion()
  }

}
const onChange = (_index: number) => {
  index.value = _index
}
</script>

<style></style>