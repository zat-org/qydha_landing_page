<template>
  <UserPlayers />
</template>

<script lang="ts" setup>
import UserPlayers from "~/features/user/players/components/UserPlayers.vue";

definePageMeta({
  middleware: ["auth", "role"],
  requiredRoles: ["Streamer", "SuperAdmin", "StaffAdmin"],
});

useHead({
  title: "اللاعبين",
  meta: [
    { name: "description", content: "إدارة اللاعبين" },
    { property: "og:title", content: "قيدها |Qydha" },
    { property: "og:image", content: "/images/preview.PNG" },
  ],
});
</script>
