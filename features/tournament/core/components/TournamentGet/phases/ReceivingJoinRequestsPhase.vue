<template>
  <TournamentPhaseContent
    description="مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا."
  >
    <UButton
      :to="links.joinRequest.value"
      label="عرض طلبات الانضمام"
      icon="i-mdi-account-arrow-right"
      size="lg"
      variant="soft"
      class="w-full min-h-12 justify-center sm:w-auto"
      block
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type { TournamentPhaseContext } from "./types";
import { useTournamentPhaseLinks } from "./useTournamentPhaseLinks";

const props = defineProps<{ context: TournamentPhaseContext }>();
const links = useTournamentPhaseLinks(() => props.context.tournamentId);
</script>
