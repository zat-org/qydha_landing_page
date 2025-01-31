<template>
  <div
    class="border-b border-[#F6BD68] p-1 h-[60px] relative flex flex-row justify-between items-center text-white"
  >
    <div
      class="background absolute inset-0 bg-gradient-to-r blur-xl from-white to-[#929adf]"
    ></div>
    <!-- <UButton class="" color="black" icon="material-symbols:login" variant="outline" size="xs" to="/login"> تسجيل الدخول</UButton> -->

    <UButton
      v-if="authstore.logedin"
      color="blue"
      @click="openNav"
      class="mr-2 block lg:hidden relative bg-transparent"
    >
      <IconTribleDash class="w-5 text-black"></IconTribleDash>
    </UButton>

    <UHorizontalNavigation :links="links" class="hidden lg:block w-auto">
      <template #icon="{ link, isActive }">
        <component
          :is="link.iconComponent"
          class="text-xl hover:text-black z-10"
        >
        </component>
      </template>
    </UHorizontalNavigation>

    <UDropdown
      v-if="
        userStore.roles?.includes('SuperAdmin') ||
        userStore.roles?.includes('StaffAdmin')
      "
      class="ml-auto mr-2"
      :items="marketingItems"
      :popper="{ placement: 'bottom-start' }"
    >
      <UButton
        class="bg-transparent border-0 ring-0 shadow-none"
        color="white"
        label="التسويق"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>

    <UButton
      v-if="!authstore.logedin"
      color="black"
      icon="mdi:user"
      to="/login"
      class="ml-2"
    ></UButton>
    <UDropdown v-else :items="items" :popper="{ placement: 'bottom-start' }">
      <IconUser class="text-blue-500 text-4xl" />
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";
import iconUser from "~/components/Icon/User.vue";
import iconTournament from "~/components/Icon/Tournament.vue";
import iconCode from "~/components/Icon/Code.vue";
import iconNotification from "~/components/Icon/Notification.vue";
import iconFiles from "~/components/Icon/Files.vue";
import iconChart from "~/components/Icon/Chart.vue";
import iconProgramingCode from "~/components/Icon/ProgramingCode.vue";
import iconLive from "~/components/Icon/Live.vue";
import iconMarket from "~/components/Icon/Market.vue";

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();
import { type VerticalNavigationLink, type DropdownItem } from "#ui/types";
import type { Component } from "vue";
interface CustomNavigationLink extends VerticalNavigationLink {
  iconComponent?: Component;
}
const links = computed(() => {
  const result: CustomNavigationLink[] = [];
  if (user.value) {
    // result.push({
    //   label: "البطولات",
    //   to: "/tournament",
    //   iconComponent: iconTournament,
    // });
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

      // {
      //   label: "الاكونتات البرمجية ",
      //   to: "/ServiceAccount",
      //   iconComponent: iconProgramingCode,
      // }
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
const items: DropdownItem[] | DropdownItem[][] = [
  [{ label: "المستخدم", to: "/deleteuser", icon: "mdi:user" }],
  [
    {
      label: "تسجيل الخروج",
      icon: "simple-line-icons:logout",
      click(...args) {
        onLogOut();
      },
    },
  ],
];

const marketingItems: DropdownItem[] | DropdownItem[][] = [
  [
    {
      label: "اكواد ",
      to: "/influncerCode",
      icon: "",
      // iconComponent: iconCode,
    },
  ],
  [
    {
      label: "الاشعارات ",
      to: "/notification",
      // iconComponent: iconNotification,
    },
  ],
  [
    {
      label: "الملف الثابت",
      to: "/assets",
      // iconComponent: iconFiles
    },
  ],
  [
    {
      label: "التسويق",
      to: "/marketing",
      // iconComponent: iconMarket
    },
  ],
];
</script>

<style scoped>
@keyframes move-background {
  0% {
    background-position: 0 0; /* Start */
  }
  100% {
    background-position: 100% 0; /* End position (adjust as needed) */
  }
}
.background {
  animation: move-background 5s linear infinite;
}
</style>
