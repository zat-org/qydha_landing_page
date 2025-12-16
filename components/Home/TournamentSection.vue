<template>
    <section id="tournament" class="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 lg:py-24 relative overflow-hidden">
        <!-- Animated Background decoration -->
        <div class="absolute inset-0 opacity-5">
            <div class="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-float-slow"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        </div>
        
        <!-- Floating particles -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-float-delay-1 opacity-60"></div>
            <div class="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-float-delay-2 opacity-50"></div>
            <div class="absolute bottom-32 left-1/4 w-2 h-2 bg-amber-500 rounded-full animate-float-delay-3 opacity-70"></div>
            <div class="absolute bottom-20 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-float-delay-4 opacity-60"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
            <!-- Header Section -->
            <div class="text-center mb-12 lg:mb-16"
                 data-aos="fade-up"
                 data-aos-duration="600"
                 data-aos-once="true">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 relative inline-block">
                    <span class="bg-gradient-to-r pb-4 from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
                        تبغى تنظم بطولة بلوت… خله علينا
                    </span>
                    <!-- Decorative underline -->
                    <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transform scale-x-0 animate-draw-line origin-left"></span>
                </h2>
                <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
                    من تسجيل اللاعبين .. إلى آخر صكة بالبطولة
                </p>
            </div>

            <!-- Main Content -->
            <div class="max-w-5xl mx-auto">
                <!-- Introduction Card -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-xl mb-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden group intro-card"
                     data-aos="fade-up"
                     data-aos-duration="600"
                     data-aos-delay="100"
                     data-aos-once="true">
                    <!-- Animated gradient border -->
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                    
                    <!-- Shimmer effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <p class="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center lg:text-right relative z-10">
                        <span class="font-bold text-amber-600 dark:text-amber-400 inline-block hover:scale-110 transition-transform duration-300 cursor-default">بطولة بلوت؟</span>
                        <span class="mx-2">جلسة أصدقاء؟</span>
                        <span class="font-bold text-amber-600 dark:text-amber-400 inline-block hover:scale-110 transition-transform duration-300 cursor-default">فعالية كبيرة بجو احترافي؟</span>
                        <br class="hidden lg:block" />
                        <span class="block mt-2">مع قيدها تنظّم بطولتك بسهولة، وتظهرها بشكل يليق فيها.</span>
                    </p>
                </div>

                <!-- Why Section -->
                <div class="mb-12 lg:mb-16 relative why-section"
                     data-aos="fade-up"
                     data-aos-duration="600"
                     data-aos-delay="200"
                     data-aos-once="true">
                    <!-- Decorative background elements -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                        <div class="w-64 h-64 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-3xl animate-pulse-slow"></div>
                    </div>
                    
                    <!-- Main container -->
                    <div class="relative z-10">
                        <!-- Icon decoration -->
                        <div class="flex justify-center mb-6">
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse-glow"></div>
                                <div class="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <Icon name="material-symbols:help" class="text-3xl lg:text-4xl text-white animate-bounce-slow" />
                                </div>
                                <!-- Rotating ring -->
                                <div class="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-spin-slow"></div>
                            </div>
                        </div>
                        
                        <!-- Title with enhanced styling -->
                        <div class="text-center mb-6">
                            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white relative inline-block group cursor-default">
                                <span class="relative z-10 bg-gradient-to-r from-gray-900 via-amber-600 to-gray-900 dark:from-white dark:via-amber-400 dark:to-white bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                                    ليش تنظم بطولتك مع قيدها؟
                                </span>
                                
                                <!-- Animated underline -->
                                <span class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full animate-scale-in opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                
                                <!-- Decorative dots -->
                                <span class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></span>
                                <span class="absolute -right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-200"></span>
                            </h3>
                        </div>
                        
                        <!-- Description with enhanced styling -->
                        <div class="max-w-3xl mx-auto">
                            <div class="bg-gradient-to-r from-amber-50/50 via-white to-orange-50/50 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 lg:p-8 border border-amber-200/50 dark:border-amber-800/50 shadow-lg relative overflow-hidden group/desc">
                                <!-- Shimmer effect -->
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent translate-x-[-200%] group-hover/desc:translate-x-[200%] transition-transform duration-1000"></div>
                                
                                <!-- Content -->
                                <p class="text-center text-gray-700 dark:text-gray-300 mb-4 text-lg lg:text-xl leading-relaxed relative z-10 font-medium">
                                    <span class="inline-block transform group-hover/desc:scale-105 transition-transform duration-300">
                                        لأننا نحول أي بطولة عادية إلى
                                    </span>
                                    <br class="hidden sm:block" />
                                    <span class="inline-block bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent font-bold text-xl lg:text-2xl transform group-hover/desc:scale-110 transition-transform duration-300">
                                        تجربة احترافية متكاملة
                                    </span>
                                </p>
                                
                                <!-- Decorative elements -->
                                <div class="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full opacity-50 group-hover/desc:opacity-100 group-hover/desc:animate-pulse transition-opacity duration-300"></div>
                                <div class="absolute bottom-2 left-2 w-2 h-2 bg-orange-400 rounded-full opacity-50 group-hover/desc:opacity-100 group-hover/desc:animate-pulse transition-opacity duration-300 delay-200"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                    <!-- Feature 1: Smart Registration -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="300"
                         data-aos-once="true">
                        <!-- Hover glow effect -->
                        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        
                        <!-- Shine effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-green-500/50">
                                <Icon name="material-symbols:check-circle" class="text-2xl text-green-600 dark:text-green-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                    نظام تسجيل ذكي
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        تسجيل اللاعبين إلكترونيًا
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        إدارة الفرق تلقائيًا
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        كل البيانات محفوظة ومحدّثة لحظة بلحظة
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: Live Schedule -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="400"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/50">
                                <Icon name="material-symbols:calendar-month" class="text-2xl text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    جدول مباشر يُعرض أمام الجميع
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        موقع مخصص للبطولة
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        من تأهل | من خرج | نتائج المباريات مباشرة
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        قابل للعرض على شاشة أمام الجمهور 🎥
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: Statistics -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="500"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-purple-500/50">
                                <Icon name="material-symbols:analytics" class="text-2xl text-purple-600 dark:text-purple-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                    إحصائيات تفصيلية لكل مباراة
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        كم مشترى | كم مشروع | كم كَبُوت
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        أداء كل فريق بدقة
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        كلها بيانات تساعدك تصنع بطولة مختلفة فعلًا
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Professional Referees -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="600"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-amber-500/50">
                                <Icon name="material-symbols:gavel" class="text-2xl text-amber-600 dark:text-amber-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                                    حكام محترفين (أونلاين أو حضوري)
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        حكام معتمدين | قوانين معتمدة
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        فض أي نزاع فورا
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        بطولة عادلة بدون توتر
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: Premium Equipment -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="700"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-orange-500/50">
                                <Icon name="material-symbols:chair" class="text-2xl text-orange-600 dark:text-orange-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                    تجهيزات فاخرة للبطولة
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        طاولات بلوت راقية
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        كراسي مريحة | ورق بلوت فاخر
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        تجربة تليق باللاعبين 👌
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Live Streaming -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="800"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-red-500/50">
                                <Icon name="material-symbols:videocam" class="text-2xl text-red-600 dark:text-red-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                                    بث مباشر للبطولة
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        ننقل بطولتك مباشرة
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        على المنصة اللي تختارها
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        بإخراج احترافي يزيد الحماس والمشاهدة
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: Marketing Power -->
                    <div class="feature-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group md:col-span-2"
                         data-aos="fade-up"
                         data-aos-duration="600"
                         data-aos-delay="900"
                         data-aos-once="true">
                        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-indigo-500/50">
                                <Icon name="material-symbols:campaign" class="text-2xl text-indigo-600 dark:text-indigo-400 group-hover:animate-bounce" />
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                    قوة إعلامية توصل بطولتك للجميع
                                </h4>
                                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        ترويج عبر أكثر من 20 مشهور
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        أكثر من 100,000 مستخدم داخل تطبيق قيدها
                                    </li>
                                    <li class="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-300"></span>
                                        بطولتك ما تكون بس موجودة… بطولتك تكون حديث الناس 🔥
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary Card -->
                <div class="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-6 lg:p-8 shadow-2xl mb-8 relative overflow-hidden group summary-card"
                     data-aos="fade-up"
                     data-aos-duration="600"
                     data-aos-delay="1000"
                     data-aos-once="true">
                    <!-- Animated background -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float-slow"></div>
                        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl animate-float-reverse"></div>
                    </div>
                    
                    <!-- Pulsing glow -->
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/50 via-orange-500/50 to-amber-400/50 blur-2xl opacity-75 animate-pulse-glow"></div>
                    
                    <div class="relative z-10 text-center">
                        <div class="flex items-center justify-center gap-3 mb-4">
                            <Icon name="material-symbols:trophy" class="text-4xl lg:text-5xl text-white animate-bounce-slow group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
                            <h3 class="text-2xl lg:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                                الخلاصة؟
                            </h3>
                        </div>
                        <p class="text-white/95 text-lg lg:text-xl mb-4 leading-relaxed group-hover:text-white transition-colors duration-300">
                            قيدها = تنظيم أسهل + شكل أجمل + نتائج أدق + انتشار أوسع
                        </p>
                        <p class="text-white/90 text-base lg:text-lg group-hover:text-white/95 transition-colors duration-300">
                            إنت ركّز على اللعب والمتعة<br />
                            وحنا نهتم بالإدارة… والتنظيم… والتجربة كاملة
                        </p>
                    </div>
                    
                    <!-- Shine effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <!-- Sparkles -->
                    <div class="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                    <div class="absolute bottom-4 left-4 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 delay-200"></div>
                </div>

                <!-- CTA Button -->
                <div class="text-center"
                     data-aos="fade-up"
                     data-aos-duration="600"
                     data-aos-delay="1100"
                     data-aos-once="true">
                    <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        🚀 جاهز تنظم بطولتك؟
                    </p>
                    <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        ابدأ الآن مع قيدها وخَلِّ بطولتك تُحكى
                    </p>
                    <div 
                        @click="handleRequestTournament"
                        class="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg lg:text-xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110 cursor-pointer group relative overflow-hidden cta-button"
                    >
                        <!-- Animated gradient background -->
                        <div class="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-[length:200%_100%] animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <!-- Button shine effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        
                        <!-- Pulsing ring -->
                        <div class="absolute inset-0 rounded-xl border-2 border-white/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-ping-slow"></div>
                        
                        <Icon name="material-symbols:trophy" class="text-2xl relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                        <span class="relative z-10 group-hover:tracking-wide transition-all duration-300">نظّم بطولتك الآن</span>
                        <Icon name="material-symbols:arrow-forward" class="text-2xl relative z-10 transition-transform group-hover:translate-x-3 group-hover:scale-110" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const handleRequestTournament = () => {
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=966508253266&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+%0A%D9%86%D8%AD%D9%86+%D8%B4%D8%B1%D9%83%D8%A9+.......+%D9%86%D8%B1%D8%BA%D8%A8+%D9%81%D9%8A+%D8%AA%D9%86%D8%B8%D9%8A%D9%85+%D8%A8%D8%B7%D9%88%D9%84%D8%A9+%D8%A8%D9%84%D9%88%D8%AA+%D9%81%D9%8A+%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE%3A+%0A%D8%A8%D9%85%D8%AF%D9%8A%D9%86%D8%A9%3A+%0A%D8%B9%D8%AF%D8%AF+%D8%A7%D9%84%D9%84%D8%A7%D8%B9%D8%A8%D9%8A%D9%86%3A+%0A%0A%D9%86%D8%B1%D8%BA%D8%A8+%D9%81%D9%8A+%D8%B9%D8%B1%D8%B6+%D8%B3%D8%B9%D8%B1+%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%D9%85+%D9%81%D9%8A+%D9%82%D9%8A%D8%AF%D9%87%D8%A7&type=phone_number&app_absent=0';
  window.open(whatsappUrl, '_blank');
}
</script>

