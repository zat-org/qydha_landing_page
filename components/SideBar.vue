<template>
  <USlideover dir="rtl" title="قيدها " description="الحاسبة الذكية للعبة البلوت " side="right" class="z-[100]">
    <template #body>
      <UNavigationMenu orientation="vertical" :items="links" class="text-right rtl-navigation">
      </UNavigationMenu>


    </template>
  </USlideover>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
const userStore = useMyAuthStore();

const links = computed(() => {
  const result: any[][] = [[], [], [], []];
  result[3].push({
    label: "البطولات", to: "/tournament",
    onSelect: () => {
      emit("close");
    }
  });
if( userStore.roles?.includes("SuperAdmin")){
  result[0].push({
      label: 'الحسابات البرمجية',
      to: '/serviceAccount'
    })
}

  if (
    userStore.roles?.includes("SuperAdmin") ||
    userStore.roles?.includes("StaffAdmin")
  ) {
    result[0].push(
      {
        label: "المستخدمين ", to: "/user", onSelect: () => {
          emit("close");
        }
      },
    );
    result[1].push(
      {
        label: "التسويق", to: "/marketing", onSelect: () => {
          emit("close");
        }
      },
      // { label: "الملف الثابت", to: "/assets", },
      {
        label: "الاحصائيات", to: "/statistics", onSelect: () => {
          emit("close");
        }
      },
      {
        label: "الاشعارات ", to: "/notification", onSelect: () => {
          emit("close");
        }
      },
      {
        label: "اكواد ", to: "/Codes", onSelect: () => {
          emit("close");
        }
      },
    );
  }
  if (userStore.roles?.includes("Streamer")) {
    result[2].push({
      label: "البث",
      to: "/stream",
      onSelect: () => {
        emit("close");
      }
    });
  }
  return result;
});
const emit = defineEmits(["close"]);
const handleNavClick = () => {
  emit("close");
}
</script>

<style>
.rtl-navigation {
  direction: rtl;
  text-align: right;
}

.rtl-navigation * {
  direction: rtl;
  text-align: right;
}
</style>
