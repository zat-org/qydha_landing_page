<template>
  <TournamentGroup mode="embedded" :tournament-id="id" />
</template>

<script lang="ts" setup>
import TournamentGroup from "~/features/tournament/group/components/TournamentGroup.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const id = route.params.id?.toString() ?? "";
</script>
