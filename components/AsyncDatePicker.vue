<template>
  <ClientOnly>
    <VueDatePicker
      dir="ltr"
      style="direction: ltr;"
      v-bind="$attrs"
      v-model="internalDate"
    :format="format"
      :dark="isDark"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const colorMode= useColorMode()
const isDark= computed(()=>{
  return colorMode.value == 'dark' ? true:false
})
const VueDatePicker = defineAsyncComponent(() => 
  import('@vuepic/vue-datepicker').then(m => {
    // Import CSS only when component is loaded
    import('@vuepic/vue-datepicker/dist/main.css');
    return m.default;
  })
);

// Use defineModel for v-model binding instead of props/emits
const model = defineModel<string|Date>();

// Computed property to handle conversion between Date and ISO string
const internalDate = computed({
  get: () => {
    if (!model.value) return null;
    return model.value instanceof Date ? model.value : new Date(model.value as string);
  },
  set: (value: Date | null) => {
    if (value) {
      model.value = toISOStringWithTimezone(value) as any;
    } else {
      model.value = null as any;
    }
  }
});

function toISOStringWithTimezone(date:Date) {
  const pad = (num:any) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // timezone offset in minutes
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}

const format = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
</script>
<style scoped>

</style>