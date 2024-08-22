<template>
  <div v-if="playerState.player.state == 'Approved' && playerState.player.teamId != null">
    <div class="flex flex-col gap-5 bg-green-500/50 p-5 rounded-xl">
      <h2 class="Result-header">تم قبولك فى تجارب الأداء</h2>
      <StateResultPlayerData :playerState="playerState" />
    </div>
  </div>
  <div v-if="playerState.player.state == 'Approved' && playerState.player.teamId == null">
    <div class="flex flex-col gap-5 bg-amber-400/75 p-5 rounded-xl">
      <h2 class="Result-header">تحتاج الى تحديد فريقك</h2>
      <StateResultPlayerData :playerState="playerState" />
      <div class="text-center">
        <UButton :disabled="true" label="حدد فريقك مع خويك" to="/register-baloot-olympics-teams" />
        <p>سيتم فتح باب تحديد الفرق خلال ساعات</p>
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
  </div>

  <div v-if="playerState.player.state == 'Rejected'">
    <div class="flex flex-col gap-5 bg-red-300 p-5 rounded-xl">
      <h2 class="Result-header">تم رفضك فى تجارب الأداء</h2>
      <StateResultPlayerData :playerState="playerState" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type State } from "~/models/Player";

const props = defineProps<{ playerState: State }>();
const sendMessage = () => {
  const phoneNumber = "+966558441666";
  const message = ` الرقم المرجعي  ${props.playerState.player.id}
  الاسم ${props.playerState.player.name}
  بخصوص  التسجيل في بطولة المملكة   
      `; // Custom message text
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
