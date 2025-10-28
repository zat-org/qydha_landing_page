<template>
    <TournamentRequestForm :mode/>
</template>
<script setup lang="ts">
import { TournamentRequsetFormType } from '~/models/tournamentRequest';

const mode = TournamentRequsetFormType.Update
</script>
<style></style>