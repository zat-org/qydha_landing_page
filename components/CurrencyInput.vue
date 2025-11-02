<template>
  <USelect v-model="currency" :items="currencyOptions" />

</template>

<script setup lang="ts">
import { TournamentPrizeCurrency } from '~/models/tournamentPrize';

const currency = defineModel<TournamentPrizeCurrency>({ required: true, default: TournamentPrizeCurrency.SAR });
const { getTournamentPrizeCurrency } = useTournamentRequest()
const currencyOptions = getTournamentPrizeCurrency()
// [
//   { label: 'دولار أمريكي (USD)', value: 'USD' },
//   { label: 'جنيه مصري (EGP)', value: 'EGP' },
//   { label: 'ريال سعودي (SAR)', value: 'SAR' },
//   { label: 'درهم إماراتي (AED)', value: 'AED' },
//   { label: 'يورو (EUR)', value: 'EUR' },
//   { label: 'دينار أردني (JOD)', value: 'JOD' },
//   { label: 'دينار كويتي (KWD)', value: 'KWD' },
//   { label: 'ليرة تركية (TRY)', value: 'TRY' },
//   { label: 'جنيه إسترليني (GBP)', value: 'GBP' }
// ]


</script>

<style scoped></style>