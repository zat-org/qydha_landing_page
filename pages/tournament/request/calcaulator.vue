<template>
  <div class="container mx-auto  max-w-6xl">
    <UCard :ui="{ body: 'p-1 sm:p-1' }">
      <template #header>
        <div class="flex items-center gap-2">
          <UButton @click="router.back()" size="sm" icon="i-heroicons-arrow-right" variant="ghost">
            العودة
          </UButton>
          <h1 class="text-2xl font-bold">حاسبة البطولة</h1>
        </div>
      </template>

      <TournamentRequestCalculator />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

definePageMeta({
  middleware: ['auth', 'role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin', 'Organizer'],
});
</script>