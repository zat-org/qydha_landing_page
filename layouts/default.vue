<template>
  <DashboardHeader></DashboardHeader>
<Suspense>
  <template #default>
    <main class="flex flex-1 mx-auto w-full p-[var(--spacing-xs)]">
      <slot></slot>
    </main>
     </template>
     <template #fallback >
      loading 
     </template>
</Suspense>
</template>

<script lang="ts" setup>

</script>

<style></style>