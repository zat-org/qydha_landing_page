<template>
  <TournamentGetAll />
</template>

<script lang="ts" setup>

import { useMyAuthStore } from '~/store/Auth';
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
definePageMeta({
  layout: computed(() => userStore.logedin ? 'default' : 'landing')
})





// definePageMeta({ middleware: ['auth','role'],
//   requiredRoles: ['StaffAdmin', 'SuperAdmin'],
//  });
</script>

<style></style>
