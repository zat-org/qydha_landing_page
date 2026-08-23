<template>
  <header
    class="sticky top-0 z-50 h-20 backdrop-blur-sm bg-white/80 dark:bg-gray-900/90 border-b border-amber-500/30 shadow-sm flex justify-between items-center px-5"
  >
    <ClientOnly>
      <UButton
        v-if="logedin"
        size="lg"
        variant="ghost"
        icon="i-heroicons-bars-3"
        color="neutral"
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
        @click="openNav"
      />
    </ClientOnly>

    <NuxtLink
      to="/"
      class="absolute left-1/2 -translate-x-1/2 transform hover:scale-105 transition-all duration-300"
    >
      <img src="@/assets/images/qydha-logo.svg" class="w-20" alt="Qydha Logo" />
    </NuxtLink>

    <div class="flex items-center gap-2">
      <ColorModeToggle
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
      />

      <UButton
        v-if="!logedin"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-user"
        to="/login"
        size="lg"
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
        @click="navigateTo('/login')"
      />

      <UButton
        v-else
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-right-on-rectangle"
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
        @click="onLogOut()"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useMyAuthStore } from "~/store/Auth";

const SideBar = defineAsyncComponent(() => import("./SideBar.vue"));

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
