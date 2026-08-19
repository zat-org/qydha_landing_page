<template>
  <div />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth", "role"],
  requiredRoles: ["StaffAdmin", "SuperAdmin", "Organizer"],
});

const route = useRoute();
const tour_id = String(route.params.id ?? "");

await navigateTo(`/tournament/${tour_id}/places`, { replace: true });
</script>
