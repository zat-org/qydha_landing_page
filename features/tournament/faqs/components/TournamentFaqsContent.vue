<template>
  <div
    v-if="pending"
    class="flex items-center justify-center py-12"
  >
    <div class="flex flex-col items-center gap-4">
      <UIcon
        name="i-heroicons-arrow-path"
        class="h-8 w-8 animate-spin text-primary"
      />
      <p class="text-gray-500 dark:text-gray-400">جاري تحميل الأسئلة...</p>
    </div>
  </div>

  <UAlert
    v-else-if="error"
    color="error"
    variant="soft"
    icon="i-heroicons-exclamation-triangle"
    title="خطأ في تحميل الأسئلة"
    :description="error?.message || 'حدث خطأ أثناء تحميل البيانات'"
    class="mb-4"
  >
    <template #actions>
      <UButton
        color="error"
        variant="soft"
        label="إعادة المحاولة"
        @click="emit('refresh')"
      />
    </template>
  </UAlert>

  <div
    v-else-if="!faqs.length"
    class="flex flex-col items-center justify-center px-4 py-12"
  >
    <UIcon
      name="i-heroicons-question-mark-circle"
      class="mb-3 text-5xl text-gray-400"
    />
    <p class="mb-4 text-gray-500 dark:text-gray-400">لا توجد أسئلة شائعة</p>
    <UButton
      v-if="canMutate"
      label="إضافة سؤال"
      color="primary"
      icon="i-heroicons-plus-circle"
      @click="emit('add')"
    />
  </div>

  <div v-else class="space-y-3">
    <article
      v-for="faq in faqs"
      :key="faq.id"
      class="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/40"
    >
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div class="min-w-0 space-y-2">
          <UBadge color="neutral" variant="outline" size="xs">
            ترتيب {{ faq.appearOrder }}
          </UBadge>
          <p class="font-semibold text-gray-900 dark:text-gray-100">
            {{ faq.question }}
          </p>
          <p
            class="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300"
          >
            {{ faq.answer }}
          </p>
        </div>
        <UFieldGroup v-if="canMutate">
          <UButton
            color="warning"
            variant="soft"
            icon="i-heroicons-pencil-square"
            @click="emit('edit', faq)"
          >
            تعديل
          </UButton>
          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            :loading="deletePending && deletingId === faq.id"
            @click="emit('delete', faq)"
          >
            حذف
          </UButton>
        </UFieldGroup>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { TournamentFaq } from "~/features/tournament/models/faq";

defineProps<{
  faqs: TournamentFaq[];
  canMutate: boolean;
  pending: boolean;
  error: { message?: string } | null;
  deletingId: string | null;
  deletePending: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  add: [];
  edit: [faq: TournamentFaq];
  delete: [faq: TournamentFaq];
}>();
</script>
