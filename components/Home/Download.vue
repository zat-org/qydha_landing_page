<template>
    <section id="download-section"
        class="flex justify-center items-center py-8 lg:py-16 relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 sm:bg-gradient-to-br sm:from-white/90 sm:to-white/60 dark:sm:from-gray-900/90 dark:sm:to-gray-900/60">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-[url('/images/world.svg')] bg-center bg-cover opacity-20 dark:opacity-10"
            data-aos="fade" data-aos-duration="400" data-aos-once="true"></div>

        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                <div class="w-full lg:w-1/2 space-y-4 lg:space-y-6 text-center lg:text-right" data-aos="fade-left"
                    data-aos-duration="400" data-aos-delay="100" data-aos-once="true">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold py-2">
                        <span
                            class="block mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">حمِّل
                            تطبيق قيدها</span>
                        <span
                            class="block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-amber-500 dark:to-amber-700 bg-clip-text text-transparent">
                            للهواتف الذكية مجانًا
                        </span>
                    </h2>
                    <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed px-4 lg:px-0">
                        يمكنك الآن عبر تطبيق "قيدها" إدارة جميع عمليات حساب نقاط البلوت وإدارة الجولات بشكل تلقائي
                        تمامًا في
                        جميع الباقات الخاصة بتطبيق "قيدها". كما تتوفر خدمات خاصة في الباقات المميزة. اشترك الآن واحصل
                        على هذه
                        المميزات الاستثنائية!
                    </p>
                    <div class="mt-6 lg:mt-10 flex flex-row justify-center lg:justify-start gap-4" data-aos="fade-up"
                        data-aos-duration="400" data-aos-delay="200" data-aos-once="true">
                        <a href="https://apps.apple.com/in/app/qydha/id6446068415" target="_blank"
                            class="hover-scale shadow-lg hover:shadow-xl">
                            <img src="/images/app_store_badge_ar.svg" class="w-32 sm:w-36 lg:w-52"
                                alt="Download on App Store" />
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.qydha&pli=1" target="_blank"
                            class="hover-scale shadow-lg hover:shadow-xl">
                            <img src="/images/google_store_badge_ar.svg" class="w-32 sm:w-36 lg:w-52"
                                alt="Get it on Google Play" />
                        </a>
                    </div>
                </div>

                <div class="hidden lg:flex lg:w-1/3 justify-center" data-aos="fade-right" data-aos-duration="400"
                    data-aos-delay="300" data-aos-once="true">
                    <div class="relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 dark:from-primary-400/10 dark:to-primary-600/10 rounded-full blur-3xl">
                        </div>
                        <img src="@/assets/images/home_page-portrait.jpeg" class="h-96 relative z-10 hover-scale"
                            alt="Qydha App Preview">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Pure Tailwind CSS - no custom styles needed!
</script>