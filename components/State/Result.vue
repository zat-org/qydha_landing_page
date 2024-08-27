<template>
  <div v-if="playerState.player.state == 'Approved' && playerState.team?.state == 'Approved'">
    <div class="flex flex-col gap-2 bg-green-500/50 p-5 rounded-xl">
      <h2 class="Result-header">تم قبول فريقك بتجارب الأداء</h2>
      <div class="space-y-2" v-if="playerState.player.teamId && playerState.team">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
          <UIcon name="ri:team-fill" class="me-1" /> الفريق الخاص بك
        </span>
        <StateResultTeamData :team-data="playerState.team" />
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
                لتتمكن من المشاركة يجب احضار فحص طبي ورقي موقع و مختوم، أو سيتم استبعادك من البطولة.
              </p>

              <UButton color="red" variant="solid" class="mt-2"
                to="https://drive.google.com/file/d/1lb_k7GKeHcPNVdEKqRGjTm8-qcLucMgv/view" target="_blank">
                لتحميل
                النموذج اضغط هنا</UButton>
            </div>
          </template>
        </UAlert>
        <UAlert class="mt-2" icon="oi:book" color="green" variant="soft">
          <template #icon="{ icon }">
            <UIcon :name="icon" class="text-2xl" />
          </template>
          <template #description>
            <div class="text-green-600">

              <p class="text-right">
                للاطلاع على قوانين البطولة
              </p>

              <UButton color="green" variant="solid" class="mt-2"
                to="https://drive.google.com/file/d/1TzH4HmuMdITwekpGN3d4zA1KHHaUIVpy/view?usp=sharing" target="_blank">
                تحميل الملف
              </UButton>
            </div>
          </template>
        </UAlert>
        <UButton color="amber" icon="mdi:bracket" class="mt-5"
          :to="`https://qydha.com/championship?group-id=${playerState.team.groupId}`" target="_blank">توجه الى جدول
          البطولة
        </UButton>


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

  <div v-if="playerState.player.state == 'Rejected' || playerState.team?.state == 'Rejected'">
    <div class="flex flex-col gap-5 bg-red-300 p-5 rounded-xl">
      <h2 class="Result-header">تم استبعادك من تجارب الأداء</h2>
      <!-- <StateResultPlayerData :playerState="playerState" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type State } from "~/models/Player";

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
