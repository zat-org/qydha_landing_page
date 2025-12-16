<template>
  <div class="space-y-1">
    <!-- Input Fields Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UFormField label="عدد الفرق" name="teamsCount">
        <UInput v-model="teamsCount" type="number" min="1" placeholder="أدخل عدد الفرق" size="xs" />
      </UFormField>

      <UFormField label="عدد الطاولات" name="tablesCount">
        <UInput v-model="tablesCount" type="number" min="1" placeholder="أدخل عدد الطاولات" size="xs" />
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
    const teamsCount = defineModel<number>('teamsCount',{ required: true })
    const tablesCount = defineModel<number>('tablesCount',{ required: true })
    const dayNumber = defineModel<number>('dayNumber',{ required: true })
    const sakkTime = defineModel<number>('sakkTime',{ required: true })
    const sakkTime3 = defineModel<number>('sakkTime3',{ required: true })
    const sakkTime5 = defineModel<number>('sakkTime5',{ required: true })



</script>


