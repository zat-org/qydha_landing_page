<template>
    <div class="flex flex-col gap-4">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard>
                <div class="flex flex-col items-center p-4">
                    <div class="text-3xl font-bold mb-2">{{ data?.data?.allUsers || 0 }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">إجمالي المستخدمين</div>
                </div>
            </UCard>
            <UCard>
                <div class="flex flex-col items-center p-4">
                    <div class="text-3xl font-bold mb-2">{{ data?.data?.registeredUsers || 0 }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مستخدمين مسجلين</div>
                </div>
            </UCard>


            <UCard>
                <div class="flex flex-col items-center p-4">
                    <div class="text-3xl font-bold mb-2">{{ (data?.data?.allUsers || 0) -
                        (data?.data?.registeredUsers || 0) }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مستخدمين غير مسجلين</div>
                </div>
            </UCard>
        </div>

        <ApexChart type="pie" :options="{ ...defaults, ...chartOptions }" :series="series" height="300" />


    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { getMainApplicationStatics } = useStatics()
const { data, pending, error, refresh, status } = await getMainApplicationStatics()
const series = computed(() => {
    if (data.value?.data) {
        return [data.value?.data.registeredUsers, data.value?.data.allUsers - data.value?.data.registeredUsers]
    }
    return [0, 0]
})

const defaults = inject('ApexChartOptions') as any;
const chartOptions = computed(() => {
    return {
        theme: {
            palette: 'palette1',
            mode: colorMode.value === 'dark' ? 'dark' : 'light'
        },
        labels: ['مستخدمين مسجلين', 'مستخدمين غير مسجلين'],

    }
})


</script>
<style scoped></style>