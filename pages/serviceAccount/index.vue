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
    {name:'description',content:'الحسابات الخدمية'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})
</script>

<style></style>
