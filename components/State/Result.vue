<template>
  <div v-if="playerstate.state == 1 && playerstate.teamId != null">
    <div class="flex flex-col gap-5 bg-green-400/50">
      <h2>تم قبولك في البطوله ومتاح للعب لوجودك في الفريق</h2>
      <h3>الاسم {{ playerstate.name }}</h3>
      <h3>رقم الهاتف{{ playerstate.phone }}</h3>
      <h3>الايميل {{ playerstate.email }}</h3>
      <h3>الرقم المرجعي الخاص بك {{ playerstate.key }}</h3>
    </div>
  </div>
  <div v-if="playerstate.state == 1 && playerstate.teamId == null">
    <div class="flex flex-col gap-5 bg-orange-400/50">
      <h2>تم قبولك في البطوله لكن يجب ان تسجل في فريق</h2>
      <h3>الاسم {{ playerstate.name }}</h3>
      <h3>رقم الهاتف{{ playerstate.phone }}</h3>
      <h3>الايميل {{ playerstate.email }}</h3>
      <h3>الرقم المرجعي الخاص بك {{ playerstate.key }}</h3>
      <div>
        <UButton label="للتسجيل في فريق" to="/register-baloot-olympics-teams" />
      </div>
    </div>
  </div>
  <div v-if="playerstate.state == 2">
    <div class="flex flex-col gap-5 bg-orange-400/50">
      <h2>تحت الانتظار لاكمال البيانات</h2>
      <h3>الاسم {{ playerstate.name }}</h3>
      <h3>رقم الهاتف{{ playerstate.phone }}</h3>
      <h3>الايميل {{ playerstate.email }}</h3>
      <h3>الرقم المرجعي الخاص بك {{ playerstate.key }}</h3>
      <div>
        <UButton label="للتسجيل في فريق" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { State } from "~/models/Player";

const props = defineProps<{ playerstate: State }>();

const sendMessage = () => {
  const phoneNumber = "01124475157"; // Replace with the recipient's phone number
  const message = `
  الرقم المرجعي  ${props.playerstate.key}
  الاسم ${props.playerstate.name}
  بخصوص  التسجيل في بطولة المملكة   
      `; // Custom message text
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};
</script>

<style></style>
