<template>
    <section id="hero" class="flex justify-center items-center min-h-[90vh] relative overflow-hidden bg-white dark:bg-gray-900">
        
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
        <div class="absolute inset-0 bg-center bg-no-repeat opacity-10 dark:opacity-5"></div>
        
        <!-- Animated gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-800/5 animate-shimmer bg-[length:200%_100%]"></div>
        
        <div class="container mx-auto px-4 sm:px-4 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div class="w-full lg:w-1/2 space-y-8 text-center lg:text-right">
                <div class="space-y-5">
                    <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-loose dark:drop-shadow-lg">
                        <span class="py-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                            ماتحلى الجلسه
                        </span>
                        <br />
                        
                        <span class="text-gray-900 dark:text-gray-100 inline-block ">إلا بقيدها</span>
                    </h2>
                    <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        سهلناها عليكم … تطبيق حاسبة بلوت بإنعكاس شاشتين👏
                        <br /> سرعوا اللعب يا شباب
                        حملوا التطبيق وخلونا نشوف لعبكم
                    </p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center">
                    <UButton 
                        color="primary" 
                        class="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover-lift" 
                        to="#download-section"
                        padded
                    >
                        <span class="flex items-center justify-center gap-2">
                            <Icon name="material-symbols:download" class="text-xl" />
                            حمل التطبيق الان
                        </span>
                    </UButton>
                    <UButton 
                        color="secondary" 
                        variant="outline"
                        class="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift" 
                        to="#features"
                        padded
                    >
                        <span class="flex items-center justify-center gap-2">
                            <Icon name="material-symbols:info" class="text-xl" />
                            تعرف على خدماتنا
                        </span>
                    </UButton>
                </div>

                <!-- Enhanced Tournament Creation Button -->
                <!-- <div class="flex justify-center lg:justify-start pt-2">
                    <NuxtLink 
                        to="/tournament/creationRequest"
                        class="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-10 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-amber-500/60 animate-pulse-glow"
                    >
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                        
                        <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400/50 via-orange-500/50 to-amber-400/50 blur-xl opacity-75 animate-pulse"></div>
                        
                        <span class="relative z-10 flex items-center gap-3 sm:gap-4">
                            <Icon 
                                name="material-symbols:trophy" 
                                class="text-2xl sm:text-3xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-bounce-slow" 
                            />
                            <span class="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-wide drop-shadow-lg">
                                إنشاء بطولة
                            </span>
                            <Icon 
                                name="material-symbols:arrow-forward" 
                                class="text-xl sm:text-2xl transition-transform duration-300 group-hover:translate-x-2" 
                            />
                        </span>
                        
                        <div class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white/60 animate-ping"></div>
                        <div class="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-white/50 animate-pulse"></div>
                        <div class="absolute top-1/2 -right-2 h-2 w-2 rounded-full bg-white/40 animate-ping delay-300"></div>
                    </NuxtLink>
                </div> -->

                <!-- Stats preview -->
                <div class="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-primary-500 dark:text-primary-400">72K+</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">تنزيلات</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-primary-500 dark:text-primary-400">27K+</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">مستخدمين</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-primary-500 dark:text-primary-400">4.8</div>
                        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">تقييم</div>
                    </div>
                </div>
            </div>
            
            <!-- Images container - hidden on mobile -->
            <div class="hidden lg:block w-1/2 relative">
                <div class="flex justify-center items-center h-full w-full">
                    <div class="relative h-[600px] w-[360px]">
                        <!-- Phone frame -->
                        <div class="absolute inset-0  rounded-5xl "></div>
                        
                        <!-- Main center image -->
                        <img 
                            src="@/assets/images/home_page-portrait.jpeg"
                            class="absolute h-[550px] rounded-5xl shadow-xl dark:shadow-gray-800/50 top-0 left-1/2 -translate-x-1/2 dark:brightness-90 z-20 hover-scale" 
                        />
                        
                        <!-- Right diagonal image -->
                        <img 
                            src="@/assets/images/baloot_page-portrait.jpeg"
                            class="absolute h-[500px] rounded-5xl shadow-xl dark:shadow-gray-800/50 top-1/2 -translate-y-1/2 right-0 translate-x-1/4 rotate-[15deg] dark:brightness-90 z-10 hover-scale" 
                        />
                        
                        <!-- Left diagonal image -->
                        <img 
                            src="@/assets/images/subscription_page-portrait.jpeg"
                            class="absolute h-[500px] rounded-5xl shadow-xl dark:shadow-gray-800/50 top-1/2 -translate-y-1/2 left-0 -translate-x-1/4 -rotate-[15deg] dark:brightness-90 z-10 hover-scale" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Pure Tailwind CSS - no custom styles needed!
</script>

<style scoped>
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.8), 0 0 60px rgba(245, 158, 11, 0.5);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>