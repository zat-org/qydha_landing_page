<template>
    <Stream />
</template>

<script lang="ts" setup>
// Only Streamers and Admins can access streaming
definePageMeta({
    middleware: ['auth', 'role'],
    requiredRoles: ['Streamer', 'SuperAdmin', 'StaffAdmin']
})
</script>

<style></style>