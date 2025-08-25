<template>
  <UserSingle :id="id!"></UserSingle>
  <!-- <UserDelete></UserDelete> -->

</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth'] })
import { useMyAuthStore } from '~/store/Auth'
const authuser = useMyAuthStore()
const id = ref(authuser.user?.user.id)
useHead({
  title: 'الصفحة الشخصية',
  meta: [
    { name: 'description', content: 'الصفحة الشخصية' }
  ]
})

</script>

<style></style>