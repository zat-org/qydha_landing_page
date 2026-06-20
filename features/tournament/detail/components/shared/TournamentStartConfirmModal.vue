<template>
  <UModal v-model:open="open" title="تأكيد بدء البطولة" :ui="{ footer: 'justify-end gap-2' }">
    <template #body>
      <div class="space-y-4">
        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          سيتم بدء المباريات في المجموعة النهائية وتفعيل مرحلة اللعب. تأكد أن الخريطة والجولات كما تريدها قبل
          المتابعة.
        </p>
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-mdi-alert-decagram-outline"
          title="لا يمكن التراجع بعد بدء اللعب"
          description="بعد تأكيد البدء، لن يمكنك التراجع عن هذا الإجراء إذا بدأت أي مباراة باللعب فعلياً (حالة التشغيل أو ما بعدها)."
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
        label="نعم، ابدأ البطولة"
        icon="i-mdi-play"
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
const open = defineModel<boolean>('open', { required: true });

defineProps<{
  pending: boolean;
}>();

defineEmits<{
  confirm: [];
}>();
</script>
