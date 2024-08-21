<template>
  <div class="flex flex-col gap-5">
    <UForm
      :state="state"
      :schema="schema"
      @submit="onSubmit"
      ref="form"
      class="flex gap-3">
      <UFormGroup
        label="ادخل رقم الهاتف المسجل في البطولة"
        name="phonenumber"
        class="grow">
        <vue-tel-input
          mode="auto"
          dir="ltr"
          :defaultCountry="+966"
          :validCharactersOnly="true"
          :inputOptions="{ showDialCode: true }"
          invalidMsg=""
          :autoFormat="true"
          @validate="onValidate"
          :onlyCountries="countries"
          v-model="state.phonenumber"></vue-tel-input>
      </UFormGroup>
      <div class="flex justify-center items-center p-3">
        <UButton
          type="submit"
          label="بحث"
          color="emerald"
          size="xl"
          variant="outline" />
      </div>
    </UForm>
    <div v-if="checkState.status.value == 'success' && checkState.data.value">
      <StateResult :playerstate="checkState.data.value.data" />
    </div>
    <div v-if="checkState.status.value == 'error'" class="bg-red-500/50 p-5">
      {{ checkState.error }}
    </div>
  </div>
  <StateResult
    :playerstate="{name:'hazem',id:'5555',phone:'5555',email:'dssd',comment:'i have error in regetiration ',key:'key',state:2,teamId:null}" />
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
import type { State } from "~/models/Player";
const user_data = reactive({});
const form = ref();
const leagueApi = useLeague();
const checkState = await leagueApi.checkExist();
const phone_is_valid = ref();

const state = reactive({ phonenumber: "" });
const schema = object({
  phonenumber: string().required(),
});
const onSubmit = async () => {
  form.value.clear();
  if (phone_is_valid.value) {
    const number = state.phonenumber.replace(/\s+/g, "");
    // ----- send req
    await checkState.fetchREQ(number);
    if (checkState.status.value == "success") {
    }
  } else {
    form.value.setErrors([{ path: "phonenumber", message: "الرقم غير صحيح" }]);
  }
};
const onValidate = (data: any) => {
  phone_is_valid.value = data.valid;
};

const countries = ["ae", "sa"];

function checkExist() {
  throw new Error("Function not implemented.");
}
</script>

<style></style>
