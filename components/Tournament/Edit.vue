<template>
  <UCard :ui="{ base: 'flex flex-col h-full', body: { base: 'grow' } }">
    <template #footer>
      <div class="flex justify-between items-center">
        <UButton
          type="submit"
          label="تعديل"
          color="yellow"
          @click="UpdateForm?.submit()"
        />

        <UButton
          type="button"
          class="ml-auto mr-[10px]"
          v-if="roles?.includes('SuperAdmin') || roles?.includes('StaffAdmin')"
          label=" تعديل الصور والمالك "
          color="yellow"
          @click="openUpdateModal"
        />

        <UButton
          type="button"
          label="عودة"
          color="red"
          @click="navigateTo('/tournament')"
        />
      </div>
    </template>

    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="UpdateForm">
      <div class="flex flex-col gap-2">
        <UFormField name="name" label="الاسم">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField name="description" label="الوصف">
          <UTextarea v-model="state.description" />
        </UFormField>

        <!-- dates -->
        <div class="flex gap-2">
          <UFormField name="startAt" label="تبداء" class="grow">
            <VueDatePicker
              v-model="state.startAt"
              :enable-time-picker="false"
              dir="ltr"
              position="right"
            />
          </UFormField>

          <UFormField name="endAt" label="تنتهي" class="grow">
            <VueDatePicker
              v-model="state.endAt"
              :enable-time-picker="false"
              dir="ltr"
              position="right"
            />
          </UFormField>
        </div>

        <div class="flex gap-2">
          <!-- 
          <UFormField class="grow" name="ownerId" label="المالك" v-if="roles?.includes('SuperAdmin')">
            <UInputMenu v-model="state.ownerId" :options="users" :search="search" option-attribute="username"
              value-attribute="id" :loading="allUsersREQ.status.value == 'pending'" />
          </UFormField> -->

          <UFormField class="grow" name="city" label="المدينة">
            <UButtonGroup size="sm" orientation="horizontal" class="flex">
              <UInput v-model="state.city" class="grow" />

              <UButton
                label="اختر الموقع"
                :color="
                  state.location.latitude && state.location.longitude
                    ? 'green'
                    : 'red'
                "
                @click="getLocation"
              />
            </UButtonGroup>
          </UFormField>
        </div>

        <!-- prizes -->
        <div class="flex flex-col gap-5">
          <div class="flex items-end gap-2">
            <UFormField
              name="prizesCurrency"
              label="عملة المكافئة"
              class="grow"
            >
              <UButtonGroup size="sm" orientation="horizontal">
                <UInput v-model="state.prizesCurrency" />
                <UButton
                  icon="ic:baseline-plus"
                  @click="state.prizes.push('')"
                  label="اضافة مركز"
                />
              </UButtonGroup>
            </UFormField>
          </div>
          <div
            class="flex justify-start items-start flex-wrap flex-grow-0 basis-[100px] overflow-y-auto"
          >
            <UFormField
              v-for="(p, index) in state.prizes"
              :name="'prizes[' + index + ']'"
              :label="'المركز' + (index + 1)"
            >
              <UButtonGroup orientation="horizontal" class="flex w-[150px]">
                <UBadge :label="index + 1" color="blue" />
                <UInput v-model="state.prizes[index]" class="grow" />
                <UButton
                  color="red"
                  icon="material-symbols:close"
                  @click="state.prizes.splice(index, 1)"
                ></UButton>
              </UButtonGroup>
            </UFormField>
          </div>
        </div>
      </div>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import "leaflet/dist/leaflet.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { object, string, number, array } from "yup";
import type { ITournament, ITournamentUpdate } from "~/models/tournament";
import { MapInputModal } from "#components";
import { useMyAuthStore } from "~/store/Auth";
import EditModal from "./EditModal.vue";

const UpdateForm = ref<HTMLFormElement>();

const props = defineProps<{ tournament: ITournament }>();
const overlay = useOverlay();

const state = reactive<ITournamentUpdate>({
  name: props.tournament.name,
  description: props.tournament.description,
  city: props.tournament.city,
  location: { longitude: 0, latitude: 0 },
  prizes: props.tournament.prizes,
  prizesCurrency: props.tournament.prizesCurrency,
  startAt: new Date(props.tournament.startAt),
  endAt: new Date(props.tournament.endAt),
  // ownerId: props.tournament.owner.id
});
const schema = object({
  name: string().required("برجاء ادخال الاسم"),
  description: string().required("برجاء ادخال الوصف"),
  city: string().required("برجاء ادخال المدينة"),
  location: object({ longitude: number(), latitude: number() }),
  prizes: array().of(string().required("برجاء ادخال قيمة الجائزة")),
  prizesCurrency: string().required("برجاء ادخال عملة الجائزة"),
  startAt: string()
    .required("برجاء ادخال تاريخ البداية")
    .test(
      "is-valid-range",
      "تاريخ البداية يجب أن يكون قبل تاريخ الانتهاء",
      function (value) {
        const { endAt } = this.parent;
        return !endAt || new Date(value) <= new Date(endAt);
      }
    ),
  endAt: string().required("برجاء ادخال تاريخ الانتهاء"),
  // ownerId: string().required("برجاء ادخال مالك البطولة")
});

const userStore = useMyAuthStore();
const roles = computed(() => {
  if (userStore.user) {
    return userStore.user.user.roles;
  }
});

const tournamentApi = useTournament();
const updateREQ = await tournamentApi.updateTour();
const userApi = useUsers();
const allUsersREQ = await userApi.getAllUsers();
await allUsersREQ.fetchREQ("");
const users = computed(() => {
  return allUsersREQ.data.value?.data.items;
});

const onSubmit = async () => {
  await updateREQ.fetchREQ(props.tournament.id.toString(), state);
  if (updateREQ.status.value == "success") {
    return navigateTo("/tournament");
  } else if (updateREQ.status.value == "error") {
    console.log(updateREQ.error.value);
  }
};

const openUpdateModal = () => {
  overlay.create(EditModal, { props: { tour: props.tournament } }).open();
};

const getLocation = () => {
  overlay.create(MapInputModal, {
    props: {
      lat: state.location.latitude,
      log: state.location.longitude,
    onSuccess(lat: number, log: number) {
      state.location.latitude = lat;
      state.location.longitude = log;
      },
    },
  }).open();
};
</script>

<style scoped></style>
