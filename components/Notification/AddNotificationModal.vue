<template>
  <UModal prevent-close title="اضافة اشعار" description="اضافة اشعار">
    <template #body>
      <UButtonGroup>
        <UButton v-for="item in tabItems" :key="item.id" :label="item.label" :value="item.id" @click="index = item.id" :color="index == item.id ? 'primary' : 'neutral'" />
      </UButtonGroup>
      <template v-if="index == 0">
          <NotificationForm ref="notForm" />
        </template>

        <template v-if="index == 1">
          <NotificationPopupForm ref="popForm" />
        </template>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <UButton label="اغلاق" color="error" @click="emit('close')" />
        <UButton label="اضافة" color="primary" @click="onAdd" />
      </div>

    </template>

  </UModal>
</template>

<script lang="ts" setup>

const notForm = ref()
const popForm = ref()
const index = ref(0)
const emit = defineEmits(['close'])

const tabItems = [{ id: 0, slot: 'notification', label: 'اشعار' }, { id: 1, slot: 'popup', label: ' اشعار المنبثق' }]

const onAdd = () => {
  if (index.value == 0) {
    notForm.value?.AddNotificatoion()
  } else if (index.value == 1) {
    popForm.value.AddNotificatoion()
  }

}

</script>

<style></style>