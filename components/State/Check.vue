<template>
  <div class="flex flex-col gap-5">
    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="form" class="flex flex-col gap-3">
      <div class="flex justify-center">
        <UButtonGroup size="2xs" orientation="horizontal">
          <UButton :color="index == 0 ? 'green' : 'gray'" label="الهاتف" icon="ic:baseline-phone"
            @click="searchWith(0)" />
          <UButton :color="index == 1 ? 'green' : 'gray'" label=" الايميل" icon="ic:baseline-email"
            @click="searchWith(1)" />
          <UButton :color="index == 2 ? 'green' : 'gray'" label="الرقم المرجعي" icon="mdi:key" @click="searchWith(2)" />
        </UButtonGroup>
      </div>
      <UFormGroup v-show="index == 0" help="برجاء ادخال الرقم بدون الكود" class="duration-300 transition-all grow"
        label="ادخل رقم الهاتف المسجل في البطولة" name="phonenumber">
        <vue-tel-input mode="auto" @country-changed="onCountrychange" :autoFormat="true" :customValidate="/^.{0,12}$/"
          dir="ltr" :defaultCountry="+966" :validCharactersOnly="true"
          :inputOptions="{ showDialCode: true, maxlength: 13 }" invalidMsg=""
          :dropdownOptions="{ showDialCodeInSelection: true }" @validate="onValidate" :onlyCountries="countries"
          v-model="state.phonenumber"></vue-tel-input>
      </UFormGroup>
      <UFormGroup label="الايميل" name="email" v-show="index == 1" class="duration-300 transition-all grow">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="الرقم المرجعي" name="id" class="duration-300 transition-all grow" v-show="index == 2">
        <UInput v-model="state.id" />
      </UFormGroup>

      <div class="flex justify-center items-center">
        <UButton type="submit" label="بحث" icon="material-symbols:search" color="emerald" variant="outline" />
      </div>
    </UForm>
    <div v-if="selected_user!">
      <StateResult :playerState="selected_user" />
    </div>
    <div v-if="error" class="bg-red-500/50 p-5 rounded-xl">
      <p>
        {{ error }}
        تاكد من الرقم
      </p>
    </div>
  </div>
  <!-- <StateResult
    :playerstate="{
      name: 'hazem',
      id: '5555',
      phone: '5555',
      email: 'dssd',
      comment: 'i have error in regetiration ',
      key: 'key',
      state: 2,
      teamId: null,
    }" /> -->
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
import type { State } from "~/models/Player";
const dialcode = ref();
const form = ref();
const leagueApi = useLeague();
const checkStatePhone = await leagueApi.checkExistByPhone();
const checkStateEmail = await leagueApi.checkExistByEmail();
const checkStateID = await leagueApi.checkExistByID();

const phone_is_valid = ref();
const selected_user = ref<State | null>();
const error = ref<String | null>();

const state = reactive({ phonenumber: "", email: "", id: "" });
const schema = ref(
  object({
    phonenumber: string(),

    email: string(),
    id: string(),
  })
);
const onSubmit = async () => {
  error.value = null;
  selected_user.value = null;

  if (index.value == 0) {
    form.value.clear();
    // if (phone_is_valid.value) {
    const number = dialcode.value + state.phonenumber;
    // ----- send req
    await checkStatePhone.fetchREQ(number);
    if (checkStatePhone.status.value == "success") {
      selected_user.value = checkStatePhone.data.value?.data;
    } else if (checkStatePhone.status.value == "error") {
      error.value = "هذا الرقم غير موجود في البطوله";
    }
    // } else {
    //   form.value.setErrors([
    //     { path: "phonenumber", message: "الرقم غير صحيح" },
    //   ]);
    // }
  } else if (index.value == 1) {
    await checkStateEmail.fetchREQ(state.email);
    if (checkStateEmail.status.value == "success") {
      selected_user.value = checkStateEmail.data.value?.data;
    } else if (checkStateEmail.status.value == "error") {
      error.value = "هذا الايميل غير موجود في البطوله";
    }
  } else if (index.value == 2) {
    await checkStateID.fetchREQ(state.id);
    if (checkStateID.status.value == "success") {
      selected_user.value = checkStateID.data.value?.data;
    } else if (checkStateID.status.value == "error") {
      error.value = "هذا الرقم المرجعي غير موجود في البطوله";
    }
  }
};
const onValidate = (data: any) => {
  phone_is_valid.value = data.valid;
};

const onCountrychange = (data: any) => {
  dialcode.value = data.dialCode;
};
const countries = ["ae", "sa"];
const index = ref();
watch(index, (new_value, old_value) => {

  if (new_value == 0) {
    schema.value = object({
      phonenumber: string().length(9, "يرجي ادخال رقم صحيح")
        .required("يرجي ادخال رقم الهاتف "),
      email: string(),
      id: string(),
    });
  } else if (new_value == 1) {
    schema.value = object({
      phonenumber: string(),
      email: string().email("يرجي ادخال ايميل ").required("يرجي ادخال الايميل"),
      id: string(),
    });
  } else if (new_value == 2) {
    schema.value = object({
      phonenumber: string(),
      email: string(),
      id: string().required("يرجي ادخال الرقم المرجعي"),
    });
  }
});
index.value = 0;

const searchWith = (_index: number) => {
  index.value = _index;
};
</script>

<style></style>
