<template>
  <div class="p-4 space-y-6">
    <!-- Header with Controls -->
    <UCard>
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Time Range Controls -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <UFormField label="الفترة" name="timeRange">
            <USelect v-model="timeRange" :items="timeOptions" class="min-w-[120px]" />
          </UFormField>
          
          <VDatePicker 
            v-model.range="range" 
            dir="ltr" 
            :masks="{ input: 'DD-MM-YYYY' }" 
            locale="ar"
            :isDark="colorMode.value == 'dark'"
          >
            <template #default="{ inputValue, inputEvents }">
              <div class="flex items-center gap-2" v-show="timeRange == 'custom'">
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

        <!-- Category Filter -->
        <USelectMenu 
          v-model="selectedCategories" 
          :options="categoryOptions" 
          multiple 
          placeholder="اختر الفئات"
          class="min-w-[200px]"
        />
      </div>
    </UCard>

    <!-- Dynamic Grid Layout -->
    <div class="grid gap-6" :class="gridClasses">
      <!-- General Statistics -->
      <UCard v-if="selectedCategories.includes('general')" class="lg:col-span-2">
        <template #header>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
            الإحصائيات العامة
          </h2>
        </template>
        <StatisticsGeneral />
      </UCard>

      <!-- Baloot Statistics -->
      <UCard v-if="selectedCategories.includes('baloot')" class="lg:col-span-3">
        <template #header>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-puzzle-piece" class="w-5 h-5" />
            إحصائيات البلوت
          </h2>
        </template>
        <StatisticsBalootImproved 
          :type="timeRange" 
          :startDate="range.start" 
          :endDate="range.end" 
        />
      </UCard>

      <!-- Hand Statistics Placeholder -->
      <UCard v-if="selectedCategories.includes('hand')" class="lg:col-span-2">
        <template #header>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-hand-raised" class="w-5 h-5" />
            إحصائيات الهند
          </h2>
        </template>
        <div class="text-center py-12">
          <UIcon name="i-heroicons-clock" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p class="text-gray-500 dark:text-gray-400 text-lg">قريبا</p>
        </div>
      </UCard>

      <!-- Rules Statistics Placeholder -->
      <UCard v-if="selectedCategories.includes('rules')" class="lg:col-span-1">
        <template #header>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
            إحصائيات القوانين
          </h2>
        </template>
        <div class="text-center py-12">
          <UIcon name="i-heroicons-clock" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p class="text-gray-500 dark:text-gray-400 text-lg">قريبا</p>
        </div>
      </UCard>
    </div>

    <!-- Additional Insights Section -->
    <div v-if="selectedCategories.length > 1" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold">الاتجاهات الأسبوعية</h3>
        </template>
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400">رسم بياني للاتجاهات</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">المقارنات</h3>
        </template>
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400">مقارنة البيانات</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">التوقعات</h3>
        </template>
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400">التوقعات المستقبلية</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()

const timeOptions = ref([
  { label: 'اليوم', value: 'day' },
  { label: 'الاسبوع', value: 'week' },
  { label: 'الشهر', value: 'month' },
  { label: 'السنة', value: 'year' },
  { label: 'المخصص', value: 'custom' },
])

const categoryOptions = ref([
  { label: 'العام', value: 'general' },
  { label: 'بلوت', value: 'baloot' },
  { label: 'الهند', value: 'hand' },
  { label: 'القوانين', value: 'rules' },
])

const range = ref({
  start: new Date(),
  end: new Date(),
})

const timeRange = ref<"day" | "week" | "month" | "year" | "custom">('day')
const selectedCategories = ref(['general', 'baloot'])

// Dynamic grid classes based on selected categories
const gridClasses = computed(() => {
  const count = selectedCategories.value.length
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 lg:grid-cols-2'
  if (count === 3) return 'grid-cols-1 lg:grid-cols-3'
  return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
})
</script>
</template>

