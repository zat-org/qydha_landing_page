<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div class="mb-6">
        <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 6.5c-.77.833-.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h1>
      <p class="text-gray-600 mb-6">عذراً، ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة.</p>
      
      <div class="space-y-3">
        <button 
          @click="goToAppropriateRoute"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة إلى الصفحة الرئيسية
        </button>
        
        <button 
          @click="$router.go(-1)"
          class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          العودة للصفحة السابقة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getRedirectPath } = usePermissions()

const goToAppropriateRoute = () => {
  navigateTo(getRedirectPath())
}

useHead({
  title:'غير مصرح لك بالوصول',
  meta:[
    {name:'description',content:'غير مصرح لك بالوصول'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}

  ]
})
// Set page meta
definePageMeta({
  layout: false // Use no layout for this error page
})
</script> 