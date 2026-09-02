<template>
  <DetailSectionCard
    :title="section.title"
    :icon="section.icon"
    empty-message="لا توجد قوانين مضافة لهذا الطلب"
    :is-empty="!data.rules?.length"
  >
    <div class="space-y-2">
      <div
        v-for="(rule, index) in data.rules"
        :key="index"
        class="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
      >
        <span class="text-sm font-bold text-primary-600 dark:text-primary-400">{{ index + 1 }}.</span>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ rule }}</span>
      </div>
    </div>
  </DetailSectionCard>
</template>

<script setup lang="ts">
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { tournamentRequestSteps } from "~/features/tournament/request/composables/tournamentRequestFormConfig";
import DetailSectionCard from "./DetailSectionCard.vue";

defineProps<{ data: DetailTournamentRequest }>();

const section = tournamentRequestSteps[4]!;
</script>
