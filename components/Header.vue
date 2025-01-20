<template>
  <div
    class="border-b border-[#F6BD68] bg-[#1d2145] flex flex-row justify-around items-center pb-2 text-white"
  >
    <!-- <UButton class="" color="black" icon="material-symbols:login" variant="outline" size="xs" to="/login"> تسجيل الدخول</UButton> -->

    <UButton
      v-if="authstore.logedin"
      size="sm"
      color="black"
      @click="openNav"
      class="mr-2 block  cursor-pointer"
    >
      <IconTribleDash class="w-5" />
    </UButton>
    <div class="flex justify-center items-center mx-auto">
      <NuxtLink to="/"
        ><img
          src="@/assets/images/qydha-logo.svg"
          class="w-20"
          alt="Qydha Logo"
      /></NuxtLink>
    </div>
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
const authApi = useAuth();
let links = [
  { text: "الرئيسية", link: "" },
  { text: "الخدمات", link: "" },
  { text: "من نحن", link: "" },
  { text: "تواصل معنا", link: "" },
];
const onLogOut = () => {
  user.value = null;
  return navigateTo("/");
};
const slidever = useSlideover();
const openNav = () => {
  slidever.open(SideBar);
};
</script>

<style scoped></style>
