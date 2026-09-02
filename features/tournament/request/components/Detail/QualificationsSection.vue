<template>
  <DetailSectionCard
    :title="section.title"
    :icon="section.icon"
    description="أماكن ومواعيد مرحلة التصفيات"
    empty-message="لا توجد مرحلة تصفيات في هذا الطلب"
    :is-empty="!places.length"
  >
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <UCard v-for="(place, index) in places" :key="index" class="p-4">
        <div class="space-y-2">
          <p class="font-medium text-gray-900 dark:text-gray-100">
            مكان التصفيات {{ index + 1 }} — {{ place.locationDescription || `مكان ${index + 1}` }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            من {{ formatDate(place.startAt) }} إلى {{ formatDate(place.endAt) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            عدد الفرق المتنافسة: {{ place.competingTeamsCount }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            عدد الطاولات المتاحة: {{ place.availableTablesCount }}
          </p>
          <UButton
            v-if="place.location?.latitude && place.location?.longitude"
            variant="soft"
            color="primary"
            size="xs"
            icon="i-heroicons-map"
            target="_blank"
            :to="googleMapsUrl(place.location.latitude, place.location.longitude)"
          >
            عرض على الخريطة
          </UButton>
        </div>
      </UCard>
    </div>
  </DetailSectionCard>
</template>

<script setup lang="ts">
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { tournamentRequestSteps } from "~/features/tournament/request/composables/tournamentRequestFormConfig";
import { googleMapsUrl } from "~/features/tournament/request/composables/tournamentRequestDetailUtils";
import { formatDate } from "~/utils/formatDate";
import DetailSectionCard from "./DetailSectionCard.vue";

const props = defineProps<{ data: DetailTournamentRequest }>();

const section = tournamentRequestSteps[2]!;
const places = computed(() => props.data.qualificationsStageInfo?.places ?? []);
</script>
