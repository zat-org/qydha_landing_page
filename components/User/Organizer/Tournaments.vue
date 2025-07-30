<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-trophy" class="text-xl text-primary-500" />
          <h2 class="text-xl font-semibold">البطولات المنظمة</h2>
        </div>
        <UBadge 
          :label="`${tournaments.length} بطولة`"
          color="primary"
          variant="soft"
        />
      </div>
    </template>

    <div class="space-y-4">
      <div 
        v-for="tournament in tournaments" 
        :key="tournament.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {{ tournament.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ tournament.description }}
            </p>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin" />
                {{ tournament.city }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" />
                {{ formatDate(tournament.startAt) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <UBadge 
              :color="getTournamentStatusColor(tournament.status)"
              :label="getTournamentStatusLabel(tournament.status)"
              variant="soft"
            />
            <UButton 
              size="sm" 
              variant="outline"
              icon="i-heroicons-eye"
              :to="`/tournament/${tournament.id}`"
            >
              عرض
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tournaments.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-trophy" class="text-4xl text-gray-400 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">لم يتم تنظيم أي بطولات حتى الآن</p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface Tournament {
  id: string
  name: string
  description: string
  city: string
  startAt: string
  endAt: string
  status: string
}

// Props
const props = defineProps<{
  tournaments: Tournament[]
}>()

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'غير محدد'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getTournamentStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'active': return 'primary'
    case 'upcoming': return 'warning'
    default: return 'neutral'
  }
}

const getTournamentStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'مكتملة'
    case 'active': return 'جارية'
    case 'upcoming': return 'قادمة'
    default: return 'غير محدد'
  }
}
</script> 