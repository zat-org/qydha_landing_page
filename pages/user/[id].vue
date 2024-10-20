<template>
  <UserSingle  :id="id"/>
</template>

<script lang="ts" setup>
const route =useRoute()
const id  =route.params.id.toString()
</script>

<style>

</style>