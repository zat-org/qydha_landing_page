<template>
  <div dir="rtl" lang="ar" class="flex flex-col min-h-screen bg-gray-100 text-[#222751] overflow-hidden">
    <Header/>
    <main class="grow w-full relative">
      <NuxtPage />
    </main>
    <Footer/>
  </div>
</template>
<script setup lang="ts">
import Header from './components/global/Header.vue';
import Footer from './components/global/Footer.vue';
</script>
<style></style>
