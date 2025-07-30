<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">إحصائيات سريعة</h2>
    </template>

    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-trophy" class="text-primary-500" />
          <span class="font-medium">البطولات المكتملة</span>
        </div>
        <UBadge color="primary" :label="stats.completedTournaments.toString()" />
      </div>

      <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-play" class="text-green-500" />
          <span class="font-medium">البطولات الجارية</span>
        </div>
        <UBadge color="success" :label="stats.activeTournaments.toString()" />
      </div>

      <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-users" class="text-blue-500" />
          <span class="font-medium">إجمالي المشاركين</span>
        </div>
        <UBadge color="primary" :label="stats.totalParticipants.toString()" />
      </div>

      <div class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-star" class="text-yellow-500" />
          <span class="font-medium">التقييم العام</span>
        </div>
        <div class="flex items-center gap-1">
          <UBadge color="warning" :label="stats.averageRating.toString()" />
          <UIcon name="i-heroicons-star-solid" class="text-yellow-500 text-sm" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface OrganizerStats {
  completedTournaments: number
  activeTournaments: number
  totalParticipants: number
  averageRating: number
}

// Props
const props = defineProps<{
  stats: OrganizerStats
}>()
</script> 