<template>
  <TournamentJoiningRequest mode="embedded" :tournament-id="tournamentId" />
</template>

<script lang="ts" setup>
import TournamentJoiningRequest from "~/features/tournament/join-request/components/TournamentJoiningRequest.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const tournamentId = route.params.id?.toString() ?? "";
</script>
