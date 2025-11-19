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


    <UFormField label="اسم البطولة" name="title" required>
        <UInput v-model="modelValue.title" placeholder="أدخل اسم البطولة" />
      </UFormField>

    <UFormField label="وصف البطولة" name="description" required>
        <UTextarea v-model="modelValue.description" :rows="5" placeholder="أدخل وصف البطولة" />
      </UFormField>


    <UFormField label="شعار البطولة" name="logo" required>
        <input type="file" ref="fileInput" class="hidden" accept=".png,.jpg,.jpeg" @change="onLogoChange" />
        <!-- show logo -->
        <div class="flex flex-col items-center gap-4">
          <div
            class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800">
          <!-- {{ logoImageUrl ?? 'no lofo' }} -->
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





    <UFormField label="رقم التواصل للاعبين" name="contactPhone" required>
        <div class="flex items-center gap-4 flex-col md:flex-row">
          <AsyncPhoneInput dir="ltr" v-model="modelValue.contactPhone" />

          <div class="flex items-center gap-4 shrink-0">
            <UCheckbox v-model="modelValue.isContactPhoneWhatsapp" label="واتساب" />
            <UCheckbox v-model="modelValue.isContactPhoneCall" label="اتصال" />
          </div>
        </div>
      </UFormField>

      

    <UFormField label="مكان البطولة" name="locationDescription" required>
        <UInput v-model="modelValue.locationDescription" placeholder="أدخل عنوان البطولة" />
      </UFormField>

    <UFormField label="موقع البطولة" name="location" required
      :help="modelValue.location.latitude != 0 && modelValue.location.longitude != 0 ? 'تم اختيار الموقع' : 'يرجى اختيار الموقع'">
      <MapInputModal v-model="modelValue.location" name="location" label="مكان البطولة" required />
      </UFormField>
    <UFormField label="نوع البطولة" name="tournamentType" required>
        <USelect v-model="modelValue.tournamentType" :items="TournamentTypeOptions" placeholder="اختر نوع البطولة" />
      </UFormField>
    <UFormField label="رمز السري البطولة " name="tournamentPrivatePassword"
        v-if="modelValue.tournamentType == TournamentType.private" required>
        <UInput v-model="modelValue.tournamentPrivatePassword" placeholder="أدخل  الرمز السري للبطولة " />
      </UFormField>

      <div class="flex items-center justify-between">
        <UFormField label=" هل يوجد الرعاة" name="Sponsered">
          <USwitch v-model="sponsersAvilabel" size="lg" />
        </UFormField>

        <UButton v-if="sponsersAvilabel" @click="AddSponser()" color="primary" variant="soft" icon="i-heroicons-plus"
          size="sm" class="p-2.5 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
          إضافة راعي
        </UButton>

        <input ref="SponsorInput" type="file"  accept=".png,.jpg,.jpeg" name="sponsor" class="hidden" @input="onSponsorsChange($event)"/>
      </div>
      <div v-if="sponsersAvilabel"
        class="sponsors-gallery p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-28 md:h-40">
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="(image, index) of SponsorsUrl" :key="index" class="relative group flex-shrink-0">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <img :src="image || 'https://avatars.githubusercontent.com/u/739984?v=4'"
                class="w-full h-full object-cover" alt="شعار الراعي" />
              <button @click="removeSponsors(index)"
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
import { object, string, number, boolean, array, mixed } from "yup";
import { TournamentType } from "~/models/tournamenetType";
import type { DetailTournament } from "~/models/tournament";
import { useMyAuthStore } from "~/store/Auth";

const props = defineProps<{
  modelValue: {
    title: string;
    description: string;
    logo: File | undefined;
    location: { latitude: number; longitude: number };
    contactPhone: string;
    isContactPhoneWhatsapp: boolean;
    isContactPhoneCall: boolean;
    sponsors: File[];
    tournamentType: TournamentType;
    tournamentPrivatePassword?: string;
    locationDescription: string;
    remainingSponsorsUrls: string[];
    // isAddPlayersByQydha:boolean
  }
}>();

const emit = defineEmits(["update:modelValue"]);
const sponsersAvilabel = ref(false)
// Enhanced validation state management
const isValid = ref(false);
const errors = ref<Record<string, string>>({});
const isValidating = ref(false);

