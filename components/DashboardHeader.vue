<template>
  <div
    class="header sticky top-0 z-50 border-b border-[var(--color-primary)]/[var(--opacity-border)] p-[var(--header-padding)] h-[var(--header-height)] flex flex-row justify-between items-center bg-[var(--color-background)]/[var(--opacity-background)] backdrop-blur-sm">
    <!-- Background gradient -->

    <!-- Mobile Menu Button -->
    <UButton v-if="authstore.logedin" color="gray" variant="ghost" @click="openNav"
      class="mr-2 block lg:hidden relative hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20 hover-transition">
      <IconTribleDash class="w-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]">
      </IconTribleDash>
    </UButton>
    <!-- Desktop Navigation -->
    <UHorizontalNavigation :links="links" class="hidden lg:block w-auto" :ui="{
      wrapper: 'flex items-center gap-1',
      base: 'text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover-transition',
      active: 'text-[var(--color-primary)] dark:text-[var(--color-primary-light)] font-medium'
    }">
      <template #icon="{ link, isActive }">
        <component :is="link.iconComponent" class="text-xl"
          :class="isActive ? 'text-[var(--color-primary)] dark:text-[var(--color-primary-light)]' : 'text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]'">
        </component>
      </template>
    </UHorizontalNavigation>
    <!-- Marketing Dropdown -->
    <UDropdown v-if="userStore.roles?.includes('SuperAdmin') || userStore.roles?.includes('StaffAdmin')"
      class="ml-auto mr-2 hidden lg:block" :items="marketingItems" :popper="{ placement: 'bottom-start' }">
      <UButton
        class="bg-transparent hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20 hover-transition"
        color="gray" variant="ghost" label="التسويق" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>

    <NuxtLink to="/" class="flex items-center absolute left-1/2 -translate-x-1/2">
      <img src="@/assets/images/qydha-logo.svg" class="w-16 h-auto" alt="Qydha Logo" />
    </NuxtLink>
    <!-- Auth Buttons -->
    <div class="flex items-center gap-2">
      <UDropdown v-if="authstore.logedin" :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="gray" variant="ghost"
          class="hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20 hover-transition">
          <IconUser class="text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]" />
        </UButton>
      </UDropdown>

      <!-- Color Mode Toggle -->
      <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray" variant="ghost"
        class="hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20 hover-transition"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";
import iconUser from "~/components/Icon/User.vue";
import iconTournament from "~/components/Icon/Tournament.vue";
import iconChart from "~/components/Icon/Chart.vue";
import iconLive from "~/components/Icon/Live.vue";

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();

const colorMode = useColorMode();


const links = computed(() => {
  const result: any[] = [];
  if (user.value) {
    result.push({
      label: "البطولات",
      to: "/tournament",
      // disabled: true,
      iconComponent: iconTournament,
    });
  }
  if (userStore.roles?.includes("Streamer")) {
    result.push({
      label: "البث",
      to: "/stream",
      iconComponent: iconLive,
    });
  }

  if (
    userStore.roles?.includes("SuperAdmin") ||
    userStore.roles?.includes("StaffAdmin")
  ) {
    result.push(
      { label: "المستخدمين ", to: "/user", iconComponent: iconUser },
      { label: "الاحصائيات", to: "/statistics", iconComponent: iconChart }
    );
  }

  return result;
});

const onLogOut = () => {
  user.value = null;
  return navigateTo("/");
};

const slidever = useSlideover();
const openNav = () => {
  slidever.open(SideBar);
};

const items: any = [
  [{ label: "المستخدم", to: "/deleteuser", icon: "mdi:user" }],
  [
    {
      label: "تسجيل الخروج",
      icon: "simple-line-icons:logout",
      click(...args: any) {
        onLogOut();
      },
    },
  ],
];

const marketingItems: any = [
  [
    {
      label: "اكواد ",
      to: "/Codes",
      icon: "",
    },
  ],
  [
    {
      label: "الاشعارات ",
      to: "/notification",
    },
  ],
  [
    {
      label: "الملف الثابت",
      to: "/assets",
    },
  ],
  [
    {
      label: "التسويق",
      to: "/marketing",
    },
  ],
];
</script>

<style scoped>
/* Import global variables */
@import '@/assets/css/variables.css';

/* Component specific styles */
.header {
  --header-height: 60px;
  --header-padding: var(--spacing-sm);
}

/* Light mode specific styles */
</style>
