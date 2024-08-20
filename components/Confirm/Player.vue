<template>
  <div class="flex justify-center items-center  bg-gray-100">
    <UCard >
      <div class="flex flex-col gap-5">
        <h2 class="text-2xl">برجاء تسجيل الرقم المرسل اليكم</h2>

        <OtpInput @complete="onComplete" />
      </div>
      <template #footer>
        <UButton label="ارسال" :disabled="otp ? false : true" @click="onSubmit" />
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["complete","done"]);
const otp = ref();
const onComplete = (value: number) => {
  otp.value = value;
};
const onSubmit=()=>{
  // snd otp and datat if every thing is ok
  emit("done");

}
</script>

<style></style>
