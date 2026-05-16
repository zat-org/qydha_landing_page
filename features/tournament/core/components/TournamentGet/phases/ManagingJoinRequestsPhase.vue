<template>
  <TournamentPhaseContent description="يمكنك قبول الطلبات أو رفضها.">
    <UButton
      :to="links.joinRequest.value"
      label="إدارة طلبات الانضمام"
      icon="i-mdi-account-arrow-right"
      size="lg"
      variant="solid"
      color="primary"
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
