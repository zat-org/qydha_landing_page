<template>
  <div class="space-y-4">
    <TournamentRequestCalculatorInputs
      v-model:teamsCount="teamsCount"
      v-model:tablesCount="tablesCount"
      v-model:dayNumber="dayNumber"
      v-model:sakkTime="sakkTime"
      v-model:sakkTime3="sakkTime3"
      v-model:sakkTime5="sakkTime5"
    />  
    <TournamentRequestCalculatorRounds
      :rounds="rounds"
      :sakka-options="sakkaOptions"
      :format-time="formatTime"
    />

    <TournamentRequestCalculatorSummary
      :rounds="rounds"
      :total-time="totalTime"
      :time-per-day="timePerDay"
      :total-matches="totalMatches"
      :day-number="dayNumber"
      :format-time="formatTime"
    />
  </div>
</template>

<script setup lang="ts">
const { rounds, teamsCount, tablesCount, sakkTime, sakkTime3, sakkTime5, totalTime, timePerDay, totalMatches, dayNumber } = useTourCalc();

const sakkaOptions = [
  { label: '1', value: 1 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
];

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes.toFixed(0)} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours.toFixed(0)} ساعة`;
  }
  return `${hours.toFixed(0)} ساعة و ${mins.toFixed(0)} دقيقة`;
};
</script>


