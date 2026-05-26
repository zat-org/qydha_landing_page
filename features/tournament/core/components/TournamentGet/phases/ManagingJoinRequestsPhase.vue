<template>
  <TournamentPhaseContent description="يمكنك قبول الطلبات أو رفضها." />
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

defineProps<{ context: TournamentPhaseContext }>();
</script>
