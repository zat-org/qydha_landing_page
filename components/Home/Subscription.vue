<template>
  <section id="subscriptions" class="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-2xl relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-left opacity-10 dark:opacity-10" data-aos="fade-right" data-aos-duration="400" data-aos-once="true"></div>
    <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-right opacity-10 dark:opacity-10" data-aos="fade-left" data-aos-duration="400" data-aos-once="true"></div>

    <div class="container mx-auto px-4 relative z-10">
      <h2 class="text-2xl sm:text-3xl font-bold mb-3" 
          data-aos="fade-down" 
          data-aos-duration="400"
          data-aos-once="true">
        <span class="bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
          عروض مميزه على الباقات لاتفوتك 
        </span>
      </h2>
      <p class="text-lg text-gray-800 dark:text-gray-300 mb-8" 
         data-aos="fade-down" 
         data-aos-duration="400"
         data-aos-delay="100"
         data-aos-once="true">
        احصل على افضل العروض
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Monthly Plan -->
        <UCard
          data-aos="fade-up"
          data-aos-duration="400"
          data-aos-delay="200"
          data-aos-once="true"
          class="hover-scale"
          :ui="{
            base: 'h-full',
            background: 'bg-white dark:bg-white/10 backdrop-blur-sm',
            ring: 'ring-0',
            divide: 'divide-gray-200 dark:divide-white/10',
            header: {
              base: 'border-b border-gray-200 dark:border-white/10 p-4',
              padding: 'py-4 px-6'
            },
            body: {
              base: 'p-4',
              padding: 'py-6 px-6'
            }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-amber-700 dark:text-white">الباقة الشهرية</h3>
              <UBadge color="amber" class="text-sm">30 يوم</UBadge>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-amber-700 dark:text-white mb-6">9.99 ريال</p>
            <ul class="space-y-3 text-right">
              <li v-for="(feature, index) in features" :key="index"
                  class="flex items-center gap-2 text-gray-800 dark:text-gray-200"
                  :data-aos="'fade-right'"
                  :data-aos-duration="400"
                  :data-aos-delay="300 + (index * 50)"
                  data-aos-once="true">
                <UIcon name="i-heroicons-check-circle" class="text-primary-500 flex-shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </UCard>

        <!-- Quarterly Plan -->
        <UCard
          data-aos="fade-up"
          data-aos-duration="400"
          data-aos-delay="300"
          data-aos-once="true"
          class="hover-scale"
          :ui="{
            base: 'h-full',
            background: 'bg-gradient-to-br from-amber-500 to-amber-600 dark:bg-gradient-brand',
            ring: 'ring-0',
            divide: 'divide-gray-800/10',
            header: {
              base: 'border-b border-gray-800/10 p-4',
              padding: 'py-4 px-6'
            },
            body: {
              base: 'p-4',
              padding: 'py-6 px-6'
            }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">الباقة الربع سنوية</h3>
              <UBadge color="amber" class="text-sm">90 يوم</UBadge>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-6">24.99 ريال</p>
            <ul class="space-y-3 text-right">
              <li v-for="(feature, index) in features" :key="index"
                  class="flex items-center gap-2 text-gray-800 dark:text-white/90"
                  :data-aos="'fade-right'"
                  :data-aos-duration="400"
                  :data-aos-delay="300 + (index * 50)"
                  data-aos-once="true">
                <UIcon name="i-heroicons-check-circle" class="text-gray-900 dark:text-white flex-shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </UCard>

        <!-- Yearly Plan -->
        <UCard
          data-aos="fade-up"
          data-aos-duration="400"
          data-aos-delay="400"
          data-aos-once="true"
          class="hover-scale"
          :ui="{
            base: 'h-full',
            background: 'bg-white dark:bg-white/10 backdrop-blur-sm',
            ring: 'ring-0',
            divide: 'divide-gray-200 dark:divide-white/10',
            header: {
              base: 'border-b border-gray-200 dark:border-white/10 p-4',
              padding: 'py-4 px-6'
            },
            body: {
              base: 'p-4',
              padding: 'py-6 px-6'
            }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-amber-700 dark:text-white">الباقة السنوية</h3>
              <UBadge color="amber" class="text-sm">360 يوم</UBadge>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-amber-700 dark:text-white mb-6">99.99 ريال</p>
            <ul class="space-y-3 text-right">
              <li v-for="(feature, index) in features" :key="index"
                  class="flex items-center gap-2 text-gray-800 dark:text-gray-200"
                  :data-aos="'fade-right'"
                  :data-aos-duration="400"
                  :data-aos-delay="300 + (index * 50)"
                  data-aos-once="true">
                <UIcon name="i-heroicons-check-circle" class="text-primary-500 flex-shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  'كتيب قوانين البلوت',
  'التسجيل المتقدم',
  'ازالة الاعلانات',
  'ارشيف العابك',
  'احصائيات دقيقة عن ادائك',
  'اسأل حكام قيدها في اى وقت ويحلون هوشتكم'
]
</script>

<style scoped>
@media (max-width: 640px) {
  #subscriptions {
    border-radius: 1rem;
  }
}
</style>
