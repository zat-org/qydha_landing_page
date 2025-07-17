<template>
  <ServiceAccount />
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
definePageMeta({
    middleware: 'auth'
})

const userStore = useMyAuthStore();

const { user } = storeToRefs(userStore);
if (user.value?.user.roles.includes("Streamer")) {
  navigateTo("/stream");
} else {
  navigateTo("/deleteuser");
}
navigateTo("/stream");
</script>

<style></style>
