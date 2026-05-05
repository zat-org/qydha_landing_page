<template>
    <TournamentRequestForm :mode/>
</template>
<script setup lang="ts">
import TournamentRequestForm from '~/features/tournament/request/components/TournamentRequestForm.vue';
import { TournamentRequsetFormType } from '~/features/tournament/models/tournamentRequest';

const mode = TournamentRequsetFormType.Update
</script>
<style></style>