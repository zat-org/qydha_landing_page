import { DatePicker  } from 'v-calendar';
import 'v-calendar/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VDatePicker', DatePicker );
});