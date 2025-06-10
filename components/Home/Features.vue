<template>
    <section id="features" class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white py-12 lg:py-16 rounded-2xl relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-left opacity-10 dark:opacity-10" data-aos="fade-right" data-aos-duration="400" data-aos-once="true"></div>
        <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-right opacity-10 dark:opacity-10" data-aos="fade-left" data-aos-duration="400" data-aos-once="true"></div>
        
        <div class="container mx-auto px-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-12" 
                data-aos="fade-up" 
                data-aos-duration="400"
                data-aos-once="true">
                <span class="bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent"
                      data-aos="zoom-in"
                      data-aos-duration="400"
                      data-aos-delay="50"
                      data-aos-once="true">
                    خدمات عبر تطبيق قيدها
                </span>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 relative z-10">
                <div v-for="(feature, index) in features" :key="index" 
                     class="bg-gradient-to-br from-white to-gray-50 dark:from-[#1d2145] dark:to-[#2a2f5c] backdrop-blur-sm rounded-xl p-4 lg:p-6 transform hover:scale-105 transition-all duration-300 border border-amber-500/20 shadow-lg hover:shadow-xl dark:shadow-black/20"
                     :data-aos="'fade-up'"
                     :data-aos-duration="400"
                     :data-aos-delay="50 + (index * 50)"
                     data-aos-once="true">
                    <div class="flex flex-col items-center text-center gap-3">
                        <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xl lg:text-2xl font-bold mb-2"
                             :data-aos="'zoom-in'"
                             :data-aos-duration="400"
                             :data-aos-delay="100 + (index * 50)"
                             data-aos-once="true">{{ index + 1 }}</div>
                        <p class="text-base lg:text-lg text-gray-800 dark:text-white leading-relaxed"
                           :data-aos="'fade-up'"
                           :data-aos-duration="400"
                           :data-aos-delay="150 + (index * 50)"
                           data-aos-once="true">{{ feature }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const features = [
    'تنظيم وإدارة البطولات',
    'إدارة بثوث البلوت',
    'نقل وإخراج بثوث مباشرة للألعاب',
    'توفير حكام بلوت',
    'استشارات تحكيمية للألعاب أونلاين على مدار ٢٤ ساعة',
    'حاسبات ألعاب',
    'تقديم احصائيات و تحليل دقيق لمباريات البلوت'
]
</script>

<style scoped>
@media (max-width: 640px) {
    #features {
        border-radius: 1rem;
    }
}

/* Light mode specific styles */
:root {
    --feature-card-bg: linear-gradient(to bottom right, #1d2145, #2a2f5c);
    --feature-card-border: rgba(245, 158, 11, 0.2);
}

/* Dark mode specific styles */
.dark {
    --feature-card-bg: linear-gradient(to bottom right, #1d2145, #2a2f5c);
    --feature-card-border: rgba(245, 158, 11, 0.2);
}
</style>