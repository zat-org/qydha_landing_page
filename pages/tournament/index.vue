<template>
  <TournamentGetAll />
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const userStore = useMyAuthStore();

// Set layout dynamically based on auth state
onMounted(() => {
  const layout = userStore.logedin ? 'default' : 'tournament';
  setPageLayout(layout);
});

useHead({
  title:'البطولات',
  meta:[
    {name:'description',content:'البطولات'}
  ]
})

</script>

<style></style>
