<template>


  <UCard class=" " :ui="{base:'flex flex-col  h-full mx-auto ',body:{base:'flex grow',padding:'sm:p-2 p-2'}}">
    
    
    <TournamentGetAll />
    
    <template #footer  v-if="user?.user.roles.includes('SuperAdmin') || user?.user.roles.includes('StaffAdmin')">  
      <UButton  label = "بطولة" icon="ic:baseline-plus"  to="/tournament/add"/>
    </template>
    <template #header>
      <h1 class="text-2xl">البطولات  </h1>
    </template>
  </UCard>



</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

definePageMeta({ middleware: 'auth' })
const userStore = useMyAuthStore()
const {user} = storeToRefs(userStore)

</script>

<style></style>