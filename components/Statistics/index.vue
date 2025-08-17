<template>
  <UCard :ui="{header:'p-1'}">
    <template #header>
      <div class="flex justify-between items-center mb-6 gap-2">
        <UFormField label="الفترة" name="timeRange" class="w-full">
          <USelect :content="{ align: 'start', position: 'popper' }" v-model="timeRange" :items="timeOptions" />
        </UFormField>

        <!-- <UInput v-show="timeRange == 'custom'" v-model="customTime" type="date" /> -->
        <VDatePicker v-model.range="range" dir="ltr" :masks="{ input: 'DD-MM-YYYY' }" locale="ar"
          :isDark="colorMode.value == 'dark'" @dayclick="(day: any, event: any) => { event.target.blur(); }">
          <template #default="{ inputValue, inputEvents }">
            <div class="flex justify-center items-center gap-2" v-show="timeRange == 'custom'">
              <UFormField label="من" name="start">
                <UInput :value="inputValue.start" v-on="inputEvents.start" />
              </UFormField>
              <UFormField label="الي" name="end">
                <UInput :value="inputValue.end" v-on="inputEvents.end" />
              </UFormField>
            </div>
          </template>
        </VDatePicker>

      </div>
    </template>

    <UTabs v-model="active" :items="tabs" :ui="{ root: 'h-full flex-1 items-stretch ', content: ' ', list: 'min-h-full ' }"
      orientation="vertical" dir="rtl">
      <template #general>
        <KeepAlive>
          <StatisticsGeneral v-if="active == 'general'" />
        </KeepAlive>
      </template>
      <template #rules>
        قريبا
        <!-- <StatisticsRules /> -->
      </template>
      <template #baloot>
        <KeepAlive> 
          <StatisticsBaloot v-if="active == 'baloot'" :type="timeRange" :startDate="range.start" :endDate="range.end" />
        </KeepAlive>
      </template>
      <template #hand>
        <!-- <KeepAlive> -->
          قريبا

          <!-- <StatisticsHand v-if="active == 'hand'" /> -->
        <!-- </KeepAlive> -->
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import { ar } from 'date-fns/locale';
const colorMode = useColorMode()
const timeOptions = ref([
  {
    label: 'اليوم',
    value: 'day'
  },
  {
    label: 'الاسبوع',
    value: 'week'
  },
  {
    label: 'الشهر',
    value: 'month'
  },
  {
    label: 'السنة',
    value: 'year'
  },
  {
    label: 'المخصص',
    value: 'custom'
  },
])

const range = ref({
  start: new Date(),
  end: new Date(),
});

const timeRange = ref<"day" | "week" | "month" | "year" | "custom">('day')
const route = useRoute()
const router = useRouter()
const tabs = ref([
  {
    label: 'العام',
    value: 'general',
    content: ' general',
    slot: 'general'
  },
  {
    label: 'بلوت',
    value: 'baloot',
    content: ' baloot',
    slot: 'baloot'
  },
  {
    label: 'الهند',
    value: 'hand',
    content: ' hand',
    slot: 'hand'
  },
  {
    label: 'القوانين',
    value: 'rules',
    content: ' rules',
    slot: 'rules'
  },



])
const active = computed({
  get() {
    return (route.query.tab as string) || 'general'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      path: '/statistics',
      query: { tab: tab },
    })
  }
})

</script>

<style>
.rtl {
  direction: rtl;
}
</style>
