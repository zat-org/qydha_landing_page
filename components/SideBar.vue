<template>
  <USlideover
    side="left"
    class="z-[100]"
    :ui="{ base: 'w-[200px] ', width: 'w-[250px] max-w-[250px]' }"
  >
    <UVerticalNavigation :links="links" :ui="{ size: 'text-lg' }" @click="handleNavClick">
      <template #icon="{ link, isActive }">
        <component
          :is="link.iconComponent"
          class="text-xl hover:text-black z-10"
        >
        </component>
      </template>
    </UVerticalNavigation>
  </USlideover>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import iconUser from "~/components/Icon/User.vue";
import iconTournament from "~/components/Icon/Tournament.vue";
import iconCode from "~/components/Icon/Code.vue";
import iconNotification from "~/components/Icon/Notification.vue";
import iconFiles from "~/components/Icon/Files.vue";
import iconChart from "~/components/Icon/Chart.vue";
import iconProgramingCode from "~/components/Icon/ProgramingCode.vue";
import iconLive from "~/components/Icon/Live.vue";
import iconMarket from "~/components/Icon/Market.vue";

const slideover = useSlideover();
const userStore = useMyAuthStore();
import { type VerticalNavigationLink } from "#ui/types";
interface CustomNavigationLink extends VerticalNavigationLink {
  iconComponent?: Component;
}

const links = computed(() => {
  const result: CustomNavigationLink[] = [];
  result.push({
    label: "البطولات",
    to: "/tournament",
    iconComponent: iconTournament,
  });

  if (
    userStore.roles?.includes("SuperAdmin") ||
    userStore.roles?.includes("StaffAdmin")
  ) {
    result.push(
      {
        label: "اكواد ",
        to: "/influncerCode",
        icon: "",
        iconComponent: iconCode,
      },
      { label: "المستخدمين ", to: "/user", iconComponent: iconUser },
      {
        label: "الاشعارات ",
        to: "/notification",
        iconComponent: iconNotification,
      },
      { label: "الملف الثابت", to: "/assets", iconComponent: iconFiles },
      { label: "الاحصائيات", to: "/statistics", iconComponent: iconChart },
      { label: "التسويق", to: "/marketing", iconComponent: iconMarket },

      {
        label: "الاكونتات البرمجية ",
        to: "/ServiceAccount",
        iconComponent: iconProgramingCode,
      }
    );
  }
  if (userStore.roles?.includes("Streamer")) {
    result.push({
      label: "البث",
      to: "/stream",
      iconComponent: iconLive,
    });
  }
  return result;
});

const handleNavClick =()=>{
  slideover.close()
}
</script>

<style></style>
