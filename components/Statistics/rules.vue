<template>
    <Loading v-if="status == 'pending'" />
    <UCard v-else>
        <template #header>
            <h2 class="text-lg font-bold">إحصائيات القوانين</h2>
        </template>
        <div class="flex flex-col gap-4">

            <div class="text-lg font-bold">
                مدة القراءة الكلية :
                {{ BalootBookElapsedTimeHMS }}
            </div>

            <ApexChart type="pie" :options="{ ...defaultChartOptions, ...BalootBookInSakkaPeriodChartOptions }"
                height="200" :series="BalootBookInSakkaPeriodChartSeries" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { IBalootBookStatics } from '~/models/statics';

const props = defineProps<{
    data: IBalootBookStatics,
    status: string,
    type: "day" | "week" | "month" | "year" | "custom"
    startDate: Date | null
    endDate: Date | null
}>()

const { getBalootBookStatics } = useStatics()
const { data, pending, error, refresh, status, fetchREQ } = await getBalootBookStatics()
// watch(() => [props.type, props.startDate, props.endDate], () => {
//     if (props.startDate && props.endDate) {
//         fetchREQ(props.type, props.startDate, props.endDate)
//     }
// }, { immediate: true })
const colorMode = useColorMode()
onMounted(() => {
    fetchREQ(props.type, props.startDate, props.endDate)
})

const defaults = inject('ApexChartOptions') as any
const BalootBookElapsedTime = computed(() => {
    const totalSeconds = data.value?.data.balootBookElapsedTime
        ? data.value?.data.balootBookElapsedTime.reduce((acc: number, ele: any) => acc + parseInt(ele.elapsedTime), 0)
        : 0
    return Number.isFinite(totalSeconds) ? totalSeconds : 0
})

const BalootBookElapsedTimeHMS = computed(() => {
    const totalSeconds = BalootBookElapsedTime.value || 0
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})
const defaultChartOptions = computed(() => ({
    ...defaults,
    chart: {
        // foreColor: colorMode.value === 'dark' ? '#fff' : '#000',
    },
    theme: {
        palette: 'palette1',
        mode: colorMode.value === 'dark' ? 'dark' : 'light'
    },
    tooltip: {
        style: {
            color: '#000' // 👈 Makes overlay data labels black
        }
    }
}))
const BalootBookInSakkaPeriodChartSeries = computed(() => [
    data.value?.data.balootBookInSakkaPeriod.start,
    data.value?.data.balootBookInSakkaPeriod.middle,
    data.value?.data.balootBookInSakkaPeriod.end
])

const BalootBookInSakkaPeriodChartOptions = {
    chart: {
        type: "pie"
    },
    labels: ["بداية ", "منتصف ", "نهاية "],
    legend: {
        position: "bottom"
    },
    dataLabels: {
        enabled: true
    }
}


</script>

<style scoped></style>