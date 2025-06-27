<template>
  <section id="calculators" class="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4">
      <div class="text-center space-y-4 mb-12" data-aos="fade-down" data-aos-once="true">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
          حاسبات قيدها
        </h2>
        <p class="text-xl text-gray-700 dark:text-gray-300">
          اختر العبة اللى تريدها وحنا نقيدها
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Hand Calculator Card -->
        <UCard
          data-aos="fade-up"
          data-aos-once="true"
          class="transform transition-all duration-300 hover:scale-105"
          :ui="{
            base: 'h-full overflow-hidden',
            background: 'bg-gradient-to-br from-white to-blue-50 dark:from-blue-700 dark:to-blue-800',
            ring: 'ring-1 ring-blue-500/20 dark:ring-blue-400/20',
            shadow: 'shadow-lg dark:shadow-black/50',
            rounded: 'rounded-2xl',
            padding: 'p-6'
          }"
        >
          <div class="flex flex-col items-center space-y-4">
            <div class="p-4 rounded-full bg-blue-100 dark:bg-white/10">
              <img src="@/assets/images/hand.svg" class="h-16 w-16" alt="hand" />
            </div>
            <h3 class="text-2xl font-bold text-blue-900 dark:text-white">حاسبة هاند</h3>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-3">
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:playing-cards" class="text-blue-600 dark:text-amber-400" />
                <span>عدد الورق (52 ورقة)</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:group" class="text-blue-600 dark:text-amber-400" />
                <span>عدد اللاعبين 2 إلى 5 لاعب</span>
              </div>
              <div class="pt-2">
                <p class="font-semibold text-blue-700 dark:text-amber-400 mb-2">طريقة اللعبة:</p>
                <ul class="list-decimal ms-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>تكوين مجموعات من الأوراق (تسلسلات أو مجموعات من نفس القيمة) لإنهاء يدك بأسرع وقت ممكن</li>
                  <li>تتم اللعبة على عدة جولات</li>
                  <li>يسعى اللاعبون لتقليل مجموع نقاطهم، إذ أن الأوراق المتبقية في يد اللاعب تحتسب كنقاط سلبية عند الجولة انتهاء</li>
                  <li>الفائز باللعبة الذي يجمع أقل عدد من النقاط بعد عدد محدد من الجولات.</li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Baloot Calculator Card -->
        <UCard
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-once="true"
          class="transform transition-all duration-300 hover:scale-105"
          :ui="{
            base: 'h-full overflow-hidden',
            background: 'bg-gradient-to-br from-white to-amber-50 dark:from-amber-700 dark:to-amber-800',
            ring: 'ring-1 ring-amber-500/20 dark:ring-amber-400/20',
            shadow: 'shadow-lg dark:shadow-black/50',
            rounded: 'rounded-2xl',
            padding: 'p-6'
          }"
        >
          <div class="flex flex-col items-center space-y-4">
            <div class="p-4 rounded-full bg-amber-100 dark:bg-white/10">
              <img src="@/assets/images/baloot.svg" class="h-16 w-16" alt="baloot" />
            </div>
            <h3 class="text-2xl font-bold text-amber-900 dark:text-white">حاسبة بلوت</h3>
            <div class="text-sm text-gray-700 dark:text-gray-100 space-y-3">
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:playing-cards" class="text-amber-600 dark:text-white" />
                <span>عدد الورق: (32 ورقة)</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:group" class="text-amber-600 dark:text-white" />
                <span>عدد اللاعبين: 4 لاعبين</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:groups" class="text-amber-600 dark:text-white" />
                <span>عدد الفرق: فريقين (كل فريق لاعبين)</span>
              </div>
              <div class="pt-2">
                <p class="font-semibold text-amber-700 dark:text-white mb-2">طريقة اللعبة:</p>
                <ul class="list-decimal ms-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>عدة جولات</li>
                  <li>الفائز الذي جمع عدد نقاط من الجولات بناء على ورق اللعب</li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Trex Calculator Card -->
        <UCard
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-once="true"
          class="transform transition-all duration-300 hover:scale-105"
          :ui="{
            base: 'h-full overflow-hidden',
            background: 'bg-gradient-to-br from-white to-purple-50 dark:from-purple-700 dark:to-purple-800',
            ring: 'ring-1 ring-purple-500/20 dark:ring-purple-400/20',
            shadow: 'shadow-lg dark:shadow-black/50',
            rounded: 'rounded-2xl',
            padding: 'p-6'
          }"
        >
          <div class="flex flex-col items-center space-y-4">
            <div class="p-4 rounded-full bg-purple-100 dark:bg-white/10">
              <img src="@/assets/images/trex.svg" class="h-16 w-16" alt="trex" />
            </div>
            <div class="flex items-center gap-2">
              <h3 class="text-2xl font-bold text-purple-900 dark:text-white">حاسبة تريكس</h3>
              <UBadge color="amber" class="text-xs">قريبا</UBadge>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-3">
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:group" class="text-purple-600 dark:text-amber-400" />
                <span>عدد اللاعبين: 4 لاعبين</span>
              </div>
              <div class="pt-2">
                <p class="font-semibold text-purple-700 dark:text-amber-400 mb-2">طريقة اللعبة:</p>
                <ul class="list-decimal ms-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>خمس ألعاب مختلفة تُلعب على مدار أربع جولات</li>
                  <li>الألعاب الخمس بالترتيب هي: "التريكس"، "الملكة"، "اللطوش"، "الديناري"، و"الكبوش" في كل جولة يتم تعيين "ملك" (اللاعب الذي يختار ترتيب الألعاب)</li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Add any component logic here
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
