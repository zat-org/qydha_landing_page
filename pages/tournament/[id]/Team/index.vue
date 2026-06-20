<template>
  <TournamentTeam mode="embedded" :tournament-id="tournamentId" />
</template>

<script lang="ts" setup>
import TournamentTeam from "~/features/tournament/teams/components/TournamentTeam.vue";

const route = useRoute();
const tournamentId = route.params.id?.toString() ?? "";
</script>
