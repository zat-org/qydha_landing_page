<template>
  <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-8 sm:py-4">
    <UButton
      label="عودة"
      color="neutral"
      variant="soft"
      size="sm"
      icon="i-mdi-arrow-left"
      @click="$emit('back')"
    />
    <div class="flex flex-wrap items-center gap-2 justify-end">
      <UButton
        v-if="isAdmin && canEdit"
        color="warning"
        label="تعديل"
        icon="i-mdi-pencil"
        size="sm"
        :to="'/tournament/' + id + '/edit'"
      />
      <UButton
        label="خريطة البطولة"
        :to="'/tournament/' + id + '/bracket'"
        icon="i-mdi-tournament"
        target="_blank"
        color="primary"
        variant="soft"
        size="sm"
      />
      <UButton
        label="إحصائيات البطولة"
        icon="i-mdi-chart-box"
        color="primary"
        variant="solid"
        size="sm"
        :to="'/tournament/' + id + '/statistics'"
        target="_blank"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  id: string;
  isAdmin: boolean;
  canEdit: boolean;
}>();

defineEmits<{
  back: [];
}>();
</script>
