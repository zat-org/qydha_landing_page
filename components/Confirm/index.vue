<template>
  <div class="flex justify-center w-full">
    <UCard class="w-[95%] max-w-[1000px]">
      <UTabs
        v-model="selectedTab"
        orientation="vertical"
        class="w-full"
        :items="items"
        :ui="{
          list: {
            width: 'w-48',
            base: 'hidden',
          },
          wrapper: 'flex items-center gap-4',
        }">
        <template #Regesteration="{ item }">
          <div class="flex flex-col gap-5 justify-center items-center w-full">
            <h1 class="text-xl text-center md:text-2xl font-bold">
              برجاء ادخال الكود المرجعي للاعبين
            </h1>

            <UForm
              :state="regesterationState"
              :schema="regesterationscheam"
              @submit="onSubmit"
              class="flex flex-col gap-5 w-full bg-white">
              <div
                class="flex flex-col md:flex-row gap-2 md:gap-10 items-center justify-center w-full transition-all duration-300">
                <div class="rounded-xl">
                  <UFormGroup
                    label="الرقم المرجعي للاعب الاول"
                    name="firstPlayerId">
                    <UButtonGroup orientation="horizontal">
                      <UButton  disabled icon="ri:number-1" />
                      <UInput v-model="regesterationState.firstPlayerId" />
                    </UButtonGroup>
                  </UFormGroup>
                </div>
                <div class="rounded-xl">
                  <UFormGroup
                    label="الرقم المرجعي للاعب الثاني"
                    name="secondPlayerId">
                    <UButtonGroup orientation="horizontal">
                      <UButton disabled icon="ri:number-2" />
                      <UInput v-model="regesterationState.secondPlayerId" />
                    </UButtonGroup>
                  </UFormGroup>
                </div>
              </div>
              <UAlert icon="hugeicons:alert-02" color="white" variant="solid">
                <template #description>
                  سيتم ارسال كود لكل لاعب من خلال الواتس اب
                  <UIcon name="logos:whatsapp-icon" class="me-2" />و الايميل
                  <UIcon name="twemoji:envelope-with-arrow" />
                  المستخدمان فى التسجيل للبطولة
                </template>
              </UAlert>
              <UAlert
                v-if="sendError"
                icon="material-symbols:error"
                color="red"
                variant="soft"
                :description="sendError" />
              <div class="flex justify-center">
                <UButton
                  :loading="sendOtpREQ.status.value == 'pending'"
                  variant="outline"
                  icon="bi:send"
                  type="submit"
                  label="ارسال "
                  class="w-full md:w-1/2 transition-all duration-300"
                  block />
              </div>
            </UForm>
          </div>
        </template>
        <template #Confirmation="{ item }">
          <UButton
            icon="ic:baseline-arrow-forward"
            label="  اتعديل الكود المرجعي"
            size="2xs"
            color="gray"
            @click="onback" />
          <UForm
            class="flex flex-col gap-5 md:gap-10 mt-5"
            :state="confirmationState"
            :schema="confirmationscheam"
            @submit="ConirmationSubmit">
            <div
              class="flex flex-col md:gap-10 gap-5 justify-center items-center transition-all duration-300">
              <UFormGroup label="" name="firstPlayerOtp">
                <p
                  class="mb-2 text-center text-xl lg:text-3xl flex items-center justify-center">
                  <span
                    class="bg-green-500 h-8 w-8 me-2 rounded-lg flex justify-center items-center">
                    <UIcon name="ri:number-1" class="text-white" />
                  </span>
                  كود اللاعب الاول
                </p>
                <!-- <UButton icon="ri:number-1" class="md:px-4" /> -->
                <OtpInput v-model="confirmationState.firstPlayerOtp" />
              </UFormGroup>
              <UFormGroup label="" name="secondPlayerOtp">
                <p
                  class="mb-2 text-center text-xl lg:text-3xl flex items-center justify-center">
                  <span
                    class="bg-green-500 h-8 w-8 me-2 rounded-lg flex justify-center items-center">
                    <UIcon name="ri:number-2" class="text-white" />
                  </span>
                  كود اللاعب الثاني
                </p>
                <OtpInput v-model="confirmationState.secondPlayerOtp" />
              </UFormGroup>
            </div>
            <UAlert
              class="w-full md:w-1/2 mx-auto"
              v-if="confirmError"
              icon="material-symbols:error"
              color="red"
              variant="soft"
              :description="confirmError" />
            <div class="flex justify-center">
              <UButton
                :loading="confirmOtpREQ.status.value == 'pending'"
                variant="outline"
                label="ارسال"
                type="submit"
                icon="bi:send"
                block
                class="w-full md:w-1/2 transition-all duration-300" />
            </div>
            <StateResultTeamData
              v-if="teamdata"
              :teamData="teamdata"
              class="w-full md:w-1/2 mx-auto" />
            <UButton
              v-if="teamdata"
              block
              class="w-full md:w-1/2 mx-auto"
              label="لتتاكد من حالتك في البطولة"
              to="/olympics-player-state" />
          </UForm>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { type TeamData } from "~/models/Player";

