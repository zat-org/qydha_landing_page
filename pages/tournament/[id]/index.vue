<template>
  <TournamentGet :id="id"/>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const route = useRoute();
const id = +route.params.id;

onMounted(() => {
  const userStore = useMyAuthStore();
  
  console.log(userStore.logedin);
  const layout = userStore.logedin ? 'default' : 'tournament';
  setPageLayout(layout);
});
</script>

<style>

</style>