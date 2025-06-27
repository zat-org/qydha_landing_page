<template>
  <div style="display: flex; flex-direction: row" dir="ltr">
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
      separator="-"
      inputType="number"
      :num-inputs="6"
      :value="modelValue"
      :should-auto-focus="false"
      :should-focus-order="false"
      @on-change="onchange"
      :placeholder="['*', '*', '*', '*', '*', '*']" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VOtpInput from "vue3-otp-input";
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);
const bindModal = ref("");

const onchange = (value: string) => {

  emit("update:modelValue", value);
};
const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const model = defineModel<string>();

</script>
<style>
.otp-input {
  padding: 5px;
  margin: 0 5px;
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
