<template>
  <UCard
    :ui="{
      body: 'flex-none overflow-visible px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
      root: 'h-auto flex-none overflow-visible',
    }"
    class="mx-auto w-full max-w-7xl bg-gray-50 dark:bg-gray-900"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-2xl">
          جوائز البطولة
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          حدّد جوائز المراكز الفائزة في البطولة
        </p>
      </div>
    </template>

    <UForm :state="model" class="flex flex-col space-y-4">
      <TournamentRequestFormTourDetailFormPrizeManagement v-model="model" />
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import TournamentRequestFormTourDetailFormPrizeManagement from "~/features/tournament/request/components/Form/TourDetailForm/PrizeManagement.vue";

defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const model = defineModel<any>({ required: true });
</script>
