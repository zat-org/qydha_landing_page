<template>
    <section id="hero" class="flex justify-center items-center min-h-[90vh] relative overflow-hidden bg-white dark:bg-gray-900">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
        <div class="absolute inset-0 bg-center bg-no-repeat opacity-10 dark:opacity-5"></div>
        
        <!-- Animated gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-800/5 animate-shimmer"></div>
        
        <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div class="w-full lg:w-1/2 space-y-8 text-center lg:text-right">
                <div class="space-y-5">
                    <h2 class="text-4xl   sm:text-5xl lg:text-6xl font-bold text-[#1d2145] dark:text-white leading-loose dark:drop-shadow-lg">
                        <span class=" py-2 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
                            ماتحلى الجلسه
                        </span>
                        <br />
                        
                        <span class="dark:text-gray-100 inline-block mt-0  md:mt-5  ">إلا بقيدها</span>
                    </h2>
                    <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        سهلناها عليكم … تطبيق حاسبة بلوت بإنعكاس شاشتين👏
                        <br /> سرعوا اللعب يا شباب
                        حملوا التطبيق وخلونا نشوف لعبكم
                    </p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                    <UButton 
                        color="amber" 
                        class="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-white shadow-lg dark:shadow-amber-500/20" 
                        to="#download-section"
                        padded
                    >
                        <span class="flex items-center justify-center gap-2">
                            <Icon name="material-symbols:download" class="text-xl" />
                            حمل التطبيق الان
                        </span>
                    </UButton>
                    <UButton 
                        color="gray" 
                        variant="outline"
                        class="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white" 
                        to="#features"
                        padded
                    >
                        <span class="flex items-center justify-center gap-2">
                            <Icon name="material-symbols:info" class="text-xl" />
                            تعرف على المميزات
                        </span>
                    </UButton>
                </div>

                <!-- Stats preview -->
                <div class="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400">45K+</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">تنزيلات</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400">10K+</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">مستخدمين</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400">4.8</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">تقييم</div>
                    </div>
                </div>
            </div>
            
            <!-- Images container - hidden on mobile -->
            <div class="hidden lg:block w-1/2 relative">
                <div class="flex justify-center items-center h-full w-full">
                    <div class="relative h-[600px] w-[360px]">
                        <!-- Phone frame -->
                        <div class="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-[3rem] shadow-2xl"></div>
                        
                        <!-- Main center image -->
                        <img 
                            src="@/assets/images/home_page-portrait.png"
                            class="absolute h-[550px] rounded-[2.5rem] shadow-xl dark:shadow-gray-800/50 top-0 left-1/2 -translate-x-1/2 dark:brightness-90 z-20" 
                        />
                        
                        <!-- Right diagonal image -->
                        <img 
                            src="@/assets/images/baloot_page-portrait.png"
                            class="absolute h-[500px] rounded-[2.5rem] shadow-xl dark:shadow-gray-800/50 top-1/2 -translate-y-1/2 right-0 translate-x-1/4 rotate-[15deg] dark:brightness-90 z-10" 
                        />
                        
                        <!-- Left diagonal image -->
                        <img 
                            src="@/assets/images/subscription_page-portrait.png"
                            class="absolute h-[500px] rounded-[2.5rem] shadow-xl dark:shadow-gray-800/50 top-1/2 -translate-y-1/2 left-0 -translate-x-1/4 -rotate-[15deg] dark:brightness-90 z-10" 
                        />
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
.animate-shimmer {
    animation: shimmer 3s infinite linear;
    background-size: 200% 100%;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Mobile optimizations */
@media (max-width: 640px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>