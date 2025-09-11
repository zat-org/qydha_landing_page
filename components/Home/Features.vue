<template>
    <section id="features" class=" bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white py-12 lg:py-16 rounded-lg sm:rounded-2xl relative overflow-hidden">
        <!-- Background decoration -->
        
        <div class="container mx-auto px-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-12 h-auto"  
                data-aos="fade-up" 
                data-aos-duration="400"
                data-aos-once="true">
                <p class="bg-gradient-to-r text-2xl sm:text-3xl h-[50px]  from-gray-900 to-gray-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent"
                      data-aos="zoom-in"
                      data-aos-duration="400"
                      data-aos-delay="50"
                      data-aos-once="true">
                    خدمات عبر تطبيق قيدها
        </p>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 relative z-10">
                <div v-for="(feature, index) in features" :key="index" 
                     class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-xl p-4 lg:p-6 hover-scale transition-all duration-300 border border-primary-500/20 shadow-lg hover:shadow-xl dark:shadow-black/20"
                     :data-aos="'fade-up'"
                     :data-aos-duration="400"
                     :data-aos-delay="50 + (index * 50)"
                     data-aos-once="true">
                    <div class="flex flex-col items-center text-center gap-3">
                        <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl lg:text-2xl font-bold mb-2"
                             :data-aos="'zoom-in'"
                             :data-aos-duration="400"
                             :data-aos-delay="100 + (index * 50)"
                             data-aos-once="true">{{ index + 1 }}</div>
                        <p class="text-base lg:text-lg text-gray-800 font-semibold dark:text-white leading-relaxed"
                           :data-aos="'fade-up'"
                           :data-aos-duration="400"
                           :data-aos-delay="150 + (index * 50)"
                           data-aos-once="true">{{ feature.title }}</p>
                           <p class="text-sm lg:text-base text-gray-500 font-normal dark:text-white leading-relaxed"
                           :data-aos="'fade-up'"
                           :data-aos-duration="400"
                           :data-aos-delay="150 + (index * 50)"
                           data-aos-once="true">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'تنظيم وإدارة البطولات',
    description: 'يمكنك إنشاء بطولات بلوت بسهولة، تحديد القواعد والمراحل، وتوزيع الجداول بشكل احترافي ليحصل كل لاعب على تجربة منظمة وعادلة.'
  },
//   {
//     title: 'إدارة بثوث البلوت',
//     description: 'نظام متكامل لإدارة البثوث من البداية للنهاية، بما في ذلك جدولة المباريات، متابعة النتائج، وتنظيم ظهورها للمشاهدين.'
//   },
  {
    title: 'نقل وإخراج بثوث مباشرة للألعاب',
    description: 'أدوات مخصصة لنقل المباريات وبثها بشكل مباشر بجودة عالية، مع خيارات الإخراج الاحترافي التي تضيف متعة للمشاهدة.'
  },
  {
    title: 'توفير حكام بلوت',
    description: 'إمكانية طلب حكام معتمدين للإشراف على المباريات وضمان تطبيق القوانين بشكل عادل ومنظم.'
  },
  {
    title: 'استشارات تحكيمية للألعاب أونلاين على مدار ٢٤ ساعة',
    description: 'دعم تحكيمي متواصل متاح على مدار اليوم لحل أي نزاعات أو استفسارات تخص القوانين أثناء المباريات.'
  },
  {
    title: 'حاسبات ألعاب',
    description: 'أدوات ذكية لحساب النقاط والنتائج تلقائياً، مما يوفر الوقت ويقلل من الأخطاء اليدوية.'
  },
  {
    title: 'تقديم احصائيات و تحليل دقيق لمباريات البلوت',
    description: 'لوحات تحليل متقدمة تعرض بيانات تفصيلية عن أداء اللاعبين والمباريات لمساعدتك على تحسين استراتيجياتك.'
  }
]

// const features = [
//     'تنظيم وإدارة البطولات',
//     'إدارة بثوث البلوت',
//     'نقل وإخراج بثوث مباشرة للألعاب',
//     'توفير حكام بلوت',
//     'استشارات تحكيمية للألعاب أونلاين على مدار ٢٤ ساعة',
//     'حاسبات ألعاب',
//     'تقديم احصائيات و تحليل دقيق لمباريات البلوت'
// ]
</script>

<style scoped>
@media (max-width: 640px) {
    #features {
        border-radius: 1rem;
    }
}
#features {
    scroll-margin-top: 100px;
}
</style>