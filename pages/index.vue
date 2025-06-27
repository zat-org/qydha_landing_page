<template>
    <section class="space-y-10">

        <Hero />
        <Calculators />
        <Statistics />
        <Download />
        <Features />
        <Subscription />
        <Clients />
        <Blogs />
    </section>
</template>

<script setup lang="ts">
import Hero from '~/components/Home/Hero.vue'
import Calculators from '~/components/Home/Calculators.vue'
import Statistics from '~/components/Home/Statistics.vue'
import Download from '~/components/Home/Download.vue'
import Features from '~/components/Home/Features.vue'
import Subscription from '~/components/Home/Subscription.vue'
import Clients from '~/components/Home/Clients.vue'
import Blogs from '~/components/Home/Blogs.vue'


definePageMeta({
    layout: "landing"
})

</script>

