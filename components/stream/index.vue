<template>
  
  <UTabs :items="items" dir="rtl" >
    <template #baloot>
      <BalootTab />
    </template>
    <template #hand>
      <HandTab />
    </template>
  </UTabs>


</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import BalootTab from "./BalootTab.vue";
import HandTab from "./handTab.vue";
const items = [
  {
  label:"بلوت ",
  slot:"baloot"as const ,
},
{
  label:"هند ",
  slot:"hand" as const,
}]



</script>

<style scoped>
/* Add any component-specific styles here */
</style>