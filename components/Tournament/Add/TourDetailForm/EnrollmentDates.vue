<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">تواريخ التسجيل</h3>
    
    <UFormField label="بداية تسجيل اللاعبين في البطولة" name="TournamentStartEnrolmmentDate">
      <UInput 
        v-model="modelValue.TournamentStartEnrolmmentDate" 
        placeholder="بداية تسجيل اللاعبين في البطولة"
        type="date" 
      />
    </UFormField>

    <UFormField label="نهاية تسجيل اللاعبين في البطولة" name="TournamentEndEnrolmmentDate">
      <UInput 
        v-model="modelValue.TournamentEndEnrolmmentDate" 
        placeholder="نهاية تسجيل اللاعبين في البطولة"
        type="date" 
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface EnrollmentDates {
  TournamentStartEnrolmmentDate: string;
  TournamentEndEnrolmmentDate: string;
}

const props = defineProps<{
  modelValue: EnrollmentDates;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: EnrollmentDates];
}>();
</script> 