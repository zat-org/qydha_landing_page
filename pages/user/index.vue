<template>
    <keep-alive>
        <User />
    </keep-alive>
 
</template>

<script lang="ts" setup>
useHead({
  title:'المستخدمين',
  meta:[
    {name:'description',content:'المستخدمين'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})
</script>

<style>

</style>