import { object, string } from "yup";
const items = [
  {
    slot: "Regesteration",
    label: "تسجيل  ",
  },
  {
    slot: "Confirmation",
    label: "تاكيد  ",
  },
];
const selectedTab = ref(0);
const regesterationState = reactive({
  firstPlayerId: "",
  secondPlayerId: "",
});
const regesterationscheam = object({
  firstPlayerId: string().required("يرجي ادخال الرقم المرجعي للاعب الاول"),
  secondPlayerId: string().required("يرجي ادخال الرقم المرجعي للاعب الثاني"),
});
const confirmationState = reactive({
  firstPlayerOtp: "",
  secondPlayerOtp: "",
});
const confirmationscheam = object({
  firstPlayerOtp: string()
    .required("يرجي ادخال كود للاعب الاول")
    .length(6, "يرجي ادخال كود كامل"),
  secondPlayerOtp: string()
    .required("يرجي ادخال كود  للاعب الثاني")
    .length(6, "يرجي ادخال كود كامل"),
});
const toast = useToast();
const leagueApi = useLeague();
const sendOtpREQ = await leagueApi.sendOtp();
const sendError = ref("");
const requestid = ref("");
const onSubmit = async () => {
  sendError.value = "";
  await sendOtpREQ.fetchREQ(
    regesterationState.firstPlayerId,
    regesterationState.secondPlayerId
  );
  if (sendOtpREQ.status.value == "success" && sendOtpREQ.data.value) {
    toast.add({ title: "تم ارسال الكود بنجاح" });
    // pass requestid

    requestid.value = sendOtpREQ.data.value.data.requestId;
    selectedTab.value = 1;
  }
  if (sendOtpREQ.status.value == "error" && sendOtpREQ.error.value) {
    // toast.add({ title: "يرجي التاكد من الكود" });
    sendError.value = sendOtpREQ.error.value.data?.message!;
  }
};

const confirmOtpREQ = await leagueApi.confirmOtp();
const teamdata = ref<TeamData | null>(null);
const confirmError = ref<string|null>("");
const ConirmationSubmit = async () => {
  confirmError.value = "";
  teamdata.value = null;
  await confirmOtpREQ.fetchREQ(
    confirmationState.firstPlayerOtp,
    confirmationState.secondPlayerOtp,
    requestid.value
  );
  if (confirmOtpREQ.status.value == "success" && confirmOtpREQ.data.value) {
    toast.add({ title: "تم تاكيد وجودك في الفريق" });
    teamdata.value = confirmOtpREQ.data.value.data;
  } else if (
    confirmOtpREQ.status.value == "error" &&
    confirmOtpREQ.error.value
  ) {
    // console.log(confirmOtpREQ.error.value?.message);
    confirmError.value = confirmOtpREQ.error.value.data?.message!;

    // toast.add({ title: "يرجي التاكد من الكود" });
  }
};
const onback = () => {
  selectedTab.value = 0;
  confirmationState.firstPlayerOtp = "";
  confirmationState.secondPlayerOtp = "";
  teamdata.value = null;
  confirmError.value = null;
};
</script>

<style></style>
