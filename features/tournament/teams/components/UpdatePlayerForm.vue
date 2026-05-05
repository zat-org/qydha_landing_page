<template>
  <UCard :ui="{ body: 'p-6 space-y-4', header: 'p-4 border-b text-xl font-bold text-primary flex items-center gap-2', footer: 'bg-gray-50 dark:bg-gray-900 p-4 rounded-b-xl border-t mt-4' }">
    <template #header>تعديل بيانات اللاعب</template>
    <UForm :state="state" :schema="schema" ref="PlayerForm" @submit="onSubmit" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="اسم اللاعب" name="name"><UInput v-model="state.name" /></UFormField>
        <UFormField label="البريد الالكتروني" name="email"><UInput v-model="state.email" inputmode="email" /></UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="رقم الجوال" name="phone"><AsyncPhoneInput v-model="state.phone" dir="ltr" /></UFormField>
        <UFormField label="اسم المستخدم على قيدها" name="qydhaUsername"><UInput v-model="state.qydhaUsername" /></UFormField>
      </div>
    </UForm>
    <template #footer>
      <div class="flex gap-3 justify-between items-center">
        <UButton label="حفظ التعديلات" color="primary" :loading="updatePlayerREQ.status.value === 'pending'" @click="PlayerForm?.submit()" />
        <UButton label="إلغاء" color="error" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import type { IPlayer, IPlayerCreate } from "~/features/tournament/models/tournamentTeam";
const props = defineProps<{ player: IPlayer }>();
const PlayerForm = ref<any>();
const emit = defineEmits(['close'])
const route = useRoute();
const tour_id = route.params.id.toString();
const state = reactive<IPlayerCreate>({ name: props.player.name, phone: props.player.phone, email: props.player.email, qydhaUsername: props.player.qydhaUserData ? props.player.qydhaUserData.username : "" })
const schema = object({ name: string().required("برجاء ادخال اسم اللاعب").min(4, "اقل عدد للحروف 4"), phone: string().required("برجاء ادخال رقم الهاتف").min(11, "يجب ان يكون رقم الهاتف صحيح"), email: string().email(" برجاء ادخال البريد الالكتروني بشكل صحيح ").required(" برجاء ادخال البريد الالكتروني   "), qydhaUsername: string() })
const toast = useToast()
const updatePlayerREQ = await useTournamentPlayer().updatePlayer();
const onSubmit = async () => {
  await updatePlayerREQ.fetchREQ(tour_id, props.player.id, state);
  if (updatePlayerREQ.status.value == "success") { refreshNuxtData('getAllTourTeams'); toast.add({ title: "تم تعديل بيانات اللاعب بنجاح", color: "success" }); emit('close') }
}
</script>
