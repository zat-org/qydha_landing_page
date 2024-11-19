<template>

  <TournamentGet :id="id"/>

</template>

<script lang="ts" setup>

const route = useRoute ()
const id = +route.params.id
definePageMeta({middleware:'auth'})
</script>

<style>

</style>