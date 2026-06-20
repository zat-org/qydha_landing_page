<template>
  <TournamentGetAll />
</template>

<script lang="ts" setup>
import TournamentGetAll from '~/features/tournament/list/components/TournamentGetAll.vue';

definePageMeta({
  middleware: ['auth'],
});

useHead({
  title: 'البطولات',
  meta: [
    { name: 'description', content: 'البطولات' },
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG' },
  ],
});
</script>
