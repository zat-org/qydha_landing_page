<template>
<ClientOnly>
  <TournamentGet :id="id"/>
</ClientOnly>
</template>

<script lang="ts" setup>

const route = useRoute ()
const id = +route.params.id
definePageMeta({middleware:'auth'})
</script>

<style>

</style>