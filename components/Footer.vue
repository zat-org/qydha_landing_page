<template>
  <footer class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-amber-500/30 py-8">
     <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <!-- Logo -->
        <div class="flex justify-center md:justify-start">
          <NuxtLink to="/" class="transform hover:scale-105 transition-all duration-300">
            <img src="@/assets/images/qydha-logo.svg" alt="Qydha" class="w-32 " />
          </NuxtLink>
    </div>

        <!-- Links & Contact -->
        <div class="flex flex-col items-center space-y-4">
          <ul class="flex flex-wrap justify-center gap-4">
            <li v-for="link in links" :key="link.href" 
                class="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300">
              <NuxtLink :to="link.href" class="text-sm font-medium">{{ link.text }}</NuxtLink>
        </li>
      </ul>

          <div class="flex flex-wrap justify-center gap-3">
            <UButtonGroup size="sm" orientation="horizontal" class="bg-white dark:bg-white/10 backdrop-blur-sm">
              <UBadge color="gray" class="text-gray-700 dark:text-gray-300" label="customer-support@qydha.com" />
              <UButton icon="i-heroicons-envelope" color="amber" to="mailto:customer-support@qydha.com" />
        </UButtonGroup>

            <UButtonGroup size="sm" orientation="horizontal" class="bg-white dark:bg-white/10 backdrop-blur-sm">
              <UBadge color="gray" class="text-gray-700 dark:text-gray-300" :label="phonenumber" />
              <UButton icon="i-heroicons-phone" color="amber" @click="sendMessage" />
        </UButtonGroup>
      </div>
    </div>

        <!-- Social Media -->
        <div class="flex justify-center md:justify-end space-x-4">
          <a href="https://twitter.com/QydhaApp" target="_blank"
             class="h-10 w-10 bg-white dark:bg-white/10 backdrop-blur-sm rounded-lg flex justify-center items-center transform hover:scale-110 transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 128 128" class="text-gray-700 dark:text-gray-300">
              <path fill="currentColor" d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z" />
        </svg>
      </a>
          <a href="https://www.instagram.com/qydhaapp/" target="_blank"
             class="h-10 w-10 bg-white dark:bg-white/10 backdrop-blur-sm rounded-lg flex justify-center items-center transform hover:scale-110 transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-gray-700 dark:text-gray-300">
              <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
    </div>
  </div>

      <!-- Copyright -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} Qydha. جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { text: "الشروط والاحكام", href: "/terms-of-use" },
  { text: "سياسة الخصوصية", href: "/privacy-policy" },
];

const phonenumber = "+966508253266";
const sendMessage = () => {
  const url = `https://wa.me/${phonenumber}`;
  window.open(url, "_blank");
};
</script>

<style scoped>
/* Light mode specific styles */
:root {
  --footer-bg: linear-gradient(to bottom right, rgba(249, 250, 251, 0.9), rgba(243, 244, 246, 0.9));
  --footer-border: rgba(245, 158, 11, 0.3);
}

/* Dark mode specific styles */
.dark {
  --footer-bg: linear-gradient(to bottom right, rgba(29, 33, 69, 0.9), rgba(42, 47, 92, 0.9));
  --footer-border: rgba(245, 158, 11, 0.2);
}
</style>
