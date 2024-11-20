<template>
  <div
    class="border-b border-[#F6BD68] overflow-hidden relative flex flex-row justify-around items-center pb-2 text-white"
  >
    <div
      class="background absolute inset-0 bg-gradient-to-r blur-xl from-white to-[#929adf]"
    ></div>
    <!-- <UButton class="" color="black" icon="material-symbols:login" variant="outline" size="xs" to="/login"> تسجيل الدخول</UButton> -->
    <UHorizontalNavigation :links="links" />

    <UButton
      v-if="!authstore.logedin"
      color="black"
      icon="mdi:user"
      to="/login"
      class="ml-2"
    ></UButton>
    <UButton
      v-else
      color="black"
      icon="simple-line-icons:logout"
      @click="onLogOut"
      class="ml-2"
    ></UButton>
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import SideBar from "./SideBar.vue";
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const authstore = useMyAuthStore();
// const authApi = useAuth();
import { type VerticalNavigationLink } from "#ui/types";
const links: VerticalNavigationLink[] = [
  { label: "المستخدم", to: "/deleteuser", icon: "mdi:user" },
  { label: "البطولات", to: "/tournament", icon: "mdi:tournament" },
];
if (
  userStore.roles?.includes("SuperAdmin") ||
  userStore.roles?.includes("StaffAdmin")
) {
  links.push(
    { label: "اكواد ", to: "/influncerCode", icon: "mdi:voucher" },
    // {label:"اكواد ",to:"/promoCode",icon:"mdi:voucher" ,},
    { label: "المستخدمين ", to: "/user", icon: "mdi:users" },
    { label: "الاشعارات ", to: "/notification", icon: "mdi:bell" },
    {
      label: "الاكونتات البرمجية ",
      to: "/ServiceAccount",
      icon: "pajamas:code",
    },
    { label: "الملف الثابت", to: "/assets", icon: "mdi:files" },
    { label: "الاحصائيات", to: "/statistics", icon: "mdi:chart-line" }
  );
}
if (userStore.roles?.includes("Streamer")) {
  links.push({
    label: "البث",
    to: "/stream",
    icon: "material-symbols-light:live-tv-outline",
  });
}

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
@keyframes move-background {
  0% {
    background-position: 0 0; /* Start */
  }
  100% {
    background-position: 100% 0; /* End position (adjust as needed) */
  }
}
.background {
  animation: move-background  5s linear infinite;
}
</style>
