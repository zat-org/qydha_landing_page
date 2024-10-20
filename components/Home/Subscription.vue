<template>
    <section id="subscriptions" class="text-center ">
        <h2 class="text-2xl">عروض مميزه على الباقات لاتفوتك 👍🏻</h2>
        <p class="text-lg text-gray-600">احصل على افضل العروض</p>
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-5">
            <UCard class=" text-[#1d2145]" :ui="{
                base: 'inline shadow-lg',
                background: 'bg-white dark:bg-white',
                ring: 'ring-0'
            }">
                <template #header>
                    <h3>
                        الباقة الشهرية <UBadge color="amber">30 يوم</UBadge>
                    </h3>
                </template>
                <div class="text-right">
                    <p class="text-xl mb-5 text-center"> 9.99 ريال</p>
                    <ul class="ms-5 list-disc ">
                        <li>كتيب قوانين البلوت</li>
                        <li>التسجيل المتقدم</li>
                        <li>ازالة الاعلانات</li>
                        <li>ارشيف العابك</li>
                        <li>احصائيات دقيقة عن ادائك</li>
                        <li>اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
                    </ul>
                </div>
            </UCard>
            <UCard class=" text-white" :ui="{
                base: 'inline shadow-lg',
                background: 'bg-[#1d2145] dark:bg-[#1d2145] ',
                ring: 'ring-0',
                divide: 'divide-white dark:divide-white'
            }">
                <template #header>
                    <h3>
                        الباقة الربع سنوية <UBadge color="amber">90 يوم</UBadge>
                    </h3>
                </template>
                <div class="text-right">
                    <p class="text-xl mb-5 text-center"> 24.99 ريال</p>
                    <ul class="ms-5 list-disc ">
                        <li>كتيب قوانين البلوت</li>
                        <li>التسجيل المتقدم</li>
                        <li>ازالة الاعلانات</li>
                        <li>ارشيف العابك</li>
                        <li>احصائيات دقيقة عن ادائك</li>
                        <li>اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
                    </ul>
                </div>
            </UCard>

            <UCard class=" text-[#1d2145]" :ui="{
                base: 'inline shadow-lg',
                background: 'bg-white dark:bg-white',
                ring: 'ring-0'
            }">
                <template #header>
                    <h3>
                        الباقة السنوية <UBadge color="amber">360 يوم</UBadge>
                    </h3>
                </template>
                <div class="text-right">
                    <p class="text-xl mb-5 text-center"> 99.99 ريال</p>
                    <ul class="ms-5 list-disc ">
                        <li>كتيب قوانين البلوت</li>
                        <li>التسجيل المتقدم</li>
                        <li>ازالة الاعلانات</li>
                        <li>ارشيف العابك</li>
                        <li>احصائيات دقيقة عن ادائك</li>
                        <li>اسأل حكام قيدها في اى وقت ويحلون هوشتكم</li>
                    </ul>
                </div>
            </UCard>

        </div>
    </section>
</template>
<script></script>
<style></style>