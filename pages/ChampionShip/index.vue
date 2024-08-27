<template>
  <div class="w-full h-screen">
    <ClientOnly>
    <ChampionshipFlow  :group_id="+groupQuery"/>
    </ClientOnly>
  
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});
 
const route = useRoute()
const groupQuery = route.query.group 

</script>

<style>

</style>