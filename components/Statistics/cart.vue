<template>
    <ApexChart
      type="pie"
      :options="{ ...defaults, ...chartOptions }"
      :series="series"
      :labels="labels"
      height="300"
    />
  </template>
  
  <script setup lang="ts">
    const colorMode = useColorMode()
  const defaults = inject('ApexChartOptions') as any; 
  
  const series = [44, 55, 13, 43, 22]
  const labels = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']

  // Component-specific overrides
  const chartOptions = computed(() => {
    return {
    theme: {
      palette: 'palette1' ,
      mode: colorMode.value === 'dark' ? 'dark' : 'light'
    },

  }});
  
  </script>
  