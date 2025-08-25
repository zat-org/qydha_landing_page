<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 text-center">

    <NuxtLink to="/" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      العودة إلى الصفحة الرئيسية
    </NuxtLink>
  </div>
</template>

<script setup>
useHead({
  title:'404',
  meta:[
    {name:'description',content:'404 page not found'}
  ]
})
</script> 