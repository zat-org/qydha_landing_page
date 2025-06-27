<template>
  <UCard>
    <template #header>
      <div class="flex justify-start gap-4 items-center">
        <USelect :options="options" class="w-[50%]" v-model="time_options">
        </USelect>
        <VueDatePicker class="w-[40%]" range v-if="time_options == 'customRange'" v-model="dateRange"
          :enable-time-picker="false" position="right" />
      </div>
    </template>
    <UButtonGroup>
      <UButton v-for="item in items" :key="item.id" :label="item.label" :value="item.id" @click="changeIndex(item.id)"
        :color="tabIndex == item.id ? 'primary' : 'neutral'" />
    </UButtonGroup>

    <template v-if="tabIndex == 0">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Users Statistics Card -->
        <UCard class="bg-gradient-to-br from-primary-50 to-primary-100">
          <div class="flex flex-col items-center p-4">
            <div class="text-sm text-gray-600">Total Users</div>
            <div class="text-2xl font-bold text-primary-600">1,234</div>
          </div>
        </UCard>

        <!-- Sakkas Statistics Card -->
        <UCard class="bg-gradient-to-br from-secondary-50 to-secondary-100">
          <div class="flex flex-col items-center p-4">
            <div class="text-sm text-gray-600">Total Sakkas</div>
            <div class="text-2xl font-bold text-secondary-600">5,678</div>
          </div>
        </UCard>
      </div>
    </template>
    <template v-if="tabIndex == 1">
      <Map></Map>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const items = [
  { id: 0, label: "بيانات", slot: "data" },
  { id: 1, label: "الخريطة", slot: "map" },
];
const tabIndex = ref(0)
const changeIndex = (index: number) => {
  tabIndex.value = index
}

// option for select date
const options = [
  { label: "اليوم", value: "today" },
  { label: "امس", value: "yesterday" },
  { label: "هذا الاسبوع", value: "thisWeek" },
  { label: "هذا الشهر", value: "thisMonth" },
  { label: "هذة السنه", value: "thisYear" },
  { label: "تاريخ محدد", value: "customRange" },
];
const time_options = ref();
const dateRange = ref<Date[]>([]);

const today = new Date();
let yersterday = new Date();
yersterday.setDate(today.getDate() - 1);
const thisWeak = new Date();
// console.log(today.getDate())  number of day in month
// console.log(today.getDay())  get number of day regard to week
// console.log(today.getDate() - today.getDay())  get the start of  active week
thisWeak.setDate(today.getDate() - today.getDay());
const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const thisYear = new Date(today.getFullYear(), 0, 1);
watch(time_options, (new_value, old_value) => {
  if (time_options.value == "today") {
    // change daterange
    dateRange.value[0] = dateRange.value[1] = today;
  } else if (time_options.value == "yesterday") {
    dateRange.value[0] = yersterday;
    dateRange.value[1] = today;
  } else if (time_options.value == "thisWeek") {
    dateRange.value[0] = thisWeak;
    dateRange.value[1] = today;
  } else if (time_options.value == "thisMonth") {
    dateRange.value[0] = thisMonth;
    dateRange.value[1] = today;
  } else if (time_options.value == "thisYear") {
    dateRange.value[0] = thisYear;
    dateRange.value[1] = today;
  }
});
time_options.value = "today";
</script>

<style></style>
