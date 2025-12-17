<template>
  <div class="space-y-1">
    <!-- Input Fields Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UFormField label="عدد الفرق" name="teamsCount">
        <USelect 
          v-model="teamsCountOption" 
          :items="TeamsCountOptions" 
          size="xs"
          placeholder="اختر عدد الفرق"
        />
        <UInput 
          v-if="teamsCountOption === 'custom'"
          v-model="teamsCount" 
          type="number" 
          min="1" 
          placeholder="أدخل عدد الفرق" 
          size="xs"
          class="mt-2"
        />
      </UFormField>

      <UFormField label="عدد الطاولات" name="tablesCount">
        <USelect 
          v-model="tablesCountOption" 
          :items="TablesCountOptions" 
          size="xs"
          placeholder="اختر عدد الطاولات"
        />
        <UInput 
          v-if="tablesCountOption === 'custom'"
          v-model="tablesCount" 
          type="number" 
          min="1" 
          placeholder="أدخل عدد الطاولات" 
          size="xs"
          class="mt-2"
        />
      </UFormField>

      <UFormField label="عدد الأيام" name="dayNumber">
        <UInput v-model="dayNumber" type="number" min="1" placeholder="أدخل عدد الأيام" size="xs" />
      </UFormField>
    </div>

    <!-- Sakka Time Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime">
        <UInput v-model="sakkTime" type="number" min="1" placeholder="وقت صكة واحدة" size="xs" />
      </UFormField>

      <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3">
        <UInput v-model="sakkTime3" type="number" min="1" placeholder="وقت 3 صكات" size="xs" />
      </UFormField>

      <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5">
        <UInput v-model="sakkTime5" type="number" min="1" placeholder="وقت 5 صكات" size="xs" />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const teamsCount = defineModel<number>('teamsCount',{ required: true })
const tablesCount = defineModel<number>('tablesCount',{ required: true })
const dayNumber = defineModel<number>('dayNumber',{ required: true })
const sakkTime = defineModel<number>('sakkTime',{ required: true })
const sakkTime3 = defineModel<number>('sakkTime3',{ required: true })
const sakkTime5 = defineModel<number>('sakkTime5',{ required: true })

const TeamsCountOptions = [
    {
        label: "16 فريق",
        value: 16,
    },
    {
        label: "32 فريق",
        value: 32,
    },
    {
        label: "64 فريق",
        value: 64,
    },
    {
        label: "128 فريق",
        value: 128,
    },
    {
        label: "عدد اخر",
        value: "custom"
    }
]

const TablesCountOptions = [
    {
        label: "2 طاولة",
        value: 2,
    },
    {
        label: "4 طاولات",
        value: 4,
    },
    {
        label: "8 طاولات",
        value: 8,
    },
    {
        label: "10 طاولات",
        value: 10,
    },
    {
        label: "عدد اخر",
        value: "custom"
    }
]

// Initialize selected options based on current model values
const getInitialTeamsOption = () => {
    if (teamsCount.value) {
        const option = TeamsCountOptions.find(opt => opt.value === teamsCount.value)
        return option ? option.value : 'custom'
    }
    return 'custom'
}

const getInitialTablesOption = () => {
    if (tablesCount.value) {
        const option = TablesCountOptions.find(opt => opt.value === tablesCount.value)
        return option ? option.value : 'custom'
    }
    return 'custom'
}

const teamsCountOption = ref<number | string>(getInitialTeamsOption())
const tablesCountOption = ref<number | string>(getInitialTablesOption())

// Watch teamsCountOption changes
watch(teamsCountOption, (newValue) => {
    if (newValue !== 'custom' && typeof newValue === 'number') {
        teamsCount.value = newValue
    }
})

// Watch tablesCountOption changes
watch(tablesCountOption, (newValue) => {
    if (newValue !== 'custom' && typeof newValue === 'number') {
        tablesCount.value = newValue
    }
})

// Watch external changes to teamsCount (if changed from parent)
watch(teamsCount, (newValue) => {
    const option = TeamsCountOptions.find(opt => opt.value === newValue)
    if (option && teamsCountOption.value !== option.value) {
        teamsCountOption.value = option.value
    } else if (!option && teamsCountOption.value !== 'custom') {
        teamsCountOption.value = 'custom'
    }
})

// Watch external changes to tablesCount (if changed from parent)
watch(tablesCount, (newValue) => {
    const option = TablesCountOptions.find(opt => opt.value === newValue)
    if (option && tablesCountOption.value !== option.value) {
        tablesCountOption.value = option.value
    } else if (!option && tablesCountOption.value !== 'custom') {
        tablesCountOption.value = 'custom'
    }
})

</script>


