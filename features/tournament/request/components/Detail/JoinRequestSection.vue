<template>
  <DetailSectionCard
    :title="section.title"
    :icon="section.icon"
    description="نافذة وإعدادات طلبات الانضمام"
  >
    <div class="space-y-1.5">
      <DetailFieldRow label="التسجيل من خلال قيدها">
        <UBadge :color="data.addPlayersByQydha ? 'success' : 'neutral'" variant="subtle" size="lg">
          {{ data.addPlayersByQydha ? "نعم" : "لا" }}
        </UBadge>
      </DetailFieldRow>

      <template v-if="data.addPlayersByQydha">
        <DetailFieldRow
          v-if="data.joinRequestStartAt"
          label="بداية طلبات الانضمام"
          :value="formatDate(data.joinRequestStartAt)"
        />
        <DetailFieldRow
          v-if="data.joinRequestEndAt"
          label="نهاية طلبات الانضمام"
          :value="formatDate(data.joinRequestEndAt)"
        />
        <DetailFieldRow
          v-if="data.joinRequestMaxCount"
          label="أقصى عدد طلبات الانضمام"
          :value="data.joinRequestMaxCount"
        />
        <DetailFieldRow
          label="نوع طلبات الانضمام"
          :value="getJoinRequestTypeLabel(data.allowedJoinRequestType)"
        />
        <DetailFieldRow
          label="عدد الأيام الأدنى للاشتراك"
          :value="data.minimumSubscriptionDays ?? 0"
        />
      </template>
    </div>
  </DetailSectionCard>
</template>

<script setup lang="ts">
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { tournamentRequestSteps } from "~/features/tournament/request/composables/tournamentRequestFormConfig";
import { getJoinRequestTypeLabel } from "~/features/tournament/request/composables/tournamentRequestDetailUtils";
import { formatDate } from "~/utils/formatDate";
import DetailFieldRow from "./DetailFieldRow.vue";
import DetailSectionCard from "./DetailSectionCard.vue";

defineProps<{ data: DetailTournamentRequest }>();

const section = tournamentRequestSteps[1]!;
</script>
