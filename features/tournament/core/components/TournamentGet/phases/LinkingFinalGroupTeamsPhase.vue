<template>
  <TournamentPhaseContent
    :alert="{
      color: 'info',
      title: 'ربط الفرق بالمجموعة',
      description:
        'وزع الفرق على المجموعة النهائية ثم كوّن المباريات من صفحة المجموعات.',
    }"
  />
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

defineProps<{ context: TournamentPhaseContext }>();
</script>
