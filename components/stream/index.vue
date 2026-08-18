<template>
  <div class="flex flex-col gap-6">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          البث
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          روابط لوحات البلوت والهند، وإدارة صور وأسماء اللاعبين للعرض
        </p>
      </div>
      <UButton
        label="إدارة اللاعبين"
        color="primary"
        variant="soft"
        size="lg"
        icon="i-heroicons-user-group"
        trailing-icon="i-heroicons-arrow-left"
        to="/players"
      />
    </div>

    <UTabs :items="items" dir="rtl">
      <template #baloot>
        <StreamBalootTab />
      </template>
      <template #hand>
        <StreamHandTab />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
const items = [
  {
    label: "بلوت ",
    slot: "baloot" as const,
  },
  {
    label: "هند ",
    slot: "hand" as const,
  },
];
</script>
