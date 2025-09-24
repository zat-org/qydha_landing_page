<template>
    <div class="min-h-[100px] max-h-[66vh] w-[99%] p-2  flex flex-col gap-4 h-full overflow-y-auto ">
        <Loading v-if="status == 'pending'" />
        <template v-else>
            <UCard>
                <template #header> عدد الصكات المتوسطة للمستخدم </template>
                <ApexChart :type="GameUserChartType" :options="{ ...defaultChartOptions, ...GameUsersOptions }"
                    height="300" :series="GameUsersSeries" />
            </UCard>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard>
                    <template #header>
                        <h2 class="text-lg font-bold"> عدد الالعاب </h2>
                    </template>
                    <div class="flex justify-center items-center h-full">
                        <p class="text-2xl font-bold"> {{ totalGames.toLocaleString() }} </p>
                    </div>
                </UCard>
                <UCard>
                    <template #header>
                        <h2 class="text-lg font-bold"> متوسط عدد الصكات ل{{ numberOfUsers.toLocaleString() }} مستخدمين
                        </h2>
                    </template>
                    <div class="flex justify-center items-center h-full">
                        <div class="flex flex-col items-center gap-2">
                            <p v-if="averageSakkasPerUser" class="text-2xl font-bold"> {{
                                Math.round(averageSakkasPerUser).toLocaleString() }} صكة </p>
                        </div>
                    </div>
                </UCard>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard>
                    <template #header>
                        <h2 class="text-lg font-bold"> نسبة عدد الصكات في الالعاب </h2>
                    </template>
                    <ApexChart type="pie" :options="{ ...defaultChartOptions, ...SakkasCountOptions }" height="200"
                        :series="SakkasCountSeries" />
                </UCard>


                <UCard>
                    <template #header>
                        <h2 class="text-lg font-bold"> احصائيات الصكات المكتملة و غير المكتملة</h2>
                    </template>
                    <ApexChart type="pie" :options="{ ...defaultChartOptions, ...completeSakkaChartOptions }"
                        height="200" :series="completeSakkaSeries" />
                </UCard>


            </div>



            <UCard>
                <template #header>
                    <h2 class="text-lg font-bold">إعدادات البلوت</h2>
                </template>
                <ApexChart type="bar" stacked="true"
                    :options="{ ...defaultChartOptions, ...BalootSettingsChartOptions }" height="200"
                    :series="BalootSettingsSeries" />
            </UCard>

            <UCard>
                <template #header>
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-bold">المواقع المختلفة للبلوت</h2>
                        <USelect v-model="selectedCountry" :items="counteries" class="w-[200px]" />
                    </div>
                </template>
                <div class="flex gap-8 justify-between">
                    <!-- <ApexChart dir="rtl" type="bar" :options="{ ...defaultChartOptions, ...gameLocationChartOptions }"
                     :series="gameLocationChartSeries"  class="w-[50%] " height="500"/> -->
                    <!-- {{sortedCities}} -->
                    <div class="flex flex-col gap-4 flex-1 ">
                        <UTable :data="sortedCities" ref="table" :columns="columns" v-model:pagination="pagination"
                            :pagination-options="{
                                getPaginationRowModel: getPaginationRowModel()
                            }" />
                        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                            :total="table?.tableApi?.getFilteredRowModel().rows.length"
                            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
                    </div>




                    <MapStatics :balootGamesCountWithLocation="sortedCities ?? []" class="w-[50%] flex-1" />
                </div>

            </UCard>

        </template>




    </div>

</template>

<script async setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'

const table = useTemplateRef('table')
const props = defineProps<{
    type: "day" | "week" | "month" | "year" | "custom"
    startDate: Date | null
    endDate: Date | null
}>()


const { getBalootStatics } = useStatics()
const { data, pending, error, refresh, status, fetchREQ } = await getBalootStatics()
watch(() => [props.type, props.startDate, props.endDate], () => {
    if (props.startDate && props.endDate) {
        fetchREQ(props.type, props.startDate, props.endDate)
    }
}, { immediate: true })

const colorMode = useColorMode()
const defaults = inject('ApexChartOptions') as any

// Computed properties for better data organization
const totalGames = computed(() => data.value?.data?.gamesCount?.gamesCount || 0)

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

// settings 
const BalootSettingsChartOptions = computed(() => ({

    chart: {
        stacked: true
    },
    xaxis: {
        categories: ['الصوت', 'التعليقات', 'الصكات المشدودة', 'التسجيل المتقدم', 'النشرة المقلوبة'],
        labels: {
            style: {
                fontSize: '16px',
            }
        }

    }
}))

