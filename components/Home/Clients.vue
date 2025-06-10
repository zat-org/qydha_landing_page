<template>
    <section class="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-left opacity-10 dark:opacity-10" data-aos="fade-right" data-aos-duration="400" data-aos-once="true"></div>
        <div class="absolute inset-0 bg-[url('/images/circle.svg')] bg-no-repeat bg-right opacity-10 dark:opacity-10" data-aos="fade-left" data-aos-duration="400" data-aos-once="true"></div>

        <div class="container mx-auto px-4 relative z-10">
            <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8" 
                data-aos="fade-up" 
                data-aos-duration="400"
                data-aos-once="true">
                <span class="bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
                    شركائنا بالنجاح
                </span>
            </h2>

            <div class="flex flex-col items-center gap-8">
                <!-- Zat Logo -->
                <div class="bg-white dark:bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                     data-aos="fade-up"
                     data-aos-duration="400"
                     data-aos-delay="200"
                     data-aos-once="true">
                    <img src="@/assets/images/zat-logo-black.svg" 
                         class="w-32 h-32 object-contain " 
                         alt="Zat">
                </div>

                <!-- Partner Description -->
                <div class="max-w-2xl text-center"
                     data-aos="fade-up"
                     data-aos-duration="400"
                     data-aos-delay="300"
                     data-aos-once="true">
                    <p class="text-gray-700 dark:text-gray-300 text-lg">
                        نحن فخورون بشراكتنا مع زات، الشريك الاستراتيجي الذي يساعدنا في تقديم أفضل الخدمات لعملائنا
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@media (max-width: 640px) {
    #clients {
        border-radius: 1rem;
    }
}

/* Light mode specific styles */
:root {
    --card-bg: linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
    --card-border: rgba(229, 231, 235, 0.5);
}

/* Dark mode specific styles */
.dark {
    --card-bg: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    --card-border: rgba(255, 255, 255, 0.1);
}
</style><script>
</script>
