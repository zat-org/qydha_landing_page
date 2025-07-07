<template>
  <header class="sticky top-0 z-50 
  h-20
  backdrop-blur-sm bg-white/80 dark:bg-gray-900/90 
  border-b border-amber-500/30 
  shadow-sm 
  flex justify-between items-center
  px-5">
    <UButton v-if="logedin" size="lg" variant="ghost" icon="mdi:menu" color="neutral" @click="openNav"
      class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200 ">
    </UButton>
    <div v-else>
      <UButton color="neutral" to="/tournament" size="lg" class=" dark:hover:bg-amber-600 transition-colors duration-200">
        البطولات
      </UButton>

    </div>



    <NuxtLink to="/" class="
          absolute left-1/2 -translate-x-1/2
          transform hover:scale-105 transition-all duration-300">
      <img src="@/assets/images/qydha-logo.svg" class="w-20" alt="Qydha Logo" />
    </NuxtLink>

    <div class="flex items-center gap-2">
      <ColorModeToggle class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200" />

      <UButton v-if="!logedin" variant="ghost" color="neutral" icon="mdi:user" to="/login" size="lg"
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200" />
      <UButton v-if="!logedin" color="neutral" to="/register" size="lg"
        class=" dark:hover:bg-amber-600 transition-colors duration-200">
        تسجيل
      </UButton>
      <UButton v-else variant="ghost" color="neutral" icon="mdi:logout" @click="onLogOut()"
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200" />
    </div>

  </header>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const logedin = computed(() => {
  return userStore.logedin;
});

const onLogOut = () => {
  user.value = null;
  return navigateTo("/");
};

const overlay = useOverlay();
const openNav = () => {
  overlay.create(SideBar).open();
};
</script>

<style scoped></style>
