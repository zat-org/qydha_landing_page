<template>
  <div v-if="
    playerState.player.state == 'Approved' &&
    playerState.team?.state == 'Approved'
  ">
    <div class="flex flex-col gap-2 bg-green-500/50 p-5 rounded-xl">
      <h2 class="Result-header">تم قبول فريقك بتجارب الأداء</h2>
      <div class="space-y-2" v-if="playerState.player.teamId && playerState.team">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
          <UIcon name="ri:team-fill" class="me-1" /> الفريق الخاص بك
        </span>
        <StateResultTeamData :team-data="playerState.team" :level="playerState.level"
          :tableNumber="playerState.tableNumber" />
      </div>
      <div class="text-center">
        <UButton color="red" icon="simple-line-icons:close" class="mb-2" @click="sendMessage">
          للاعتذار عن الحضور
        </UButton>
        <UAlert class="" icon="hugeicons:alert-02" color="red" variant="soft">
          <template #icon="{ icon }">
            <UIcon :name="icon" class="text-2xl" />
          </template>
          <template #description>
            <div class="text-red-600">
              <p class="text-right">
                لتتمكن من المشاركة يجب احضار فحص طبي ورقي موقع و مختوم.
              </p>

              <UButton color="red" variant="solid" class="mt-2"
                to="https://drive.google.com/file/d/1lb_k7GKeHcPNVdEKqRGjTm8-qcLucMgv/view" target="_blank">
                لتحميل النموذج اضغط هنا</UButton>
            </div>
          </template>
        </UAlert>
        <UAlert class="mt-2" icon="oi:book" color="green" variant="soft">
          <template #icon="{ icon }">
            <UIcon :name="icon" class="text-2xl" />
          </template>
          <template #description>
            <div class="text-green-600">
              <p class="text-right">للاطلاع على قوانين البطولة</p>

              <UButton color="green" variant="solid" class="mt-2"
                to="https://drive.google.com/file/d/1TzH4HmuMdITwekpGN3d4zA1KHHaUIVpy/view?usp=sharing" target="_blank">
                تحميل الملف
              </UButton>
            </div>
          </template>
        </UAlert>
        <div class="text-center mt-2">
          <UButton target="_blank" label="موقع البطولة علي جوجل ماب " icon="logos:google-maps"
            to="https://www.google.com/maps?q=24.6489763,46.6511424&entry=gps&lucs=,94231799,94224825,94227247,94227248,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTI5LjEuODA5MjAYACCenQoqYyw5NDIzMTc5OSw5NDIyNDgyNSw5NDIyNzI0Nyw5NDIyNzI0OCw0NzA3MTcwNCw0NzA2OTUwOCw5NDIxODY0MSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICQUU%3D&g_st=com.google.maps.preview.copy" />
        </div>

        <div class="text-center mt-2">
          <UButton color="amber" icon="mdi:bracket" class=""
            :to="`https://qydha.com/championship?group=${playerState.team.groupId}`" target="_blank">توجه الى جدول
            البطولة
          </UButton>
        </div>
      </div>
      <!-- <StateResultPlayerData :playerState="playerState" /> -->
    </div>
  </div>
  <!-- <div v-if="playerState.player.state == 'Approved' && playerState.player.teamId == null">
    <div class="flex flex-col gap-5 bg-amber-400/75 p-5 rounded-xl">
      <h2 class="Result-header">تحتاج الى تحديد فريقك</h2>
      <StateResultPlayerData :playerState="playerState" />
      <div class="text-center">
        <UButton label="حدد فريقك مع خويك" to="/register-baloot-olympics-teams" />
      </div>
    </div>
  </div>
  <div v-if="playerState.player.state == 'Pending'">
    <div class="flex flex-col gap-5 bg-amber-400/75 p-5 rounded-xl">
      <h2 class="Result-header">تحتاج الى تحديث بياناتك</h2>
      <StateResultPlayerData :playerState="playerState" />
      <div class="text-center">
        <UButton label="تواصل معنا لاتمام البيانات" @click="sendMessage" />
      </div>
    </div>
  </div> -->

  <div v-else>
    <div class="flex flex-col gap-5 bg-red-300 p-5 rounded-xl">
      <h2 class="Result-header">تم استبعادك من تجارب الأداء</h2>
      <!-- <StateResultPlayerData :playerState="playerState" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type State } from "~/models/Player";
// const googlemap_link = `
// https://www.google.com/maps/place/24%C2%B038'56.3%22N+46%C2%B039'04.1%22E/@24.6489763,46.6485675,17z/data=!3m1!4b1!4m4!3m3!8m2!3d24.6489763!4d46.6511424?entry=ttu&g_ep=EgoyMDI0MDgyNi4wIKXMDSoASAFQAw%3D%3D
// `
const props = defineProps<{ playerState: State }>();
const sendMessage = () => {
  const phoneNumber = "+966558441666";
  const message = ` الرقم المرجعي  ${props.playerState.player.id}
  رقم الفريق ${props.playerState.team?.id}
  الاسم ${props.playerState.player.name}
ارغب بالاعتذار عن حضور تجارب الاداء      `; // Custom message text
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};
</script>

<style>
.Result-header {
  @apply text-xl font-bold text-center;
}
</style>
