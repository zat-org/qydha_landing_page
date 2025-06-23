<template>
    <section id="download-section" class="flex justify-center items-center py-8 lg:py-16 relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-[url('/images/world.svg')] bg-center bg-cover opacity-20 dark:opacity-10" data-aos="fade" data-aos-duration="400" data-aos-once="true"></div>
        
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                <div class="w-full lg:w-1/2 space-y-4 lg:space-y-6 text-center lg:text-right" 
                     data-aos="fade-left" 
                     data-aos-duration="400" 
                     data-aos-delay="100"
                     data-aos-once="true">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold py-2 bg-gradient-to-r from-[#1d2145] to-[#2a2f5c] dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        <span class="block mb-2">حمِّل تطبيق قيدها</span>
                        <span class="block text-2xl sm:text-3xl lg:text-4xl">
                            للهواتف الذكية مجانًا
                        </span>
                    </h2>
                    <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed px-4 lg:px-0">
                        يمكنك الآن عبر تطبيق "قيدها" إدارة جميع عمليات حساب نقاط البلوت وإدارة الجولات بشكل تلقائي تمامًا في
                        جميع الباقات الخاصة بتطبيق "قيدها". كما تتوفر خدمات خاصة في الباقات المميزة. اشترك الآن واحصل على هذه
                        المميزات الاستثنائية!
                    </p>
                    <div class="mt-6 lg:mt-10 flex flex-row justify-center lg:justify-start gap-4" 
                         data-aos="fade-up" 
                         data-aos-duration="400" 
                         data-aos-delay="200"
                         data-aos-once="true">
                        <a href="https://apps.apple.com/in/app/qydha/id6446068415" 
                           target="_blank" 
                           class="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <img src="/images/app_store_badge_ar.svg" 
                                 class="w-32 sm:w-36 lg:w-52" 
                                 alt="Download on App Store" />
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.qydha&pli=1" 
                           target="_blank" 
                           class="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <img src="/images/google_store_badge_ar.svg" 
                                 class="w-32 sm:w-36 lg:w-52" 
                                 alt="Get it on Google Play" />
                        </a>
                    </div>
                </div>
                
                <div class="hidden lg:flex lg:w-1/3 justify-center" 
                     data-aos="fade-right" 
                     data-aos-duration="400" 
                     data-aos-delay="300"
                     data-aos-once="true">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 dark:from-amber-400/10 dark:to-amber-600/10 rounded-full blur-3xl"></div>
                        <img src="@/assets/images/home_page-portrait.webp" 
                             class="h-96 relative z-10 transform transition-all duration-300 hover:scale-105" 
                             alt="Qydha App Preview">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Add any component logic here
</script>

<style scoped>
#download-section {
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
}

.dark #download-section {
    background: linear-gradient(to bottom right, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.4));
}

@media (max-width: 640px) {
    #download-section {
        background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
    }
    
    .dark #download-section {
        background: linear-gradient(to bottom right, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.6));
    }
}
</style>