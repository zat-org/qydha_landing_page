<template>
    <div class="container mx-auto  max-w-6xl">
        <UCard :ui="{body:'p-1 sm:p-1'}">
            <template #header>
                <div class="flex items-center gap-2">
                    <UButton @click="router.back()" size="sm" icon="i-heroicons-arrow-right" variant="ghost">
                        العودة
                    </UButton>
                    <h1 class="text-2xl font-bold">حاسبة البطولة</h1>
                </div>
            </template>

            <div class="space-y-1">
                <!-- Input Fields Section -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UFormField label="عدد الفرق" name="teamsCount">
                        <UInput 
                            v-model="teamsCount" 
                            type="number" 
                            min="1"
                            placeholder="أدخل عدد الفرق"
                            size="xs"
                        />
                    </UFormField>

                    <UFormField label="عدد الطاولات" name="tablesCount">
                        <UInput 
                            v-model="tablesCount" 
                            type="number" 
                            min="1"
                            placeholder="أدخل عدد الطاولات"
                            size="xs"
                        />
                    </UFormField>
                </div>

                <!-- Sakka Time Inputs -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime">
                        <UInput 
                            v-model="sakkTime" 
                            type="number" 
                            min="1"
                            placeholder="وقت صكة واحدة"
                            size="xs"
                        />
                    </UFormField>

                    <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3">
                        <UInput 
                            v-model="sakkTime3" 
                            type="number" 
                            min="1"
                            placeholder="وقت 3 صكات"
                            size="xs"
                        />
                    </UFormField>

                    <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5">
                        <UInput 
                            v-model="sakkTime5" 
                            type="number" 
                            min="1"
                            placeholder="وقت 5 صكات"
                            size="xs"
                        />
                    </UFormField>
                </div>

                <!-- Total Time Summary -->
          

                <!-- Rounds List -->
                <div v-if="rounds.length > 0" class="space-y-1 h-[50vh] overflow-y-auto px-1">
                    <h2 class="text-xl font-semibold ">الأدوار</h2>
                    <div class="grid grid-cols-1 gap-3">
                        <UCard 
                        :ui="{body:'p-1 sm:p-1'}"
                            v-for="(round, index) in rounds" 
                            :key="round.id"
                            class="hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center justify-between gap-4 ">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3">
                                        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold">
                                            {{ round.id }}
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-lg">{{ round.name }}</h3>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                                {{ round.matches }} مباراة
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-4">
                                    <div class="text-center">
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">عدد الصكات</p>
                                        <USelect
                                            v-model="round.sakkanumber"
                                            :items="sakkaOptions"
                                            label-key="label"
                                            value-key="value"
                                            size="sm"
                                            class="w-24"
                                        />
                                    </div>

                                    <div class="text-center min-w-[100px]">
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">الوقت</p>
                                        <p class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                            {{ formatTime(round.Time) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>

                <div v-if="rounds.length > 0" class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الوقت</p>
                            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {{ formatTime(totalTime) }}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600 dark:text-gray-400">عدد الأدوار</p>
                            <p class="text-2xl font-semibold">{{ rounds.length }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600 dark:text-gray-400">عدد المباريات</p>
                            <p class="text-2xl font-semibold">{{ totalMatches }}</p>
                        </div>

                    </div>
                </div>
                <!-- Empty State -->
                <div v-else class="text-center py-12">
                    <div class="text-gray-400 dark:text-gray-600 mb-4">
                        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400">أدخل عدد الفرق والطاولات لعرض الأدوار</p>
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const { rounds, teamsCount, tablesCount, sakkTime, sakkTime3, sakkTime5, totalTime , totalMatches } = useTourCalc();

const router = useRouter();

const sakkaOptions = [
    { label: '1', value: 1 },
    { label: '3', value: 3 },
    { label: '5', value: 5 }
];

const formatTime = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours} ساعة`;
    }
    return `${hours} ساعة و ${mins} دقيقة`;
};

definePageMeta({
    middleware: ['auth', 'role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin', 'Organizer'],
});
</script>