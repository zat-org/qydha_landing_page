<template>
    <div class="min-h-[100px] max-h-[66vh] w-[99%] p-2  flex flex-col gap-4 h-full overflow-y-auto ">
        <UCard>
            <template #header> عدد الصكات المتوسطة للمستخدم </template>
            <ApexChart type="line" :options="{ ...defaults, ...GameUsersOptions }" height="300"
                :series="GameUsersSeries" />
        </UCard>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
                <template #header>
                    <h2 class="text-lg font-bold"> عدد الالعاب </h2>
                </template>
                <div class="flex justify-center items-center h-full">
                    <p class="text-2xl font-bold"> {{ totalGames }} </p>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <h2 class="text-lg font-bold"> احصائيات الصكات المكتملة و غير المكتملة</h2>
                </template>
                <ApexChart type="pie" :options="{ ...defaults, ...completeSakkaChartOptions }" height="200"
                    :series="completeSakkaSeries" />
            </UCard>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
                <template #header>
                    <h2 class="text-lg font-bold">  نسبة عدد الصكات في الالعاب </h2>
                </template>
                <ApexChart type="pie" :options="{ ...defaults, ...SakkasCountOptions }" height="200"
                    :series="SakkasCountSeries" />
            </UCard>
            <UCard>
                <template #header>
                    <h2 class="text-lg font-bold"> عدد الصكات المتوسطة للمستخدم </h2>
                </template>
                <ApexChart type="pie" :options="{ ...defaults, ...AverageSakkasOptions }" height="200"
                    :series="AverageSakkasSeries" />
            </UCard>

        </div>




        

        <UCard>
            <template #header>
                <h2 class="text-lg font-bold">إعدادات البلوت</h2>
            </template>
            <ApexChart type="bar" stacked="true" :options="{ ...defaults, ...BalootSettingsChartOptions }" height="200"
                :series="BalootSettingsSeries" />
        </UCard>



    </div>

</template>

<script setup lang="ts">

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
const hasNoSakkaData = computed(() => completeSakkaSeries.value.every(item => item === 0))
const hasUserStats = computed(() => data.value?.data?.gameUsersStatistics?.length && data.value?.data?.gameUsersStatistics?.length > 0)

// settings 
const BalootSettingsChartOptions = computed(() => ({
    theme: {
        palette: 'palette1',
        mode: colorMode.value === 'dark' ? 'dark' : 'light'
    },
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



// compleet sakkas 
const completeSakkaChartOptions = computed(() => ({
    theme: {
        palette: 'palette1',
        mode: colorMode.value === 'dark' ? 'dark' : 'light'
    },
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


const AverageSakkasSeries = computed(() => {
    return [{
        name: 'عدد المستخدمين',
        data: data?.value?.data.averageSakkasPerUser?.map(x => x.usersCount) || []
    }]
})
const AverageSakkasOptions = computed(() => ({
    chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false }
    },
    plotOptions: {
        bar: {
            horizontal: false,    // 👈 ensures it's a vertical column chart
            // columnWidth: '50%',
            // borderRadius: 6
        }
    },
    // dataLabels: {
    //     enabled: true,
    //     style: { fontSize: '14px', fontWeight: 'bold' }
    // },
    xaxis: {
        categories: data.value?.data?.averageSakkasPerUser?.map(x => ` ${x.sakkaCount}`) || [],
        title: { text: 'عدد الصكات لكل مستخدم' },
        labels: { style: { fontSize: '14px' } }
    },
    yaxis: {
        title: { text: 'عدد المستخدمين' },
        labels: { style: { fontSize: '14px' } }
    },
    // tooltip: {
    //     y: {
    //         formatter: (val: number) => `${val} مستخدم`
    //     }
    // },
    // legend: {
    //     show: false
    // }
}))



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

const GameUsersOptions = computed(() => ({

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


</script>

<style scoped></style>
