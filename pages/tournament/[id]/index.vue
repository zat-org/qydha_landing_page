<template>

  <TournamentGet :id="id"/>

</template>

<script lang="ts" setup>

const route = useRoute ()
const id = +route.params.id

import { useMyAuthStore } from '~/store/Auth';
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
definePageMeta({
  layout: computed(() => userStore.logedin ? 'default' : 'landing')
})


// definePageMeta({middleware:'auth'})
</script>

<style>

</style>