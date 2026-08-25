<template>
  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
    <UFormField class="min-w-0 flex-1" label="بحث في السؤال أو اسم المرسل">
      <UInput
        placeholder="ابحث..."
        maxlength="100"
        @input="onSearchInput"
      />
    </UFormField>
    <UPagination
      v-if="totalCount > pageSize"
      v-model:page="pageNumber"
      :total="totalCount"
      :page-size="pageSize"
    />
  </div>

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

  <UTable v-else :data="items" :columns="cols" hover class="flex-1">
    <template #empty>
      <div class="flex flex-col items-center justify-center px-4 py-12">
        <UIcon
          name="i-heroicons-chat-bubble-left-right"
          class="mb-3 text-5xl text-gray-400"
        />
        <p class="text-gray-500 dark:text-gray-400">لا توجد أسئلة</p>
      </div>
    </template>

    <template #sender-cell="{ row }">
      <div class="flex items-center gap-2">
        <UAvatar
          :src="row.original.sentBy.avatarUrl ?? undefined"
          :alt="row.original.sentBy.username"
          size="sm"
        />
        <div class="min-w-0">
          <p class="truncate text-sm font-medium">
            {{ row.original.sentBy.name || row.original.sentBy.username }}
          </p>
          <p class="truncate text-xs text-gray-500">
            @{{ row.original.sentBy.username }}
          </p>
        </div>
      </div>
    </template>

    <template #question-cell="{ row }">
      <p class="max-w-md whitespace-pre-wrap text-sm">
        {{ row.original.question }}
      </p>
    </template>

    <template #sentAt-cell="{ row }">
      {{ formatDateTime(row.original.sentAt) }}
    </template>

    <template #status-cell="{ row }">
      <UBadge
        :color="row.original.answeredAt ? 'success' : 'warning'"
        variant="soft"
        size="sm"
      >
        {{ row.original.answeredAt ? "تم الرد" : "بانتظار الرد" }}
      </UBadge>
      <p
        v-if="row.original.answeredAt"
        class="mt-1 text-xs text-gray-500 dark:text-gray-400"
      >
        {{ formatDateTime(row.original.answeredAt) }}
      </p>
    </template>

    <template #actions-cell="{ row }">
      <UFieldGroup v-if="canMutate">
        <UButton
          v-if="!row.original.answeredAt"
          label="تم الرد"
          color="success"
          variant="soft"
          size="sm"
          icon="i-heroicons-check-circle"
          :loading="answerPending && answeringId === row.original.id"
          @click="emit('answer', row.original.id)"
        />
        <UButton
          v-if="row.original.answeredAt"
          label="إضافة كسؤال شائع"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-heroicons-question-mark-circle"
          @click="emit('create-faq', row.original)"
        />
        <UButton
          label="حذف"
          color="error"
          variant="soft"
          size="sm"
          icon="i-heroicons-trash"
          :loading="deletePending && deletingId === row.original.id"
          @click="emit('delete', row.original)"
        />
      </UFieldGroup>
    </template>
  </UTable>

  <div
    v-if="!pending && totalCount > pageSize"
    class="mt-4 flex justify-center"
  >
    <UPagination
      v-model:page="pageNumber"
      :total="totalCount"
      :page-size="pageSize"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TournamentUserQuestion } from "~/features/tournament/models/userQuestion";
import { formatDateTime } from "~/utils/formatDate";

defineProps<{
  items: TournamentUserQuestion[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  pending: boolean;
  error: { message?: string } | null;
  canMutate: boolean;
  answeringId: string | null;
  deletingId: string | null;
  answerPending: boolean;
  deletePending: boolean;
}>();

const pageNumber = defineModel<number>("pageNumber", { required: true });

const emit = defineEmits<{
  refresh: [];
  search: [event: Event];
  answer: [questionId: string];
  "create-faq": [question: TournamentUserQuestion];
  delete: [question: TournamentUserQuestion];
}>();

const cols = [
  { accessorKey: "sender", header: "المرسل" },
  { accessorKey: "question", header: "السؤال" },
  { accessorKey: "sentAt", header: "تاريخ الإرسال" },
  { accessorKey: "status", header: "الحالة" },
  { accessorKey: "actions", header: "#" },
];

function onSearchInput(event: Event) {
  emit("search", event);
}
</script>
