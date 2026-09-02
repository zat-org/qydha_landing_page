<template>
  <DetailSectionCard
    :title="section.title"
    :icon="section.icon"
    description="مكان ومواعيد وجوائز مرحلة النهائي"
  >
    <div class="space-y-1.5">
      <DetailFieldRow label="مكان النهائي" align-start value-class="text-right">
        {{ data.locationDescription }}
      </DetailFieldRow>

      <DetailFieldRow label="موقع النهائي">
        <UButton
          v-if="data.location?.latitude && data.location?.longitude"
          variant="soft"
          color="primary"
          size="xs"
          icon="i-heroicons-map"
          target="_blank"
          :to="googleMapsUrl(data.location.latitude, data.location.longitude)"
        >
          عرض على الخريطة
        </UButton>
      </DetailFieldRow>

      <DetailFieldRow label="بداية النهائي" :value="formatDate(data.startAt)" />
      <DetailFieldRow label="نهاية النهائي" :value="formatDate(data.endAt)" />
      <DetailFieldRow label="عدد الفرق في النهائي" :value="data.teamsCount" />
      <DetailFieldRow label="عدد الطاولات في النهائي" :value="data.tablesCount" />
    </div>

    <div v-if="data.prizes?.length" class="mt-4 space-y-3">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">الجوائز</p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UCard v-for="(prize, index) in data.prizes" :key="index" class="p-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-900 dark:text-gray-100">
                المركز {{ getPrizePositionLabel(prize.type) }}
              </span>
              <div class="flex gap-2">
                <UBadge v-if="prize.isFinancial" color="success" variant="subtle" size="lg">
                  مالية
                </UBadge>
                <UBadge v-if="prize.isNonFinancial" color="info" variant="subtle" size="lg">
                  غير مالية
                </UBadge>
              </div>
            </div>

            <div
              v-if="prize.isFinancial && prize.financialPrizeAmount > 0"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              {{ prize.financialPrizeAmount }} {{ getCurrencyLabel(prize.financialPrizeCurrency) }}
            </div>

            <div
              v-if="prize.isNonFinancial && prize.nonFinancialPrizes.length > 0"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              <div v-for="nonFinancialPrize in prize.nonFinancialPrizes" :key="nonFinancialPrize">
                • {{ nonFinancialPrize }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </DetailSectionCard>
</template>

<script setup lang="ts">
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { tournamentRequestSteps } from "~/features/tournament/request/composables/tournamentRequestFormConfig";
import {
  getCurrencyLabel,
  getPrizePositionLabel,
  googleMapsUrl,
} from "~/features/tournament/request/composables/tournamentRequestDetailUtils";
import { formatDate } from "~/utils/formatDate";
import DetailFieldRow from "./DetailFieldRow.vue";
import DetailSectionCard from "./DetailSectionCard.vue";

defineProps<{ data: DetailTournamentRequest }>();

const section = tournamentRequestSteps[3]!;
</script>
