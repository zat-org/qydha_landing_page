<template>
  <div class="tournament-form space-y-3">
    <!-- Form Header -->
    <div class="form-header mb-6">
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">معلومات البطولة</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">يرجى إدخال المعلومات الأساسية للبطولة</p>
    </div>

    <!-- Main Form Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <UFormField label="اسم البطولة" name="TournamentName" required>
          <UInput v-model="modelValue.TournamentName" placeholder="أدخل اسم البطولة" icon="i-heroicons-trophy" />
        </UFormField>

        <UFormField label="وصف البطولة" name="TournamentDescription" required>
          <UTextarea v-model="modelValue.TournamentDescription" :rows="5" placeholder="أدخل وصف البطولة" />
        </UFormField>
      </div>

      <!-- Right Column logo select   -->
      <div>
        <UFormField label="شعار البطولة" name="TournamentLogo" required>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onLogoChange" />

          <div class="flex flex-col items-center gap-4">
            <div
              class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800">
              <template v-if="!logoImageUrl">
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500">
                  <UButton color="primary" variant="ghost" class="flex flex-col items-center gap-2"
                    @click="openLogoInput()">
                    <UIcon name="i-heroicons-plus-circle" class="w-12 h-12" />
                    <span class="text-sm">إضافة شعار</span>
                  </UButton>
                </div>
              </template>
              <template v-else>
                <div
                  class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <UButton color="error" variant="solid" size="sm" @click="removeLogo()">
                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                  </UButton>
                  <UButton color="primary" variant="solid" size="sm" @click="openLogoInput()">
                    <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                  </UButton>
                </div>
                <img :src="logoImageUrl" class="w-full h-full object-cover" alt="شعار البطولة" />
              </template>
            </div>
          </div>
        </UFormField>
      </div>
    </div>

    <!-- Date and Duration Section -->
    <div
      class="space-y-4 md:space-y-6 p-3 md:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <UFormField label="عدد أيام البطولة" name="TournamentDays" required>
        <div class="relative flex items-center gap-2">
          <UInput type="number" v-model="modelValue.TournamentDaysNumber" min="1" @input="updateTournamentDates"
            class="hover:border-primary-300 text-center w-20" />
          <span class="text-gray-600 dark:text-gray-400">يوم</span>
        </div>
      </UFormField>

      <div v-if="modelValue.TournamentDaysNumber > 0" class="space-y-4 mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="(date, index) in modelValue.TournamentDates" :key="index"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition-colors duration-200">
            <UFormField :label="`تاريخ اليوم ${index + 1}`" :name="`TournamentDate${index + 1}`" required>
              <div class="relative">
                <UInput type="date" v-model="modelValue.TournamentDates[index]" class="hover:border-primary-300" />
              </div>
            </UFormField>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Number Section -->
    <UFormField label="رقم التواصل للاعبين" name="ConnectionPhoneNumberForPlayers" required>
      <div class="flex items-center gap-4">
        <AsyncPhoneInput dir="ltr" v-model="modelValue.ConnectionPhoneNumberForPlayers" />

        <div class="flex items-center gap-4 shrink-0">
          <UCheckbox v-model="modelValue.isWhatsappAvailable" label="واتساب" />
          <UCheckbox v-model="modelValue.isCallAvailable" label="اتصال" />
        </div>
      </div>
    </UFormField>

    <!-- <UFormField label="مكان البطولة" name="TournamentLocation" required>
      <UInput v-model="modelValue.TournamentLocation" placeholder="أدخل مكان البطولة" />
    </UFormField> -->
    <UFormField label="نوع البطولة" name="TournamentType" required >
      <USelect v-model="modelValue.TournamentType" :items="TournamentTypeOptions" placeholder="اختر نوع البطولة" />
    </UFormField>
    <!-- Sponsors Section -->

    <div class="flex items-center justify-between">
      <UFormField label=" هل يوجد الرعاة" name="Sponsered">
        <USwitch v-model="modelValue.Sponsered" size="lg" />
      </UFormField>

      <UButton v-if="modelValue.Sponsered" @click="AddSponser()" color="primary" variant="soft" icon="i-heroicons-plus"
        size="sm" class="p-2.5 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
        إضافة راعي
      </UButton>

      <input ref="SponsorInput" type="file" name="sponsor" class="hidden" @input="onSponsorsChange($event)"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml" />
    </div>
    <div v-if="modelValue.Sponsered"
      class="sponsors-gallery p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-28 md:h-40">
      <div class="flex gap-4 overflow-x-auto pb-4">
        <div v-for="(image, index) of SponsorsUrl" :key="index" class="relative group flex-shrink-0">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
            <img :src="image || 'https://avatars.githubusercontent.com/u/739984?v=4'" class="w-full h-full object-cover"
              alt="شعار الراعي" />
            <button @click="SponsorsUrl.splice(index, 1)"
              class="absolute inset-0 bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <UIcon name="i-heroicons-trash" class="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { USwitch } from '#components';


const props = defineProps<{
  modelValue: {
    TournamentName: string;
    TournamentDescription: string;
    TournamentLogo: string;
    TournamentDaysNumber: number;
    TournamentDates: string[];
    TournamentLocation: { x: number; y: number };
    ConnectionPhoneNumberForPlayers: string;
    isWhatsappAvailable: boolean;
    isCallAvailable: boolean;
    Sponsered: boolean;
    Sponsers: string[];
    TournamentType: string;
  };
}>();
const emit = defineEmits(["update:modelValue"]);
const logoImageUrl = ref<string>("");
const fileInput = ref<HTMLInputElement>();

const openLogoInput = () => {
  fileInput.value?.click()
}
const removeLogo = () => {
  logoImageUrl.value = ""
}

const onLogoChange = (event: Event) => {
  const traget = event.target as HTMLInputElement
  const file = traget.files?.[0]

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImageUrl.value = e.target?.result as string;
      props.modelValue.TournamentLogo = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const updateTournamentDates = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  console.log(value);
  props.modelValue.TournamentDates =
    Array.from({ length: value || 1 },
      (_, i) => {
        return "";
        // new Date (new Date().setDate( new Date().getDate() + i)).toISOString().split('T')[0]
      })
}

const SponsorInput = ref<any>()
const SponsorsUrl = ref<string[]>([]);
const Sponsors = ref<File[]>([]);


const AddSponser = () => {
  SponsorInput.value?.click()
}
const onSponsorsChange = (event: Event) => {
  console.log("change");
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      SponsorsUrl.value.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

}

const TournamentTypeOptions = [
  {
    label: "بطولة عامة",
    value: "public",
  },
  {
    label: "بطولة خاصة",
    value: "private",
  },
  
]


</script>

<style></style>
