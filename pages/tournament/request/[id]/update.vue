<template>
    <div class="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden">
      <TournamentRequestForm class="flex h-full min-h-0 flex-1 flex-col overflow-hidden" :mode />
    </div>
</template>
<script setup lang="ts">
import TournamentRequestForm from '~/features/tournament/request/components/TournamentRequestForm.vue';
import { TournamentRequsetFormType } from '~/features/tournament/models/tournamentRequest';

const mode = TournamentRequsetFormType.Update
</script>
<style></style>