<template>
  <UCard
    :ui="{
      body: 'p-6 space-y-4',
      header: 'p-4 border-b text-xl font-bold text-primary flex items-center gap-2',
      footer: 'bg-gray-50 dark:bg-gray-900 p-4 rounded-b-xl border-t mt-4'
    }"
  >
    <template #header>
      <span class="i-material-symbols:edit text-lg text-primary" />
      تعديل بيانات اللاعب
    </template>
    <UForm
      :state="state"
      :schema="schema"
      ref="PlayerForm"
      @submit="onSubmit"
      class="space-y-5"
      autocomplete="off"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="اسم اللاعب" name="name">
          <UInput
            v-model="state.name"
            trailing-icon="i-material-symbols:person"
            placeholder="ادخل اسم اللاعب"
            autofocus
            class="w-full"
          />
        </UFormField>

        <UFormField label="البريد الالكتروني" name="email">
          <UInput
            v-model="state.email"
            trailing-icon="i-material-symbols:mail"
            placeholder="example@email.com"
            class="w-full"
            inputmode="email"
          />
        </UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="رقم الجوال" name="phone">
          <AsyncPhoneInput
            v-model="state.phone"
            dir="ltr"
            placeholder="مثال: +20123456789"
            class="w-full"
          />
        </UFormField>

        <UFormField label="اسم المستخدم على قيدها" name="qydhaUsername">
          <UInput
            v-model="state.qydhaUsername"
            trailing-icon="i-material-symbols:account-circle"
            placeholder="اسم مستخدم قيدها"
            class="w-full"
          />
        </UFormField>
      </div>
    </UForm>
    <template #footer>
      <div class="flex  gap-3 justify-between items-center">
        <UButton
          label="حفظ التعديلات"
          color="primary"
          icon="i-material-symbols:check-circle"
          class="px-6 py-2 font-bold"
          :loading="updatePlayerREQ.status.value === 'pending'"
          @click="PlayerForm?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          icon="i-material-symbols:close"
          class="px-4 py-2"
          @click="emit('close')"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import type { IPlayer, IPlayerCreate } from "~/models/tournamentTeam";
const props = defineProps<{ player: IPlayer }>();

const PlayerForm = ref<any>();
const emit = defineEmits(['close'])
const route = useRoute();
const tour_id = route.params.id.toString();
// const getplayerREQ = await useTournamentPlayer().getPlayer();
// getplayerREQ.fetchREQ(tour_id, props.player.id);
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
const toast = useToast()
const updatePlayerREQ = await useTournamentPlayer().updatePlayer();

const onSubmit = async () => {
  await updatePlayerREQ.fetchREQ(tour_id, props.player.id, state);
  if (updatePlayerREQ.status.value == "success") {

    refreshNuxtData('getAllTourTeams')
    toast.add({
      title: "تم تعديل بيانات اللاعب بنجاح",
      color: "success",
      icon: "material-symbols:check",
    })
    emit('close')
  }

  if (updatePlayerREQ.status.value == "error" && updatePlayerREQ.error.value) {
    if (updatePlayerREQ.error.value.statusCode == 400) {
        if ((updatePlayerREQ.error.value.data as any).data.code ==
        "InvalidBodyInput"
      ){
        PlayerForm.value?.setErrors([
          { name: "phone", message: "برجاء ادخال رقم هاتف صحيح يستخدم whatsapp" },
        ]);

      }
      if (
        (updatePlayerREQ.error.value.data as any).data.code ==
        "UserAlreadyExistInTournamentAsPlayerError"
      ) {
        PlayerForm.value?.setErrors([
          { name: "qydhaUsername", message: "هذا المستخدم موجود بالفعل" },
        ]);
      } else {

        Object.entries(updatePlayerREQ.error.value.data?.errors!).forEach(
          (e) => {
            PlayerForm.value?.setErrors([
              { name: e[0].toLowerCase(), message: e[1][0] },
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
        { name: "qydhaUsername", message: "هذا المستخدم غير موجود" },
      ]);
    }
  }
};
</script>

<style></style>
