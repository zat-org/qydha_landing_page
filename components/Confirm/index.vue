<template>
  <div class="flex justify-center   w-full ">
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
              class="flex flex-col gap-5 bg-white">
              <div
                class="flex flex-col md:flex-row gap-2 md:gap-10 items-center justify-center w-full transition-all duration-300">
                <div class="rounded-xl">
                  <UFormGroup
                    label="الرقم المرجعي للاعب الاول"
                    name="firstPlayerId">
                    <UButtonGroup orientation="horizontal">
                      <UButton icon="ri:number-1" />
                      <UInput v-model="regesterationState.firstPlayerId" />
                    </UButtonGroup>
                  </UFormGroup>
                </div>
                <div class="rounded-xl">
                  <UFormGroup
                    label="الرقم المرجعي للاعب الثاني"
                    name="secondPlayerId">
                    <UButtonGroup orientation="horizontal">
                      <UButton icon="ri:number-2" />
                      <UInput v-model="regesterationState.secondPlayerId" />
                    </UButtonGroup>
                  </UFormGroup>
                </div>
              </div>
              <p class="text-xs text-gray-800/55 text-center">
                سيتم ارسال الكود علي الواتس اب وعن طريق الايميل الذي تم التسجيل
                بهما
              </p>
              <div class="flex justify-center">
                <UButton
                  :loading="sendOtpREQ.status.value=='pending'"
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
          <UButton icon="ic:baseline-arrow-forward" label="  اتعديل الكود المرجعي" size="2xs" color="gray" @click="selectedTab=0"/>
          <UForm
            class="flex flex-col gap-10"
            :state="confirmationState"
            :schema="confirmationscheam"
            @submit="ConirmationSubmit">
            <div
              class="flex flex-col  md:gap-10 gap-5 justify-center items-center transition-all duration-300">
              <UFormGroup label="كود الاعب الاول" name="firstPlayerOtp">
                <UButtonGroup orientation="horizontal">
                  <UButton icon="ri:number-1" class="md:px-4"/>
                  <OtpInput v-model="confirmationState.firstPlayerOtp" />
                </UButtonGroup>
              </UFormGroup>
              <UFormGroup label="كود الاعب الثاني" name="secondPlayerOtp">
                <UButtonGroup orientation="horizontal">
                  <UButton icon="ri:number-2"class="md:px-4 " />
                  <OtpInput v-model="confirmationState.secondPlayerOtp" />
                </UButtonGroup>
              </UFormGroup>
            </div>
            <div class="flex justify-center">
              <UButton
              :loading="confirmOtpREQ.status.value=='pending'"
                variant="outline"
                label="ارسال"
                type="submit"
                icon="bi:send"

                block
                class="w-full md:w-1/2 transition-all duration-300" />
            </div>
          </UForm>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { useMyTabStore } from "~/store/tab";
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
const selectedTab = ref(1);
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
const requestid = ref("text");
const onSubmit = async () => {
  await sendOtpREQ.fetchREQ(
    regesterationState.firstPlayerId,
    regesterationState.secondPlayerId
  );
  if (sendOtpREQ.status.value == "success") {
    toast.add({ title: "تم ارسال الكود بنجاح" });
    // pass requestid
    selectedTab.value = 1;
  }
  if (sendOtpREQ.status.value == "error") {
    toast.add({ title: "يرجي التاكد من الكود" });
  }
};
const confirmOtpREQ = await leagueApi.confirmOtp();

const ConirmationSubmit = async () => {
  await confirmOtpREQ.fetchREQ(
    confirmationState.firstPlayerOtp,
    confirmationState.secondPlayerOtp,
    requestid.value
  );
  if (confirmOtpREQ.status.value == "success") {
    toast.add({ title: "تم تاكيد وجودك في الفريق" });
  } else if (confirmOtpREQ.status.value == "error") {
    toast.add({ title: "يرجي التاكد من الكود" });
  }
};
</script>

<style></style>
