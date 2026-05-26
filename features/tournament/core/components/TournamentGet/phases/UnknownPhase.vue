<template>
  <TournamentPhaseContent
    :alert="{
      color: 'warning',
      title: 'حالة غير معروفة أو محدثة',
      description:
        'تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من التبويبات أدناه.',
    }"
  />
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

defineProps<{ context: TournamentPhaseContext }>();
</script>