const BalootSettingsSeries = computed(() => {
    return [
        {
            name: 'تعطيل',
            data: [
                data.value?.data?.balootSettings?.numbersSoundDisabled || 0,
                data.value?.data?.balootSettings?.commentsSoundDisabled || 0,
                data.value?.data?.balootSettings?.sakkahMashdodahDisabled || 0,
                data.value?.data?.balootSettings?.advancedRecordingDisabled || 0,
                data.value?.data?.balootSettings?.flippedDisabled || 0
            ]
        },
        {
            name: 'تفعيل',
            data: [
                data.value?.data?.balootSettings?.numbersSoundEnabled || 0,
                data.value?.data?.balootSettings?.commentsSoundEnabled || 0,
                data.value?.data?.balootSettings?.sakkahMashdodahEnabled || 0,
                data.value?.data?.balootSettings?.advancedRecordingEnabled || 0,
                data.value?.data?.balootSettings?.flippedEnabled || 0
            ]
        }
    ]

})

const completeSakkaChartOptions = computed(() => ({
    labels: ['الصكات المكتملة', 'الصكات غير المكتملة']
}))
const completedSakkas = computed(() => data.value?.data?.sakkasFinishedStats?.finishedCount || 0)
const incompleteSakkas = computed(() => data.value?.data?.sakkasFinishedStats?.notFinishedCount || 0)
const completeSakkaSeries = computed(() => [completedSakkas.value, incompleteSakkas.value])


const SakkasCountSeries = computed(() => {
    return data.value?.data?.sakkasCountPercentage?.map(x => x.percentage) || []
})

const SakkasCountOptions = computed(() => ({

    labels: data.value?.data?.sakkasCountPercentage?.map(x => `صكه ${x.maxSakkaPerGame}`) || [],

    legend: {
        position: 'bottom'
    }
}))



const numberOfUsers = computed(() => data.value?.data?.averageSakkasPerUser?.length || 0)
const averageSakkasPerUser = computed(() => {
    if (data.value?.data?.averageSakkasPerUser)
        return data.value?.data?.averageSakkasPerUser?.reduce((acc, ele) => acc + ele.sakkaCount, 0) / numberOfUsers.value || 0
})


// game users
const GameUsersSeries = computed(() => {
    const stats = data.value?.data?.gameUsersStatistics || []
    return [
        {
            name: 'الأجهزة',
            data: stats.map(x => [x.createdAt, x.devicesCount])
        },
        {
            name: 'المستخدمين',
            data: stats.map(x => [x.createdAt, x.usersCount])
        },
        {
            name: 'مباريات مجهولة',
            data: stats.map(x => [x.createdAt, x.anonymousGamesCount])
        },
        {
            name: 'مباريات مسجلة',
            data: stats.map(x => [x.createdAt, x.registeredUserGamesCount])
        },
        {
            name: 'مباريات أخرى',
            data: stats.map(x => [x.createdAt, x.anotherGamesCount])
        }
    ]
})

const GameUsersStats = computed(() => data.value?.data?.gameUsersStatistics || [])
const GameUserChartType = computed(() => GameUsersStats.value.length <= 1 ? 'bar' : 'line')
const GameUsersOptions = computed(() => ({
    chart: {
        type: GameUserChartType.value,
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: "MM-yy",
                day: 'dd MMM',
            },
            style: {
                fontSize: '14px'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '14px'
            }
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },

    legend: {
        position: 'bottom'
    },

    tooltip: {
        x: { format: 'dd MMM yyyy' }
    }
}))
//  location 
const counteries = computed(() => {

    let result = data.value?.data?.balootGamesCountWithLocation.map(c => {
        return c.countryName
    }) ?? []
    let unique = [...new Set(result)]
    unique.unshift('جميع الدول')
    return unique
}
)

const selectedCountry = ref<string>('جميع الدول')
const sortedCities = computed(() => data.value?.data?.balootGamesCountWithLocation.filter(c => selectedCountry.value !== 'جميع الدول' ? c.countryName === selectedCountry.value : true).sort((a, b) => b.gamesCount - a.gamesCount) ?? []);
watch(selectedCountry, () => {
    table.value?.tableApi?.setPageIndex(0)
})
const pagination = ref({
    pageIndex: 0,
    pageSize: 10
})
const columns = [
    {
        accessorKey: 'countryName',
        header: 'الدولة'
    }, {
        accessorKey: 'cityName',
        header: 'المدينة'
    },
    {
        accessorKey: 'gamesCount',
        header: 'عدد الالعاب'
    }]


</script>

<style scoped></style>
