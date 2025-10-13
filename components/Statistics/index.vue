<template>
  <div> تحت الصيانه </div>
  <!-- <UCard :ui="{ header: 'p-1' }">
    <template #header>
      <div class="flex justify-between items-end mb-6 gap-2">
        <UFormField label="الفترة" name="timeRange" class="w-full">
          <USelect :content="{ align: 'start', position: 'popper' }" v-model="timeRange" :items="timeOptions" />
        </UFormField>

        <VDatePicker v-model.range="range" dir="ltr" :masks="{ input: 'DD-MM-YYYY' }" locale="ar"
          :popover="{ visibility: 'click', hideIndicator: true, isInteractive: true }" columns="2"
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

        <UButton label="بحث" @click="search()" class=" h-full" />
      </div>
    </template>

    <UTabs v-model="active" :items="tabs"
      :ui="{ root: 'h-full flex-1 items-stretch ', content: ' ', list: 'min-h-full ' }" orientation="vertical" dir="rtl"
      :unmountOnHide="false">
      <template #general>
        <Suspense>
          <LazyStatisticsGeneral />
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </template>
      <template #rules>
        <Suspense>
          <LazyStatisticsRules :data="balootBookData" :status="balootBookStatus" :type="timeRange"
            :startDate="range.start" :endDate="range.end" />
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </template>
      <template #baloot>
        <Suspense>
          <LazyStatisticsBaloot :data="balootData" :status="balootStatus" :type="timeRange" :startDate="range.start"
            :endDate="range.end" />
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </template>
      <template #hand>
      </template>
    </UTabs>
  </UCard> -->

</template>

<script lang="ts" setup>

const colorMode = useColorMode()
const timeOptions = ref([
  {
    label: 'لاخر يوم',
    value: 'day'
  },
  {
    label: 'لاخر اسبوع',
    value: 'week'
  },
  {
    label: 'لاخر شهر',
    value: 'month'
  },
  {
    label: 'لاخر سنة',
    value: 'year'
  },
  {
    label: 'المخصص',
    value: 'custom'
  },
])

const range = ref({
  start: null,
  end: null,
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

const { getBalootStatics, getBalootBookStatics, getMainApplicationStatics } = useStatics()
const { data: balootData, pending: balootPending, error: balootError, refresh: balootRefresh, status: balootStatus, fetchREQ: balootFetchREQ } = await getBalootStatics()
const { data: balootBookData, pending: balootBookPending, error: balootBookError, refresh: balootBookRefresh, status: balootBookStatus, fetchREQ: balootBookFetchREQ } = await getBalootBookStatics()
const { data: mainApplicationData, pending: mainApplicationPending, error: mainApplicationError, refresh: mainApplicationRefresh, status: mainApplicationStatus, execute: mainApplicationExecute } = await getMainApplicationStatics()

const search = () => {
  if (active.value == 'general') {
    mainApplicationExecute()
  } else {
    if (active.value == 'baloot') {
      balootFetchREQ(timeRange.value, range.value.start, range.value.end)
    } else if (active.value == 'rules') {
      refreshNuxtData('getRulesStatics')
    } else if (active.value == 'hand') {
      refreshNuxtData('getHandStatics')
    }
  }
}

watch(active, (newVal) => {
  if (newVal == 'baloot') {
    balootFetchREQ(timeRange.value, range.value.start, range.value.end)
  } else if (newVal == 'rules') {
    balootBookFetchREQ(timeRange.value, range.value.start, range.value.end)
  } else if (newVal == 'general') {
    mainApplicationExecute()
  }
  else if (newVal == 'hand') {
    // mainApplicationExecute()
  }
}, { immediate: true })



</script>

<style>
.rtl {
  direction: rtl;
}
</style>
