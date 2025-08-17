import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin((nuxtApp) => {

  nuxtApp.vueApp.component('ApexChart', VueApexCharts);
  const defaultOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true }
    },
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
  };
  nuxtApp.vueApp.provide('ApexChartOptions', defaultOptions);
});
