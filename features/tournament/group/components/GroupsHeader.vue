<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
    <div class="flex items-center gap-3">
      <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 dark:bg-primary/20">
        <UIcon name="i-heroicons-squares-2x2-20-solid" class="size-6" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">مجموعات البطولة</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-0.5 text-xs sm:text-sm">
          إدارة وتنظيم مجموعات وجولات ومباريات البطولة
        </p>
      </div>
    </div>

    <!-- Quick Stats Chips -->
    <div v-if="totalGroups > 0" class="flex flex-wrap items-center gap-2">
      <UBadge color="neutral" variant="subtle" size="sm" class="rounded-full px-3 py-1 font-medium">
        <UIcon name="i-heroicons-rectangle-stack" class="size-3.5 me-1 text-gray-500" />
        {{ totalGroups }} مجموعات
      </UBadge>

      <UBadge v-if="qualGroupsCount > 0" color="primary" variant="subtle" size="sm" class="rounded-full px-3 py-1 font-medium">
        <UIcon name="i-heroicons-squares-2x2" class="size-3.5 me-1" />
        {{ qualGroupsCount }} تصفيات
      </UBadge>

      <UBadge v-if="finalGroupExists" color="warning" variant="subtle" size="sm" class="rounded-full px-3 py-1 font-medium">
        <UIcon name="i-heroicons-trophy" class="size-3.5 me-1 text-amber-500" />
        نهائي
      </UBadge>

      <UBadge v-if="runningGroupsCount > 0" color="success" variant="solid" size="sm" class="rounded-full px-3 py-1 font-bold animate-pulse">
        <span class="size-1.5 rounded-full bg-white me-1.5 inline-block" />
        {{ runningGroupsCount }} جارية
      </UBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    totalGroups?: number;
    qualGroupsCount?: number;
    finalGroupExists?: boolean;
    runningGroupsCount?: number;
    completedGroupsCount?: number;
  }>(),
  {
    totalGroups: 0,
    qualGroupsCount: 0,
    finalGroupExists: false,
    runningGroupsCount: 0,
    completedGroupsCount: 0,
  },
);
</script>
