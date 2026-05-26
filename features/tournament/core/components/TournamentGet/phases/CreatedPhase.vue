<template>
  <TournamentPhaseContent
    description="ابدأ بإعداد البطولة والفرق حسب سياسة الانضمام."
  />
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

defineProps<{ context: TournamentPhaseContext }>();
</script>
