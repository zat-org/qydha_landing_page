<template>
  <section class="space-y-10 ">

    <Hero />
    <TournamentSection />
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
import TournamentSection from '~/components/Home/TournamentSection.vue'
import Subscription from '~/components/Home/Subscription.vue'
import Clients from '~/components/Home/Clients.vue'
import Blogs from '~/components/Home/Blogs.vue'
const { logo, title, description } = useRuntimeConfig().public


useSeoMeta({
  ogImage: logo,
  twitterTitle: title as string,
  twitterDescription: description as string,
  twitterImage: logo as string
})

useHead({
  link: [
    {
      rel: 'icon',
      href: '/favicon.icon'
    }
  ]
})

definePageMeta({
  layout: "landing"
})
useHead({
  title: 'الرئيسية',
  meta: [
    { name: 'description', content: 'الرئيسية' },
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}

  ]
})
</script>
