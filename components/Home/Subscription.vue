<template>
  <section id="subscriptions" class="text-center">
    <h2 class="text-2xl" data-aos="fade-down" data-aos-delay="100">
      عروض مميزه على الباقات لاتفوتك 👍🏻
    </h2>
    <p class="text-lg text-gray-600" data-aos="fade-down" data-aos-delay="200">
      احصل على افضل العروض
    </p>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-5">
      <UCard
        data-aos="fade-up"
        data-aos-delay="300"
        class="text-[#1d2145]"
        :ui="{
          base: 'inline shadow-lg',
          background: 'bg-white dark:bg-white',
          ring: 'ring-0',
        }"
      >
        <template #header>
          <h3>الباقة الشهرية <UBadge color="amber">30 يوم</UBadge></h3>
        </template>
        <div class="text-right">
          <p class="text-xl mb-5 text-center">9.99 ريال</p>
          <ul class="ms-5 list-disc">
            <li data-aos="fade-right" data-aos-delay="400">كتيب قوانين البلوت</li>
            <li data-aos="fade-right" data-aos-delay="500">التسجيل المتقدم</li>
            <li data-aos="fade-right" data-aos-delay="600">ازالة الاعلانات</li>
            <li data-aos="fade-right" data-aos-delay="700">ارشيف العابك</li>
            <li data-aos="fade-right" data-aos-delay="800">احصائيات دقيقة عن ادائك</li>
            <li data-aos="fade-right" data-aos-delay="900">اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
          </ul>
        </div>
      </UCard>
      <UCard
        data-aos="fade-up"
        data-aos-delay="600"
        class="text-white"
        :ui="{
          base: 'inline shadow-lg',
          background: 'bg-[#1d2145] dark:bg-[#1d2145] ',
          ring: 'ring-0',
          divide: 'divide-white dark:divide-white',
        }"
      >
        <template #header>
          <h3>الباقة الربع سنوية <UBadge color="amber">90 يوم</UBadge></h3>
        </template>
        <div class="text-right">
          <p class="text-xl mb-5 text-center">24.99 ريال</p>
          <ul class="ms-5 list-disc">
            <li data-aos="fade-right" data-aos-delay="400" >كتيب قوانين البلوت</li>
            <li  data-aos="fade-right" data-aos-delay="500">التسجيل المتقدم</li>
            <li  data-aos="fade-right" data-aos-delay="600">ازالة الاعلانات</li>
            <li  data-aos="fade-right" data-aos-delay="700">ارشيف العابك</li>
            <li  data-aos="fade-right" data-aos-delay="800">احصائيات دقيقة عن ادائك</li>
            <li  data-aos="fade-right" data-aos-delay="900">اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
          </ul>
        </div>
      </UCard>

      <UCard
        data-aos="fade-up"
        data-aos-delay="900"
        class="text-[#1d2145]"
        :ui="{
          base: 'inline shadow-lg',
          background: 'bg-white dark:bg-white',
          ring: 'ring-0',
        }"
      >
        <template #header>
          <h3>الباقة السنوية <UBadge color="amber">360 يوم</UBadge></h3>
        </template>
        <div class="text-right">
          <p class="text-xl mb-5 text-center">99.99 ريال</p>
          <ul class="ms-5 list-disc">
            <li  data-aos="fade-right" data-aos-delay="400" data-aos-offset="100">كتيب قوانين البلوت</li>
            <li  data-aos="fade-right" data-aos-delay="500">التسجيل المتقدم</li>
            <li  data-aos="fade-right" data-aos-delay="600">ازالة الاعلانات</li>
            <li  data-aos="fade-right" data-aos-delay="700">ارشيف العابك</li>
            <li  data-aos="fade-right" data-aos-delay="800">احصائيات دقيقة عن ادائك</li>
            <li  data-aos="fade-right" data-aos-delay="900">اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
          </ul>
        </div>
      </UCard>
    </div>
  </section>
</template>
<script></script>
<style></style>
