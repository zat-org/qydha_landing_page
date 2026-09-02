<template>
  <DetailSectionCard
    :title="section.title"
    :icon="section.icon"
    description="المعلومات الأساسية للبطولة"
  >
    <div v-if="data.description" class="mb-4">
      <p class="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">الوصف</p>
      <p class="leading-relaxed text-gray-700 dark:text-gray-300">{{ data.description }}</p>
    </div>

    <div class="space-y-1.5">
      <DetailFieldRow label="رقم الهاتف">
        <div class="flex items-center gap-2">
          <span dir="ltr">{{ data.contactPhone }}</span>
          <div class="flex gap-1">
            <UBadge v-if="data.isContactPhoneCall" color="success" variant="subtle" size="lg">
              مكالمة
            </UBadge>
            <UBadge v-if="data.isContactPhoneWhatsapp" color="success" variant="subtle" size="lg">
              واتساب
            </UBadge>
          </div>
        </div>
      </DetailFieldRow>

      <DetailFieldRow label="نوع البطولة" :value="getTournamentTypeLabel(data.type)" />

      <DetailFieldRow
        v-if="data.type === TournamentType.private && data.tournamentPrivatePassword"
        label="الرمز السري"
        :value="data.tournamentPrivatePassword"
      />
    </div>

    <div v-if="data.sponsorsUrls?.length" class="mt-4 space-y-2">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">الرعاة</p>
      <div class="flex flex-wrap gap-4">
        <img
          v-for="(sponsor, index) in data.sponsorsUrls"
          :key="index"
          :src="sponsor"
          :alt="`راعي ${index + 1}`"
          class="h-24 w-fit rounded-lg border border-gray-200 object-cover dark:border-gray-700"
        />
      </div>
    </div>
  </DetailSectionCard>
</template>

<script setup lang="ts">
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { TournamentType } from "~/features/tournament/models/tournamenetType";
import { tournamentRequestSteps } from "~/features/tournament/request/composables/tournamentRequestFormConfig";
import { getTournamentTypeLabel } from "~/features/tournament/request/composables/tournamentRequestDetailUtils";
import DetailFieldRow from "./DetailFieldRow.vue";
import DetailSectionCard from "./DetailSectionCard.vue";

defineProps<{ data: DetailTournamentRequest }>();

const section = tournamentRequestSteps[0]!;
</script>
