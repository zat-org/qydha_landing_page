<template>
    <section id="blogs" class="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl relative overflow-hidden">
        <!-- Background decoration -->

        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-2xl sm:text-3xl font-bold text-center mb-4" 
                    data-aos="fade-down" 
                    data-aos-duration="400"
                    data-aos-once="true">
                    <span class="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
                        دليل ألعاب قيدها
                    </span>
                    <UBadge color="amber" class="ms-2 text-sm">قريبا</UBadge>
                </h2>

                <p class="text-gray-700 dark:text-gray-300 text-lg mb-8 text-center"
                   data-aos="fade-up"
                   data-aos-duration="400"
                   data-aos-delay="100"
                   data-aos-once="true">
                    اكتشف أحدث المقالات والنصائح حول ألعاب البلوت والبطولات
                </p>

                <div class="bg-white dark:bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                     data-aos="fade-up" 
                     data-aos-duration="400"
                     data-aos-delay="200"
                     data-aos-once="true">
                    <img src="@/assets/images/blogs.svg" 
                         class="w-full max-w-2xl mx-auto " 
                         alt="Blogs Preview">
                </div>

                <!-- Coming Soon Features -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
                     data-aos="fade-up"
                     data-aos-duration="400"
                     data-aos-delay="300"
                     data-aos-once="true">
                    <div class="bg-white dark:bg-white/10 backdrop-blur-sm p-4 rounded-lg text-right">
                        <UIcon name="i-heroicons-book-open" class="text-amber-500 text-xl mb-2" />
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">مقالات تعليمية</h3>
                        <p class="text-gray-600 dark:text-gray-300">تعلم أساسيات وقواعد البلوت</p>
                    </div>
                    <div class="bg-white dark:bg-white/10 backdrop-blur-sm p-4 rounded-lg text-right">
                        <UIcon name="i-heroicons-trophy" class="text-amber-500 text-xl mb-2" />
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">أخبار البطولات</h3>
                        <p class="text-gray-600 dark:text-gray-300">تابع أحدث أخبار البطولات المحلية</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script></script>

<style scoped>
@media (max-width: 640px) {
    #blogs {
        border-radius: 1rem;
    }
}
</style>