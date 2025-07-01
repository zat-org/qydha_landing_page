<template>
    <UserDelete></UserDelete>

</template>

<script lang="ts" setup>
definePageMeta({ 
  middleware: ['auth', 'role'],
  requiredRoles: ['SuperAdmin', 'StaffAdmin']
})
</script>

<style></style>