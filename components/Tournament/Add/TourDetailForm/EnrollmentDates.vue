<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">تواريخ التسجيل</h3>
    
    <UFormField label="بداية تسجيل اللاعبين في البطولة" name="TournamentStartEnrolmmentDate">
      <UInput 
        v-model="model.TournamentStartEnrolmmentDate" 
        placeholder="بداية تسجيل اللاعبين في البطولة"
        type="date" 
      />
    </UFormField>

    <UFormField label="نهاية تسجيل اللاعبين في البطولة" name="TournamentEndEnrolmmentDate">
      <UInput 
        v-model="model.TournamentEndEnrolmmentDate" 
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

const model = defineModel<EnrollmentDates>({required:true})

</script> 