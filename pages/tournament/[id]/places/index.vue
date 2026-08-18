<template>
  <TournamentPlaces />
</template>

<script lang="ts" setup>
import TournamentPlaces from "~/features/tournament/places/components/TournamentPlaces.vue";

definePageMeta({
  middleware: ["auth", "role"],
  requiredRoles: ["StaffAdmin", "SuperAdmin", "Organizer"],
});

useHead({
  title: "أماكن البطولة",
  meta: [
    { name: "description", content: "أماكن البطولة" },
    { property: "og:title", content: "قيدها |Qydha" },
    { property: "og:image", content: "/images/preview.PNG" },
  ],
});
</script>
