<template>
  <TournamentPhaseContent
    :alert="{
      color: 'info',
      title: 'ربط الفرق بالمجموعة',
      description:
        'وزع الفرق على المجموعة النهائية ثم كوّن المباريات من صفحة المجموعات.',
    }"
  >
    <UButton
      :to="links.group.value"
      label="إدارة المجموعات"
      icon="i-mdi-user-group"
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
