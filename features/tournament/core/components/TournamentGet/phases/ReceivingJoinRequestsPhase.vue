<template>
  <TournamentPhaseContent
    description="مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا."
  />
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

defineProps<{ context: TournamentPhaseContext }>();
</script>
