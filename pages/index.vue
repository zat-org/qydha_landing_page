<template>
    <div class="flex flex-col px-5 gap-[120px] mb-10 max-w-7xl mx-auto">
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

// Add smooth scroll behavior
onMounted(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
})

// Color mode composable
const colorMode = useColorMode()
</script>

<style scoped>
/* Add smooth transitions for all elements */
:deep(*) {
    transition: all 0.3s ease-in-out;
}

/* Add hover effects for interactive elements */
:deep(button:hover), :deep(a:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Add subtle background pattern */
:deep(body) {
    @apply bg-gray-50 dark:bg-gray-900;
    background-image: radial-gradient(var(--tw-gradient-stops));
    --tw-gradient-from: rgb(229 231 235 / 0.1);
    --tw-gradient-to: rgb(229 231 235 / 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-size: 20px 20px;
}

/* Dark mode background pattern */
:deep(.dark body) {
    --tw-gradient-from: rgb(75 85 99 / 0.1);
    --tw-gradient-to: rgb(75 85 99 / 0);
}
</style>