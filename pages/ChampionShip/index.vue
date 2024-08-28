<template>
  <div class="w-full h-screen">
    <ClientOnly>
      <ChampionshipFlow :group_id="group" />
    </ClientOnly>
  </div>
  <!-- <ClientOnly>
    <test />
  </ClientOnly> -->
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});

const route = useRoute();
const groupQuery = route.query.group;
// console.log("page", groupQuery);
let group: number | undefined;
if (groupQuery && groupQuery !== undefined) {
  group = +groupQuery;
} else {
  group = undefined;
}
</script>

<style></style>
