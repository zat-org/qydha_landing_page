<template>
  <div
    class="border-b border-[#F6BD68] p-1 overflow-hidden relative flex flex-row justify-between items-center text-white"
  >
    <div
      class="background absolute inset-0 bg-gradient-to-r blur-xl from-white to-[#929adf]"
    ></div>
    <!-- <UButton class="" color="black" icon="material-symbols:login" variant="outline" size="xs" to="/login"> تسجيل الدخول</UButton> -->
    <UButton
      v-if="authstore.logedin"
      color="black"
      icon="fontisto:nav-icon-a"
      @click="openNav"
      class="mr-2 block lg:hidden"
    ></UButton>

    <UHorizontalNavigation :links="links" class="hidden lg:block" />

    <UButton
      v-if="!authstore.logedin"
      color="black"
      icon="mdi:user"
      to="/login"
      class="ml-2"
    ></UButton>

    <UDropdown v-else :items="items" :popper="{ placement: 'bottom-start' }">
      <IconUser class="text-blue-500 text-4xl" />
      <!-- <UButton
        color="white"
        label="Options"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      /> -->
    </UDropdown>

    <!-- <UButton
      color="black"
      icon="simple-line-icons:logout"
      @click="onLogOut"
      class="ml-2"
    ></UButton> -->
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();
// const authApi = useAuth();
import { type VerticalNavigationLink, type DropdownItem } from "#ui/types";
const links = computed(() => {
  const result: VerticalNavigationLink[] = [];
  if (user.value) {
    result.push({
      label: "البطولات",
      to: "/tournament",
      icon: "mdi:tournament",
    });
  }
  if (
    userStore.roles?.includes("SuperAdmin") ||
    userStore.roles?.includes("StaffAdmin")
  ) {
    result.push(
      { label: "اكواد ", to: "/influncerCode", icon: "mdi:voucher" },
      // {label:"اكواد ",to:"/promoCode",icon:"mdi:voucher" ,},
      { label: "المستخدمين ", to: "/user", icon: "mdi:users" },
      { label: "الاشعارات ", to: "/notification", icon: "mdi:bell" },
      { label: "الملف الثابت", to: "/assets", icon: "mdi:files" },
      { label: "الاحصائيات", to: "/statistics", icon: "mdi:chart-line" },
      {
        label: "الاكونتات البرمجية ",
        to: "/ServiceAccount",
        icon: "pajamas:code",
      }
    );
  }
  if (userStore.roles?.includes("Streamer")) {
    result.push({
      label: "البث",
      to: "/stream",
      icon: "material-symbols-light:live-tv-outline",
    });
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
