<template>
  <ServiceAccount />
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
definePageMeta({
    middleware: 'auth'
})
useHead({
  title:'الحسابات الخدمية',
  meta:[
    {name:'description',content:'الحسابات الخدمية'}
  ]
})
</script>

<style></style>
