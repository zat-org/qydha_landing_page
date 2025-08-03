<template>
  <UCard class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900 ">
    <!-- Form Header -->
    <template #header>
      <div class="form-header mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">معلومات البطولة</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">يرجى إدخال المعلومات الأساسية للبطولة</p>
      </div>
    </template>

    <UForm :schema="localSchema" :state="modelValue" class="flex flex-col space-y-6  " ref="form">


      <UFormField label="اسم البطولة" name="TournamentName" required>
        <UInput v-model="modelValue.TournamentName" placeholder="أدخل اسم البطولة" />
      </UFormField>

      <UFormField label="وصف البطولة" name="TournamentDescription" required>
        <UTextarea v-model="modelValue.TournamentDescription" :rows="5" placeholder="أدخل وصف البطولة" />
      </UFormField>


      <UFormField label="شعار البطولة" name="TournamentLogo" required>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onLogoChange" />
        <!-- show logo -->
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





      <UFormField label="رقم التواصل للاعبين" name="ConnectionPhoneNumberForPlayers" required>
        <div class="flex items-center gap-4 flex-col md:flex-row">
          <AsyncPhoneInput dir="ltr" v-model="modelValue.ConnectionPhoneNumberForPlayers" />

          <div class="flex items-center gap-4 shrink-0">
            <UCheckbox v-model="modelValue.isWhatsappAvailable" label="واتساب" />
            <UCheckbox v-model="modelValue.isCallAvailable" label="اتصال" />
          </div>
        </div>
      </UFormField>

      <UFormField label="مكان البطولة" name="TournamentAddress" required>
        <UInput v-model="modelValue.TournamentAddress" placeholder="أدخل عنوان البطولة" />
      </UFormField>

      <UFormField label="موقع البطولة" name="TournamentLocation" required
        :help="modelValue.TournamentLocation.lat != 0 && modelValue.TournamentLocation.lng != 0 ? 'تم اختيار الموقع' : 'يرجى اختيار الموقع'">
        <MapInputModal v-model="modelValue.TournamentLocation" name="TournamentLocation" label="مكان البطولة"
          required />
      </UFormField>
      <UFormField label="نوع البطولة" name="TournamentType" required>
        <USelect v-model="modelValue.TournamentType" :items="TournamentTypeOptions" placeholder="اختر نوع البطولة" />
      </UFormField>
      <UFormField label="رمز السري البطولة " name="PrivateTournamentCode" v-if="modelValue.TournamentType == 'private'"
        required>
        <UInput v-model="modelValue.PrivateTournamentCode" placeholder="أدخل  الرمز السري للبطولة " />
      </UFormField>

      <div class="flex items-center justify-between">
        <UFormField label=" هل يوجد الرعاة" name="Sponsered">
          <USwitch v-model="modelValue.Sponsered" size="lg" />
        </UFormField>

        <UButton v-if="modelValue.Sponsered" @click="AddSponser()" color="primary" variant="soft"
          icon="i-heroicons-plus" size="sm"
          class="p-2.5 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
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
              <img :src="image || 'https://avatars.githubusercontent.com/u/739984?v=4'"
                class="w-full h-full object-cover" alt="شعار الراعي" />
              <button @click="SponsorsUrl.splice(index, 1)"
                class="absolute inset-0 bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-heroicons-trash" class="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </UForm>



  </UCard>
</template>

<script lang="ts" setup>
import { object, string, number, boolean, array } from "yup";

const props = defineProps<{
  modelValue: {
    TournamentName: string;
    TournamentDescription: string;
    TournamentLogo: string;
    TournamentLocation: { lat: number; lng: number };
    ConnectionPhoneNumberForPlayers: string;
    isWhatsappAvailable: boolean;
    isCallAvailable: boolean;
    Sponsered: boolean;
    Sponsers: string[];
    TournamentType: string;
    PrivateTournamentCode: string;
    TournamentAddress: string;
  }
}>();

const emit = defineEmits(["update:modelValue"]);

// Enhanced validation state management
const isValid = ref(false);
const errors = ref<Record<string, string>>({});
const isValidating = ref(false);

// Move schema to component level for better encapsulation
const localSchema = object({
  TournamentName: string().required("اسم البطولة مطلوب"),
  TournamentDescription: string().required("وصف البطولة مطلوب"),
  TournamentLogo: string().required("شعار البطولة مطلوب"),
  TournamentType: string().required("نوع البطولة مطلوب"),
  PrivateTournamentCode: string().when('TournamentType', {
    is: 'private',
    then: (schema) => schema.required("رمز البطولة الخاصة مطلوب"),
    otherwise: (schema) => schema.notRequired(),
  }),
  TournamentAddress: string().required("عنوان البطولة مطلوب"),
  TournamentLocation: object({
    lat: number(),
    lng: number(),
  }).test('location-selected', 'يرجى اختيار الموقع', function (value) {
    return value.lat !== 0 && value.lng !== 0;
  }),
  ConnectionPhoneNumberForPlayers: string().required("رقم للتواصل للاعبين مطلوب").min(10, "رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام"),
  isCallAvailable: boolean(),
  isWhatsappAvailable: boolean(),
  Sponsered: boolean(),
  Sponsers: array().of(string()),
});
const form = useTemplateRef("form");

// Validation methods to expose to parent
const validate = async (): Promise<boolean> => {
  isValidating.value = true;
  errors.value = {};

  try {
    await form.value?.validate();

    isValid.value = true;
    return true;
  } catch (error: any) {
    isValid.value = false;

    return false;
  } finally {
    isValidating.value = false;
  }
};



// Expose methods to parent component
defineExpose({
  validate,
  isValid: readonly(isValid),
  errors: readonly(errors),
  isValidating: readonly(isValidating)
});
// logo
const logoImageUrl = ref<string>("");
const fileInput = ref<HTMLInputElement>();

const openLogoInput = () => {
  fileInput.value?.click()
}
const removeLogo = () => {
  logoImageUrl.value = ""
  props.modelValue.TournamentLogo = "";
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

// sponsors
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
// tournament type
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
watch(() => props.modelValue.TournamentLocation, (newVal) => {
  form.value?.clear("TournamentLocation")
}, { deep: true })
</script>

<style></style>
