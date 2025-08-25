<template>
  <UContainer class="py-8">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-light text-gray-900 dark:text-white mb-2">
            دليل إنشاء البطولة
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 font-light">
            جميع البيانات المطلوبة لإنشاء بطولة جديدة
          </p>
        </div>
        <div class="flex gap-3">
          <UButton to="/tournament" icon="i-heroicons-arrow-left" variant="ghost" size="lg">
            قائمة البطولات
          </UButton>
          <UButton to="/tournament/add" icon="i-heroicons-plus" size="lg">
            إنشاء بطولة
          </UButton>
        </div>
      </div>

      <!-- Progress Overview -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-light text-center">خطوات إنشاء البطولة</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center group">
            <UAvatar size="xl" class="mx-auto mb-4 transition-all group-hover:scale-105">
              <span class="text-xl font-light">1</span>
            </UAvatar>
            <h3 class="font-medium mb-2">المعلومات الأساسية</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">8 حقول مطلوبة</p>
          </div>
          <div class="text-center group">
            <UAvatar size="xl" class="mx-auto mb-4 transition-all group-hover:scale-105">
              <span class="text-xl font-light">2</span>
            </UAvatar>
            <h3 class="font-medium mb-2">تفاصيل البطولة</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">12 حقل مطلوب</p>
          </div>
          <div class="text-center group">
            <UAvatar size="xl" class="mx-auto mb-4 transition-all group-hover:scale-105">
              <span class="text-xl font-light">3</span>
            </UAvatar>
            <h3 class="font-medium mb-2">قوانين البطولة</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">اختياري</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Step 1: Basic Information -->
    <UCard class="mb-16">
      <template #header>
        <div class="flex items-center space-x-4 space-x-reverse">
          <UAvatar size="lg" class="mx-2">
            <span class="text-lg font-light">1</span>
          </UAvatar>
          <div>
            <h3 class="text-2xl font-light">المعلومات الأساسية للبطولة</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">البيانات الأساسية المطلوبة لتعريف البطولة</p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-8">
          <!-- Tournament Name -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-pencil" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">اسم البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">اسم واضح ومميز للبطولة</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
              </div>
            </div>
          </div>

          <!-- Tournament Description -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-document-text" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">وصف البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">وصف تفصيلي لطبيعة وأهداف البطولة</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
              </div>
            </div>
          </div>

          <!-- Tournament Logo -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-photo" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">شعار البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">صورة تمثل البطولة (JPG, PNG, WebP)</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
              </div>
            </div>
          </div>

          <!-- Contact Phone -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-phone" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">رقم التواصل</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">رقم هاتف للتواصل مع اللاعبين + خيارات واتساب/مكالمة</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب (10 أرقام على الأقل)</UBadge>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <!-- Tournament Address -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">عنوان البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">العنوان النصي لمكان إقامة البطولة</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
              </div>
            </div>
          </div>

          <!-- Tournament Location -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-globe-alt" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">موقع البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">الإحداثيات الجغرافية (خط الطول والعرض)</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب - اختيار من الخريطة</UBadge>
              </div>
            </div>
          </div>

          <!-- Tournament Type -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-lock-closed" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">نوع البطولة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">عامة (مفتوحة للجميع) أو خاصة (بكود دعوة)</p>
                <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
              </div>
            </div>
          </div>

          <!-- Sponsors -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[140px] flex items-start border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <div class="flex items-start space-x-4 space-x-reverse w-full">
              <UIcon name="i-heroicons-star" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-2">الرعاة</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">شعارات الجهات الراعية (اختياري)</p>
                <UBadge color="neutral" variant="soft" size="sm">اختياري</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Step 2: Tournament Details -->
    <UCard class="mb-16">
      <template #header>
        <div class="flex items-center space-x-4 space-x-reverse">
          <UAvatar size="lg">
            <span class="text-lg font-light">2</span>
          </UAvatar>
          <div>
            <h3 class="text-2xl font-light">تفاصيل البطولة</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">الإعدادات التفصيلية لتنظيم البطولة</p>
          </div>
        </div>
      </template>

      <div class="space-y-12">
        <!-- Enrollment Dates -->
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <h4 class="font-medium">تواريخ التسجيل</h4>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[120px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">بداية التسجيل</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">تاريخ فتح التسجيل للاعبين</p>
              <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[120px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">نهاية التسجيل</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">تاريخ إغلاق التسجيل (يجب أن يكون بعد تاريخ البداية)</p>
              <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
            </div>
          </div>
        </UCard>

        <!-- Prize Management -->
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <h4 class="font-medium">إدارة الجوائز</h4>
            </div>
          </template>

          <div class="space-y-6">
            <UAlert color="info" variant="soft" title="عدد المراكز الفائزة"
              description="اختر من 1 إلى 4 مراكز للحصول على جوائز">
              <template #icon>
                <UIcon name="i-heroicons-information-circle" />
              </template>
            </UAlert>

            <div class="flex flex-wrap gap-3">
              <UBadge color="neutral" variant="soft" size="md">المركز الأول فقط</UBadge>
              <UBadge color="neutral" variant="soft" size="md">الأول والثاني</UBadge>
              <UBadge color="neutral" variant="soft" size="md">الأول والثاني والثالث</UBadge>
              <UBadge color="neutral" variant="soft" size="md">الأول والثاني والثالث والرابع</UBadge>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[100px] border border-gray-200 dark:border-gray-700">
                <h5 class="font-semibold text-lg mb-2">جوائز مالية</h5>
                <p class="text-gray-600 dark:text-gray-400">مبلغ نقدي + العملة لكل مركز</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[100px] border border-gray-200 dark:border-gray-700">
                <h5 class="font-semibold text-lg mb-2">جوائز عينية</h5>
                <p class="text-gray-600 dark:text-gray-400">قائمة بالجوائز المادية لكل مركز</p>
              </div>
            </div>

            <UBadge color="error" variant="soft" size="sm">مطلوب - جائزة واحدة على الأقل</UBadge>
          </div>
        </UCard>

        <!-- Tournament Structure -->
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <h4 class="font-medium">هيكل البطولة</h4>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[140px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">عدد الفرق</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">16, 32, 64, 128 أو عدد مخصص (أقل حد: فريقان)</p>
              <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[140px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">عدد الطاولات</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">عدد الطاولات المتاحة للمباريات</p>
              <UBadge color="error" variant="soft" size="sm">مطلوب (أقل حد: طاولة واحدة)</UBadge>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[140px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">توزيع الفرق</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">أوتوماتيكي أو يدوي</p>
              <UBadge color="error" variant="soft" size="sm">مطلوب</UBadge>
            </div>
          </div>
        </UCard>

        <!-- Tournament Schedule -->
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <h4 class="font-medium">جدولة البطولة</h4>
            </div>
          </template>

          <div class="space-y-6">
            <UAlert color="warning" variant="soft" title="عدد أيام البطولة"
              description="المدة الزمنية المخطط لها (أقل حد: يوم واحد)">
              <template #icon>
                <UIcon name="i-heroicons-calendar-days" />
              </template>
            </UAlert>

            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[120px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-3">لكل يوم مطلوب:</h5>
              <ul class="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2 text-base">
                <li>التاريخ</li>
                <li>وقت البداية</li>
                <li>وقت النهاية</li>
              </ul>
            </div>

            <UBadge color="error" variant="soft" size="sm">مطلوب - يوم واحد على الأقل مع أوقات محددة</UBadge>
          </div>
        </UCard>

        <!-- Game Management -->
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <h4 class="font-medium">إدارة المباريات</h4>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[120px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">تسجيل النتائج</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">بواسطة اللاعبين أو الحكام</p>
              <UBadge color="neutral" variant="soft" size="sm">إذا اختيار الحكام - حدد عددهم</UBadge>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[120px] border border-gray-200 dark:border-gray-700">
              <h5 class="font-semibold text-lg mb-2">الإحصائيات المتقدمة</h5>
              <p class="text-gray-600 dark:text-gray-400 mb-4">تسجيل تفصيلي للأداء والنتائج</p>
              <UBadge color="neutral" variant="soft" size="sm">اختياري</UBadge>
            </div>
          </div>
        </UCard>

        <!-- Automatic Settings -->
        <UAlert color="info" variant="soft" title="الإعدادات التلقائية"
          description="سيتم إنشاء هذه الإعدادات تلقائياً بناءً على عدد الفرق:">
          <template #icon>
            <UIcon name="i-heroicons-cog-6-tooth" />
          </template>
          <template #default>
            <ul class="text-sm list-disc list-inside space-y-2 mt-4">
              <li>أدوار البطولة (نهائي، نصف نهائي، إلخ)</li>
              <li>عدد المباريات لكل دور</li>
              <li>خيارات الصكات لكل دور (1، 3، أو 5 صكات)</li>
              <li>الوقت المطلوب للبطولة</li>
            </ul>
          </template>
        </UAlert>
      </div>
    </UCard>

    <!-- Step 3: Tournament Rules -->
    <UCard class="mb-16">
      <template #header>
        <div class="flex items-center space-x-4 space-x-reverse">
          <UAvatar size="lg">
            <span class="text-lg font-light">3</span>
          </UAvatar>
          <div>
            <h3 class="text-2xl font-light">قوانين البطولة</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">القواعد والشروط الخاصة بالبطولة</p>
          </div>
        </div>
      </template>

      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 min-h-[200px] border border-gray-200 dark:border-gray-700">
        <div class="flex items-start space-x-4 space-x-reverse">
          <UIcon name="i-heroicons-document-text" class="w-7 h-7 text-gray-700 dark:text-gray-300 mt-1 flex-shrink-0" />
          <div class="flex-1">
            <h4 class="font-semibold text-lg mb-3">قائمة القوانين</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              يمكنك إضافة قوانين مخصصة للبطولة مثل:
            </p>
            <ul class="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2 mb-6">
              <li>شروط المشاركة</li>
              <li>قواعد اللعب المحددة</li>
              <li>نظام الاحتساب والجزاءات</li>
              <li>التزامات اللاعبين</li>
              <li>آداب المنافسة</li>
            </ul>
            <UBadge color="neutral" variant="soft" size="sm">اختياري - لكن يُنصح بإضافة قوانين واضحة</UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Quick Tips -->
    <UCard class="mb-16">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-gray-700 dark:text-gray-300 ml-2" />
          <h3 class="text-2xl font-light">نصائح مهمة</h3>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
          <UAlert color="warning" variant="soft" title="التوقيت المناسب"
            description="تأكد من أن الوقت المحدد كافي لإنهاء جميع المباريات. سيعرض النظام تحذير إذا كان الوقت غير كافي.">
            <template #icon>
              <UIcon name="i-heroicons-exclamation-triangle" />
            </template>
          </UAlert>

          <UAlert color="info" variant="soft" title="حساب الطاولات"
            description="كلما زاد عدد الطاولات، قل الوقت المطلوب للبطولة. النظام يقترح العدد الأمثل.">
            <template #icon>
              <UIcon name="i-heroicons-calculator" />
            </template>
          </UAlert>
        

        
          <UAlert color="success" variant="soft" title="معاينة البيانات"
            description="يمكنك مراجعة جميع البيانات في كل خطوة قبل الانتقال للخطوة التالية.">
            <template #icon>
              <UIcon name="i-heroicons-eye" />
            </template>
          </UAlert>

          <UAlert color="info" variant="soft" title="التعديل اللاحق"
            description="يمكن تعديل معظم البيانات بعد إنشاء البطولة ما عدا الهيكل الأساسي.">
            <template #icon>
              <UIcon name="i-heroicons-arrow-path" />
            </template>
          </UAlert>
        </div>
    </UCard>

    <!-- Action Buttons -->
    <div class="flex justify-center gap-4">
      <UButton to="/tournament/add" size="xl" icon="i-heroicons-plus" class="px-8 py-4">
        ابدأ إنشاء البطولة
      </UButton>
      <UButton to="/tournament" variant="outline" size="xl" icon="i-heroicons-list-bullet" class="px-8 py-4">
        عرض البطولات الموجودة
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  middleware: ['auth', 'role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
});
useHead({
  title:'دليل إنشاء البطولة',
  meta:[
    {name:'description',content:'دليل إنشاء البطولة'}
  ]
})
</script>

<style scoped></style>