// Move schema to component level for better encapsulation
const localSchema = object({
  title: string().required("اسم البطولة مطلوب"),
  description: string().required("وصف البطولة مطلوب"),
  logo: mixed(),
  tournamentType: string().required("نوع البطولة مطلوب"),
  tournamentPrivatePassword: string().when('type', {
    is: TournamentType.private,
    then: (schema) => schema.required("رمز البطولة الخاصة مطلوب"),
    otherwise: (schema) => schema.notRequired(),
  }),
  locationDescription: string().required("عنوان البطولة مطلوب"),
  location: object({
    latitude: number(),
    longitude: number(),
  }).test('location-selected', 'يرجى اختيار الموقع', function (value) {
    return !!value && value.latitude !== 0 && value.longitude !== 0;
  }),
  contactPhone: string().required("رقم للتواصل للاعبين مطلوب").min(10, "رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام"),
  isContactPhoneCall: boolean(),
  isContactPhoneWhatsapp: boolean().test(
  "at-least-one-contact-method",
  "يجب اختيار وسيلة تواصل واحدة على الأقل (واتساب أو اتصال)",
  function(value)  {
    // 'value' is the parent object at this level in yup
    const parent = this.parent;
    return value  || parent.isContactPhoneCall;
  }),
  sponsors: array().of(mixed()),
  // isAddPlayersByQydha:boolean()
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
    console.log(error)
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
const route =useRoute()
const id= route.params.id.toString()
const authStore = useMyAuthStore()

const adminData =useNuxtData<{data:DetailTournament}>(`getSingelTournament-${id}`)

const SelectedRequest = computed(()=>{
    return  unref(adminData.data.value?.data)
})


const logoImageUrl = ref<string>();

watch(SelectedRequest,()=>{
  if(SelectedRequest.value?.tournament.logoUrl){
  logoImageUrl.value = SelectedRequest.value.tournament.logoUrl;
}
},{immediate:true})


const fileInput = ref<HTMLInputElement>();


const openLogoInput = () => {
  fileInput.value?.click()
}
const removeLogo = () => {
  logoImageUrl.value = ""
  props.modelValue.logo = undefined;
}

const onLogoChange = (event: Event) => {
  const traget = event.target as HTMLInputElement
  const file = traget.files?.[0]

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImageUrl.value = e.target?.result as string;
      props.modelValue.logo = file
      // e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// sponsors
// Track sponsor items with their type (existing URL or new file)
interface SponsorItem {
  type: 'existing' | 'new';
  url: string;
  fileIndex?: number; // index in sponsors array (only for new items)
  urlIndex?: number; // index in remainingSponsorsUrls (only for existing items)
}

const SponsorInput = ref<any>()
const sponsorItems = ref<SponsorItem[]>([]);

// Computed property to get display URLs
const SponsorsUrl = computed(() => {
  return sponsorItems.value.map(item => item.url);
});

// Initialize from existing data
watch(SelectedRequest, () => {
  if (SelectedRequest.value?.tournament.sponsors && SelectedRequest.value?.tournament.sponsors.length > 0) {
    // Initialize remainingSponsorsUrls from existing data
    props.modelValue.remainingSponsorsUrls = [...SelectedRequest.value.tournament.sponsors];
    
    // Initialize sponsorItems with existing URLs
    sponsorItems.value = SelectedRequest.value.tournament.sponsors.map((url, index) => ({
      type: 'existing',
      url,
      urlIndex: index
    }));
    
    sponsersAvilabel.value = true;
  } else {
    // Reset if no existing sponsors
    props.modelValue.remainingSponsorsUrls = [];
    sponsorItems.value = [];
  }
}, { immediate: true });

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
      const previewUrl = e.target?.result as string;
      
      // Add to sponsors array
      props.modelValue.sponsors.push(file);
      const fileIndex = props.modelValue.sponsors.length - 1;
      
      // Add to sponsorItems as new item
      sponsorItems.value.push({
        type: 'new',
        url: previewUrl,
        fileIndex: fileIndex
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input to allow selecting the same file again
    target.value = '';
  }
}

const removeSponsors = (index: number) => {
  const item = sponsorItems.value[index];
  
  if (item.type === 'existing') {
    // Remove from remainingSponsorsUrls
    if (item.urlIndex !== undefined) {
      props.modelValue.remainingSponsorsUrls.splice(item.urlIndex, 1);
      
      // Update urlIndex for remaining existing items
      sponsorItems.value.forEach((sponsorItem) => {
        if (sponsorItem.type === 'existing' && sponsorItem.urlIndex !== undefined && sponsorItem.urlIndex > item.urlIndex!) {
          sponsorItem.urlIndex! -= 1;
        }
      });
    }
  } else if (item.type === 'new') {
    // Remove from sponsors array
    if (item.fileIndex !== undefined) {
      props.modelValue.sponsors.splice(item.fileIndex, 1);
      
      // Update fileIndex for remaining new items
      sponsorItems.value.forEach((sponsorItem) => {
        if (sponsorItem.type === 'new' && sponsorItem.fileIndex !== undefined && sponsorItem.fileIndex > item.fileIndex!) {
          sponsorItem.fileIndex! -= 1;
        }
      });
    }
  }
  
  // Remove from display array
  sponsorItems.value.splice(index, 1);
}
// tournament type
const TournamentTypeOptions = [
  {
    label: "بطولة عامة",
    value: TournamentType.public,
  },
  {
    label: "بطولة خاصة",
    value: TournamentType.private,
  },
]
watch(() => props.modelValue.location, (newVal) => {
  form.value?.clear("location")
}, { deep: true })
</script>

<style></style>
