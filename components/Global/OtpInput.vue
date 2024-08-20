<template>
  <div style="display: flex; flex-direction:row"dir="rtl">
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      :conditionalClass="['one', 'two', 'three', 'four','five']"
      separator="-"
      inputType="number"
      :num-inputs="5"
      v-model:value="bindValue"
      :should-auto-focus="true"
      :should-focus-order="true"
      @on-complete="handleOnComplete"
      :placeholder="['*', '*', '*', '*','*']"
      />
  </div>

</template>

<script setup lang="ts">
import { ref } from "vue";
import VOtpInput from "vue3-otp-input";
const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);

const bindValue = ref<string>(''); // Initialize bindValue
const emit = defineEmits(["complete"])
const handleOnComplete = (value: string) => {

 emit("complete",value)
};


</script>
<style>
.otp-input {
  width: 80px;
  height: 80px;
  padding: 5px;
  margin: 0 10px;
  font-size: 50px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
/* Background colour of an input field with value */

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>