<template>
  <section class="space-y-10">
    <HomeHero />
    <LazyHomeTournamentSection />
    <LazyHomeCalculators />
    <LazyHomeStatistics />
    <LazyHomeDownload />
    <LazyHomeFeatures />
    <LazyHomeClients />
    <LazyHomeBlogs />
  </section>
</template>

<script setup lang="ts">
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
