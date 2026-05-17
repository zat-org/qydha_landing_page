<template>
  <UModal v-model:open="open" :title="title" :ui="{ footer: 'justify-end gap-2' }">
    <template #body>
      <div class="space-y-4">
        <p v-if="description" class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          {{ description }}
        </p>
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-mdi-account-off-outline"
          title="تأكد من خروج الحكم من التطبيق"
          description="يجب أن يكون الحكم قد خرج من شاشة المباراة في تطبيق قيدها قبل تنفيذ هذا الإجراء، وإلا قد تحدث مشاكل في حالة اللعبة."
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
        :label="confirmLabel"
        :icon="confirmIcon"
        :color="confirmColor"
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

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    confirmLabel: string;
    confirmIcon?: string;
    confirmColor?: "primary" | "warning" | "error";
    pending: boolean;
  }>(),
  {
    confirmColor: "primary",
    confirmIcon: "i-mdi-check",
  },
);

defineEmits<{
  confirm: [];
}>();
</script>
