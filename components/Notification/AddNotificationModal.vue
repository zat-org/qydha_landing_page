<template>
  <UModal
    title="إضافة إشعار"
    description="أرسل إشعاراً أو إشعاراً منبثقاً للمستخدمين"
    :prevent-close="isSubmitting"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFieldGroup>
          <UButton
            v-for="item in tabItems"
            :key="item.id"
            :label="item.label"
            :color="index === item.id ? 'primary' : 'neutral'"
            :disabled="isSubmitting"
            @click="index = item.id"
          />
        </UFieldGroup>
        <NotificationForm
          v-if="index === 0"
          ref="notForm"
          @close="emit('close')"
        />
        <NotificationPopupForm
          v-else
          ref="popForm"
          @close="emit('close')"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between">
        <UButton
          label="إغلاق"
          color="neutral"
          variant="outline"
          :disabled="isSubmitting"
          @click="emit('close')"
        />
        <UButton
          label="إرسال"
          color="primary"
          :loading="isSubmitting"
          @click="onAdd"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const notForm = ref<{ AddNotificatoion: () => void; pending?: { value: boolean } } | null>(null);
const popForm = ref<{ AddNotificatoion: () => void; pending?: { value: boolean } } | null>(null);
const index = ref(0);
const emit = defineEmits<{ close: [] }>();

const tabItems = [
  { id: 0, label: "إشعار" },
  { id: 1, label: "إشعار منبثق" },
];

const isSubmitting = computed(
  () =>
    Boolean(
      index.value === 0
        ? unref(notForm.value?.pending)
        : unref(popForm.value?.pending),
    ),
);

const onAdd = () => {
  if (index.value === 0) notForm.value?.AddNotificatoion();
  else popForm.value?.AddNotificatoion();
};
</script>
