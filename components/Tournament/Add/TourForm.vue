<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[75px_1fr] items-center justify-items-center gap-x-2 gap-y-4"
  >
    <UFormGroup
      class="md:col-start-1 md:row-start-1 w-full"
      :ui="{ error: 'text-xs' }"
      label=" اسم البطولة "
      name="TournamentName"
    >
      <UInput
        :ui="{ base: 'form-input' }"
        v-model="modelValue.TournamentName"
      />
    </UFormGroup>

    <UFormGroup
      class="md:col-start-1 md:row-start-2 w-full"
      :ui="{ error: 'text-xs' }"
      label=" وصف البطولة "
      name="TournamentDescription"
    >
      <UTextarea
        :ui="{ base: 'form-input' }"
        v-model="modelValue.TournamentDescription"
        :rows="5"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label="شعار البطولة "
      class="md:col-start-2 md:row-start-1"
      name="TournamentLogo"
    >
      <UInput
        type="file"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.TournamentLogo"
        @change="onLogoChange($event)"
      />
    </UFormGroup>

    <img
      :src="
        logoImageUrl || 'https://avatars.githubusercontent.com/u/739984?v=4'
      "
      class="aspect-square w-[50%] rounded-2xl border border-green-300"
      alt=""
    />
  </div>

  <div class="flex gap-2">
    <UFormGroup
      class="grow"
      :ui="{ error: 'text-xs' }"
      label="تاريخ إقامة البطولة  "
      name="TournamentStartDate"
    >
      <UInput
        type="date"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.TournamentStartDate"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label="  ايام البطوله "
      name="TournamentDays"
    >
      <UInput
        type="number"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.TournamentDays"
      />
    </UFormGroup>
  </div>

  <!--         
        <UFormGroup  :ui="{ error: 'text-xs' }" label="موقع البطولة" name="TournamentLocation">
          <UInput
            type="datetime-local"
            :ui="{ base: 'form-input' }"
            v-model="formData.TournamentLocation"
          />
        </UFormGroup> -->

  <UFormGroup
    :ui="{ error: 'text-xs' }"
    label=" رقم للتواصل للاعبين    "
    name="ConnectionPhoneNumberForPlayers"
  >
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
      v-model="modelValue.ConnectionPhoneNumberForPlayers"
    ></vue-tel-input>
    <!-- <UInput
      :ui="{ base: 'form-input' }"
      v-model="modelValue.ConnectionPhoneNumberForPlayers"
    /> -->
  </UFormGroup>

<div class="flex flex-col  gap-2">
<div class="flex items-center  justify-between ">
  <UFormGroup
  :ui="{ error: 'text-xs' }"
  label="الرعاه"
  name="Sponsered"
  >
  <UToggle v-model="modelValue.Sponsered" size="lg" />
</UFormGroup>

<button  type="button" class="h-10 w-10 border text-3xl flex justify-center items-center  border-green-500 bg-green-50  rounded-xl  "  v-if="modelValue.Sponsered" @click="AddSponser()">
  +
</button>
<UInput  ref="SponsorInput" type="file" name="sponsor" class="hidden" @change="onSponsorsChange($event)" />
</div>
 
  <div class="flex justify-start  gap-2     w-full h-[75px] md:h-[150px]  overflow-x-scroll p-2 border border-green-500 rounded-xl bg-green-50  mb-5 " v-if="modelValue.Sponsered">
  
    <div v-for="(image, index) of SponsorsUrl" class="relative group">
      <img 
        :src="
          image || 'https://avatars.githubusercontent.com/u/739984?v=4'
        "
        class="aspect-square w-[50px] md:w-[100px] h-[50px] md:h-[100px] rounded-2xl"
        alt=""
      />
      <button 
      @click="SponsorsUrl.splice(index, 1)"
      class="absolute text-2xl top-0 right-0 w-[50px] md:w-[100px] h-[50px] md:h-[100px] rounded-2xl  bg-red-500 text-white   flex items-center justify-center opacity-0 z-10 group-hover:opacity-60 transition-opacity duration-200"
    >
      ×
    </button>
    </div> 
 </div>
</div>

</template>

<script lang="ts" setup>
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
const props = defineProps<{
  modelValue: {
    TournamentName: string;
    TournamentDescription: string;
    TournamentLogo: string;
    TournamentStartDate: string;
    TournamentDays: number;
    TournamentLocation: { x: number; y: number };
    ConnectionPhoneNumberForPlayers: string;
    Sponsered: boolean;
    Sponsers: string[];
  };
}>();
const emit = defineEmits(["update:modelValue"]);
const logoImageUrl = ref<string>("");
const logoImageFile = ref<File>();



const onLogoChange = (event: FileList) => {
  console.log(event);
  const file = event[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const SponsorInput = ref<any>()
const SponsorsUrl = ref<string[]>([]);
const Sponsors = ref<File[]>([]);


const AddSponser=()=>{
  SponsorInput.value?.$el.querySelector('input').click()
}
const onSponsorsChange =(event:FileList)=>{
  console.log(event);
  const file = event[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      SponsorsUrl.value.push( e.target?.result as string)
    };
    reader.readAsDataURL(file);
  }
}

</script>

<style></style>
