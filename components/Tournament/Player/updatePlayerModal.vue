<template>
  <UModal preventClose>
    <UCard>
      <template #header> </template>
      <UForm
        :state="state"
        :schema="schema"
        ref="PlayerForm"
        @submit="onSubmit"
      >
        <UFormField label="اسم الاعب" name="name">
          <UInput v-model="state.name"></UInput>
        </UFormField>
        <UFormField label="الايميل" name=" email'">
          <UInput v-model="state.email"></UInput>
        </UFormField>
        <UFormField label="رقم الهاتف" name="phone">
          <vue-tel-input
            mode="auto"
            :autoFormat="true"
            dir="ltr"
            :validCharactersOnly="true"
            :autoDefaultCountry="true"
            :inputOptions="{ showDialCode: true, showFlags: true }"
            invalidMsg="this phone is invalid "
            :dropdownOptions="{
              showDialCodeInSelection: true,
              showFlags: true,
              showSearchBox: true,
            }"
            v-model="state.phone"
          ></vue-tel-input>
        </UFormField>
        <UFormField label="اسم المستخدم علي قيدها" name="qydhaUsername">
          <UInput v-model="state.qydhaUsername"></UInput>
        </UFormField>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="update" @click="PlayerForm?.submit()" />
          <UButton label="close" @click="emit('close')" color="red" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import type { IPlayer, IPlayerCreate } from "~/models/tournamentTeam";
const props = defineProps<{ player: IPlayer }>();
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
const PlayerForm = ref<any>();
const emit = defineEmits(['close'])
const state = reactive<IPlayerCreate>({
  name: props.player.name,
  phone: props.player.phone,
  email: props.player.email,
  qydhaUsername: props.player.qydhaUserData
    ? props.player.qydhaUserData.username
    : "",
});
const schema = object({
  name: string().required("برجاء ادخال اسم اللاعب").min(4, "اقل عدد للحروف 4"),
  phone: string()
    .required("برجاء ادخال رقم الهاتف")
    .min(11, "يجب ان يكون رقم الهاتف صحيح"),
  email: string()
    .email(" برجاء ادخال البريد الالكتروني بشكل صحيح ")
    .required(" برجاء ادخال البريد الالكتروني   "),
  qydhaUsername: string(),
});
const route = useRoute();
const tour_id = route.params.id.toString();
const updatePlayerREQ = await useTournamentPlayer().updatePlayer();
const onSubmit = async () => {
  await updatePlayerREQ.fetchREQ(tour_id, props.player.id, state);
  if (updatePlayerREQ.status.value == "success") {
    emit('close')
  }

  if (updatePlayerREQ.status.value == "error" && updatePlayerREQ.error.value) {
    if (updatePlayerREQ.error.value.statusCode == 400) {
      
      if (
        updatePlayerREQ.error.value.data?.code ==
        "UserAlreadyExistInTournamentAsPlayerError"
      ) {
        PlayerForm.value?.setErrors([
          { path: "qydhaUsername", message: "هذا المستخدم موجود بالفعل" },
        ]);
      } else {

        Object.entries(updatePlayerREQ.error.value.data?.errors!).forEach(
          (e) => {
            PlayerForm.value?.setErrors([
              { path: e[0].toLowerCase(), message: e[1][0] },
            ]);
          }
        );
      }
    }
    if (
      updatePlayerREQ.error.value.statusCode == 404 &&
      updatePlayerREQ.error.value.data?.code == "EntityNotFound"
    ) {
      PlayerForm.value?.setErrors([
        { path: "qydhaUsername", message: "هذا المستخدم غير موجود" },
      ]);
    }
  }
};
</script>

<style></style>
