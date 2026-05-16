<template>
  <UModal
    v-model:open="open"
    title="تأكيد الموافقة على مخطط البطولة"
    :ui="{ footer: 'justify-end gap-2' }"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          بالموافقة على المخطط، تؤكد أن الخريطة والفرق جاهزة للمرحلة التالية. راجع كل شيء قبل المتابعة.
        </p>
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-mdi-alert-decagram-outline"
          title="لا يمكن التراجع عن التعديل"
          description="بعد الموافقة، لن تتمكن من العودة لتعديل خريطة البطولة أو فرق هذه البطولة."
        />
      </div>
    </template>
    <template #footer>
      <UButton
        label="إلغاء"
        color="neutral"
        variant="soft"
        :disabled="pending"
        @click="open = false"
      />
      <UButton
        label="نعم، أوافق على المخطط"
        icon="i-mdi-check-decagram"
        color="primary"
        variant="solid"
        :loading="pending"
        :disabled="pending"
        @click="$emit('confirm')"
      />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>("open", { required: true });

defineProps<{
  pending: boolean;
}>();

defineEmits<{
  confirm: [];
}>();
</script>
