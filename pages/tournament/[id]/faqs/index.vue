<template>
  <TournamentQaManagement />
</template>

<script lang="ts" setup>
import { TournamentQaManagement } from "~/features/tournament/qa";

definePageMeta({
  middleware: ["auth", "role"],
  requiredRoles: ["StaffAdmin", "SuperAdmin", "Organizer"],
});

useHead({
  title: "الأسئلة",
  meta: [
    { name: "description", content: "إدارة أسئلة البطولة" },
    { property: "og:title", content: "قيدها |Qydha" },
    { property: "og:image", content: "/images/preview.PNG" },
  ],
});
</script>
