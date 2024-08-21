<template>
  <div v-if="playerstate.state == 'Approved' && playerstate.teamId != null">
    <div class="flex flex-col gap-5 bg-green-500/50 p-5 rounded-xl">
      <h2 class="">تم قبولك في البطوله ومتاح للعب لوجودك في الفريق</h2>
      <h3><UIcon name="mdi:user" /> الاسم :{{ playerstate.name }}</h3>

      <h3>
        <UIcon name="ic:baseline-phone" /> رقم الهاتف :{{ playerstate.phone }}
      </h3>
      <h3>
        <UIcon name="ic:baseline-email" /> الايميل :{{ playerstate.email }}
      </h3>

      <h3>
        <UIcon name="mdi:key" /> الرقم المرجعي الخاص بك :{{ playerstate.id }}
      </h3>
      <h3 v-if="playerstate.teamId">
        <UIcon name="ri:team-fill" />
        الفريق الخاص بك :{{ playerstate.teamId }}
      </h3>

      <h3 v-if="playerstate.comment">
        <UIcon name="mdi:comment" />
        التعليق :{{ playerstate.comment }}
      </h3>
    </div>
  </div>
  <div v-if="playerstate.state == 'Approved' && playerstate.teamId == null">
    <div class="flex flex-col gap-5 bg-orange-500/50 p-5 rounded-xl">
      <h2>تم قبولك في البطوله لكن يجب ان تسجل في فريق</h2>
      <h3><UIcon name="mdi:user" /> الاسم :{{ playerstate.name }}</h3>

      <h3>
        <UIcon name="ic:baseline-phone" /> رقم الهاتف :{{ playerstate.phone }}
      </h3>
      <h3>
        <UIcon name="ic:baseline-email" /> الايميل :{{ playerstate.email }}
      </h3>

      <h3>
        <UIcon name="mdi:key" /> الرقم المرجعي الخاص بك :{{ playerstate.id }}
      </h3>
      <h3 v-if="playerstate.teamId">
        <UIcon name="ri:team-fill" />
        الفريق الخاص بك :{{ playerstate.teamId }}
      </h3>

      <h3 v-if="playerstate.comment">
        <UIcon name="mdi:comment" />
        التعليق :{{ playerstate.comment }}
      </h3>
      <div>
        <UButton label="للتسجيل في فريق" to="/register-baloot-olympics-teams" />
      </div>
    </div>
  </div>
  <div v-if="playerstate.state == 'Pending'">
    <div class="flex flex-col gap-5 bg-orange-500/50 p-5 rounded-xl">
      <h2>تحت الانتظار لاكمال البيانات</h2>
      <h3><UIcon name="mdi:user" /> الاسم :{{ playerstate.name }}</h3>

      <h3>
        <UIcon name="ic:baseline-phone" /> رقم الهاتف :{{ playerstate.phone }}
      </h3>
      <h3>
        <UIcon name="ic:baseline-email" /> الايميل :{{ playerstate.email }}
      </h3>

      <h3>
        <UIcon name="mdi:key" /> الرقم المرجعي الخاص بك :{{ playerstate.id }}
      </h3>
      <h3 v-if="playerstate.teamId">
        <UIcon name="ri:team-fill" />
        الفريق الخاص بك :{{ playerstate.teamId }}
      </h3>

      <h3 v-if="playerstate.comment">
        <UIcon name="mdi:comment" />
        التعليق :{{ playerstate.comment }}
      </h3>
      <div>
        <UButton label="تواصل معنا لاتمام البيانات" @click="sendMessage" />
      </div>
    </div>
  </div>

  <div v-if="playerstate.state == 'Rejected'">
    <div class="flex flex-col gap-5 bg-red-500/50 p-5 rounded-xl">
      <h2>تم رفض طلبك للانضمام في البطوله</h2>
      <h3><UIcon name="mdi:user" /> الاسم :{{ playerstate.name }}</h3>

      <h3>
        <UIcon name="ic:baseline-phone" /> رقم الهاتف :{{ playerstate.phone }}
      </h3>
      <h3>
        <UIcon name="ic:baseline-email" /> الايميل :{{ playerstate.email }}
      </h3>

      <h3>
        <UIcon name="mdi:key" /> الرقم المرجعي الخاص بك :{{ playerstate.id }}
      </h3>
      <h3 v-if="playerstate.teamId">
        <UIcon name="ri:team-fill" />
        الفريق الخاص بك :{{ playerstate.teamId }}
      </h3>

      <h3 v-if="playerstate.comment">
        <UIcon name="mdi:comment" />
        التعليق :{{ playerstate.comment }}
      </h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayerState, type State } from "~/models/Player";

const props = defineProps<{ playerstate: State }>();
const sendMessage = () => {
  const phoneNumber = "+201124475157"; // Replace with the recipient's phone number
  const message = ` الرقم المرجعي  ${props.playerstate.id}
  الاسم ${props.playerstate.name}
  بخصوص  التسجيل في بطولة المملكة   
      `; // Custom message text
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};
</script>

<style>
h2 {
  @apply text-xl font-bold text-center;
}
h3 {
  @apply font-semibold;
}
</style>
