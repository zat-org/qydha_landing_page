<template>
    <div class="flex flex-col px-5 gap-[180px] mb-10">
        <HomeHero />
        <HomeCalculators />
        <HomeStatistics />
        <HomeDownload />
        <HomeFeatures />
        <HomeSubscription />
        <HomeClients />
        <HomeBlogs />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "landing"
})
</script>

<style scoped></style>