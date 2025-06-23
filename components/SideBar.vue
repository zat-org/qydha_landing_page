<template>
  <USlideover side="left" class="z-[100]" :ui="{ base: 'w-[200px] ', width: 'w-[250px] max-w-[250px]' }">
    <UVerticalNavigation :links="links" :ui="{ size: 'text-lg' }" @click="handleNavClick">
      <template #icon="{ link, isActive }">
        <component :is="link.iconComponent" class="text-xl hover:text-black z-10">
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
import iconLive from "~/components/Icon/Live.vue";
import iconMarket from "~/components/Icon/Market.vue";

const slideover = useSlideover();
const userStore = useMyAuthStore();

const links = computed(() => {
  const result: any[][] = [[],[],[],[]];
  result[3].push({ label: "البطولات", to: "/tournament", disabled: true, iconComponent: iconTournament, });

  if (
    userStore.roles?.includes("SuperAdmin") ||
    userStore.roles?.includes("StaffAdmin")
  ) {
    result[0].push(
      { label: "المستخدمين ", to: "/user", iconComponent: iconUser },
  );
  result[1].push(
      { label: "التسويق", to: "/marketing", iconComponent: iconMarket },
      { label: "الملف الثابت", to: "/assets", iconComponent: iconFiles },
      { label: "الاحصائيات", to: "/statistics", iconComponent: iconChart },
      { label: "الاشعارات ", to: "/notification", iconComponent: iconNotification, },
      { label: "اكواد ", to: "/Codes", iconComponent: iconCode, },
    );
  }
  if (userStore.roles?.includes("Streamer")) {
    result[2].push({
      label: "البث",
      to: "/stream",
      iconComponent: iconLive,
    });
  }
  return result;
});

const handleNavClick = () => {
  slideover.close()
}
</script>

<style></style>
