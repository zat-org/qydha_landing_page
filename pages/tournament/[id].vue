<template>
  <TournamentGet v-if="showDetailShell" :id="id">
    <NuxtPage />
  </TournamentGet>
  <NuxtPage v-else />
</template>

<script lang="ts" setup>
import TournamentGet from "~/features/tournament/detail/components/TournamentGet/index.vue";
import { shouldShowTournamentDetailShell } from "~/features/tournament/detail/utils/tournamentNavigation.utils";

const route = useRoute();
const id = computed(() => route.params.id?.toString() ?? "");

const showDetailShell = computed(() =>
  shouldShowTournamentDetailShell(route, id.value),
);

useHead({
  title: "البطولة",
  meta: [{ name: "description", content: "البطولة" }],
});
</script>
