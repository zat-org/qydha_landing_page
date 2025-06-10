<template>
  <header class="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/90 border-b border-amber-500/30 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left Section - Menu Button -->
        <div class="flex items-center">
          <UButton
            v-if="authstore.logedin"
            size="sm"
            variant="ghost"
            color="gray"
            @click="openNav"
            class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
          >
            <IconTribleDash class="w-5 text-gray-700 dark:text-gray-300" />
          </UButton>
        </div>

        <!-- Center Section - Logo -->
        <div class="flex-1 flex justify-center">
          <NuxtLink to="/" class="transform hover:scale-105 transition-all duration-300">
            <img
              src="@/assets/images/qydha-logo.svg"
              class="w-20"
              alt="Qydha Logo"
            />
          </NuxtLink>
        </div>

        <!-- Right Section - Auth Buttons & Color Mode Toggle -->
        <div class="flex items-center gap-2">
          <!-- Color Mode Toggle -->
          <UButton
            variant="ghost"
            color="gray"
            :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggleColorMode"
            class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
          />

          <UButton
            v-if="!authstore.logedin"
            variant="ghost"
            color="gray"
            icon="mdi:user"
            to="/login"
            class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
          />
          <UButton
            v-if="!authstore.logedin"
            color="amber"
            to="/register"
            class="hover:bg-amber-100 dark:hover:bg-amber-600 transition-colors duration-200"
          >
            تسجيل
          </UButton>
          <UButton
            v-else
            variant="ghost"
            color="gray"
            icon="simple-line-icons:logout"
            @click="onLogOut"
            class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();
const authApi = useAuth();
const colorMode = useColorMode();

const links = [
  { text: "الرئيسية", link: "" },
  { text: "الخدمات", link: "" },
  { text: "من نحن", link: "" },
  { text: "تواصل معنا", link: "" },
];

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const onLogOut = () => {
  user.value = null;
  return navigateTo("/");
};

const slidever = useSlideover();
const openNav = () => {
  slidever.open(SideBar);
};
</script>

<style scoped>
/* Light mode specific styles */
:root {
  --header-bg: rgba(255, 255, 255, 0.8);
  --header-border: rgba(245, 158, 11, 0.3);
}

/* Dark mode specific styles */
.dark {
  --header-bg: rgba(17, 24, 39, 0.9);
  --header-border: rgba(245, 158, 11, 0.2);
}
</style>
