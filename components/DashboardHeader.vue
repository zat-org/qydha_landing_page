<template>
  <header
    class="sticky top-0 z-50 border-b border-amber-500/30 p-4 h-16 flex flex-row justify-between items-center bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm transition-colors duration-300"
  >
    <UButton
      v-if="authstore.logedin"
      color="neutral"
      variant="ghost"
      icon="i-heroicons-bars-3"
      class="mr-2 block lg:hidden relative hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
      @click="openNav"
    />

    <UNavigationMenu
    dir="rtl" 
      :items="reversedLinks"
      class="hidden lg:flex"
      content-orientation="vertical"
      :ui="{
        root: 'justify-start',
        viewportWrapper: 'justify-start',
        viewport:
          'w-(--reka-navigation-menu-viewport-width)! left-(--reka-navigation-menu-viewport-left)! rtl:left-auto! rtl:right-[calc(100%-var(--reka-navigation-menu-viewport-left)-var(--reka-navigation-menu-viewport-width))]!',
        content: 'static! w-max! max-h-[70vh]',
        childList: 'grid w-max min-w-44 p-2',
      }"
    />

    <div class="flex items-center gap-2">
      <UDropdownMenu
        v-if="authstore.logedin"
        :items="items"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-user"
          class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
        />
      </UDropdownMenu>

      <ColorModeToggle
        class="hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-colors duration-200"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();

const { links  ,reversedLinks} = useNavLinks();

const onLogOut = () => {
  user.value = null;
  return navigateTo("/");
};

const overlay = useOverlay();
const sideBar = overlay.create(SideBar);
const openNav = () => {
  sideBar.open();
};

const items: any = [
  [{ label: "الملف الشخصي", to: "/me", icon: "mdi:user" }],
  [{ label: " حذف المستخدم ", to: "/user/delete", icon: "mdi:delete" }],
  [
    {
      label: "تسجيل الخروج",
      icon: "mdi:logout",
      onSelect(...args: any) {
        onLogOut();
      },
    },
  ],
];
</script>

<style scoped>
/* Component specific styles */
</style>