<style scoped>
#tournament {
    scroll-margin-top: 100px;
}

/* Floating animations */
@keyframes float-slow {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    50% {
        transform: translate(20px, -20px) scale(1.05);
    }
}

@keyframes float-reverse {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    50% {
        transform: translate(-20px, 20px) scale(1.05);
    }
}

@keyframes float-delay-1 {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.6;
    }
    33% {
        transform: translateY(-20px) translateX(10px);
        opacity: 0.8;
    }
    66% {
        transform: translateY(-10px) translateX(-10px);
        opacity: 0.4;
    }
}

@keyframes float-delay-2 {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.5;
    }
    33% {
        transform: translateY(15px) translateX(-15px);
        opacity: 0.7;
    }
    66% {
        transform: translateY(-15px) translateX(15px);
        opacity: 0.3;
    }
}

@keyframes float-delay-3 {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.7;
    }
    50% {
        transform: translateY(-25px) translateX(15px);
        opacity: 0.9;
    }
}

@keyframes float-delay-4 {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.6;
    }
    50% {
        transform: translateY(20px) translateX(-20px);
        opacity: 0.8;
    }
}

@keyframes pulse-slow {
    0%, 100% {
        opacity: 0.3;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
}

@keyframes pulse-glow {
    0%, 100% {
        opacity: 0.5;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
    }
}

@keyframes bounce-slow {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes gradient-x {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

@keyframes draw-line {
    from {
        transform: scaleX(0);
    }
    to {
        transform: scaleX(1);
    }
}

@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@keyframes ping-slow {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50%, 100% {
        transform: scale(1.3);
        opacity: 0;
    }
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scale-in {
    from {
        transform: translateX(-50%) scaleX(0);
    }
    to {
        transform: translateX(-50%) scaleX(1);
    }
}

.animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
}

.animate-float-reverse {
    animation: float-reverse 10s ease-in-out infinite;
}

.animate-float-delay-1 {
    animation: float-delay-1 6s ease-in-out infinite;
}

.animate-float-delay-2 {
    animation: float-delay-2 7s ease-in-out infinite;
    animation-delay: 1s;
}

.animate-float-delay-3 {
    animation: float-delay-3 8s ease-in-out infinite;
    animation-delay: 2s;
}

.animate-float-delay-4 {
    animation: float-delay-4 9s ease-in-out infinite;
    animation-delay: 3s;
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
}

.animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
}

.animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
}

.animate-draw-line {
    animation: draw-line 1s ease-out forwards;
    animation-delay: 0.5s;
}

.animate-gradient-shift {
    animation: gradient-shift 3s ease infinite;
}

.animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-fade-in-up {
    animation: fade-in-up 1s ease-out forwards;
    animation-delay: 0.3s;
    opacity: 0;
}

.animate-fade-in-up-delay {
    animation: fade-in-up 1s ease-out forwards;
    animation-delay: 0.5s;
    opacity: 0;
}

.animate-scale-in {
    animation: scale-in 0.8s ease-out forwards;
    animation-delay: 0.7s;
    transform-origin: center;
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 8s linear infinite;
}

/* Feature card enhancements */
.feature-card {
    position: relative;
}

.feature-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(45deg, transparent, rgba(245, 158, 11, 0.1), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s;
}

.feature-card:hover::before {
    opacity: 1;
}

/* Intro card enhancement */
.intro-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.intro-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(245, 158, 11, 0.3);
}

/* Summary card enhancement */
.summary-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.5);
}

/* CTA button enhancement */
.cta-button {
    position: relative;
}

.cta-button::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    padding: 4px;
    background: linear-gradient(45deg, rgba(245, 158, 11, 0.5), rgba(251, 146, 60, 0.5));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s;
    z-index: -1;
}

.cta-button:hover::after {
    opacity: 1;
}

/* Why Section enhancements */
.why-section {
    position: relative;
}

.why-section h3 {
    transition: all 0.3s ease;
}

.why-section h3:hover {
    transform: scale(1.05);
}

/* Smooth transitions for all interactive elements */
.feature-card,
.intro-card,
.summary-card,
.cta-button {
    will-change: transform;
}
</style>

