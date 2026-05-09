<template>
  <UCard class="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900">
    <template #header>
      <div class="form-header mb-2">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">معلومات البطولة</h2>
      </div>
    </template>

    

    <UForm :state="modelValue" class="flex flex-col space-y-6">
      <UFormField label="اسم البطولة" name="title" required :error="errors?.title">
        <UInput v-model="modelValue.title" :disabled="disabledFields?.title" placeholder="أدخل اسم البطولة" @blur="onFieldBlur?.('title')" />
      </UFormField>
      <UFormField label="وصف البطولة" name="description" required :error="errors?.description">
        <UTextarea v-model="modelValue.description" :disabled="disabledFields?.description" :rows="5" placeholder="أدخل وصف البطولة" @blur="onFieldBlur?.('description')" />
      </UFormField>
      <UFormField label="شعار البطولة" name="logo" required :error="errors?.logo">
        <input type="file" ref="fileInput" class="hidden" accept=".png,.jpg,.jpeg" :disabled="disabledFields?.logo" @change="onLogoChange" />
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800">
            <template v-if="!logoImageUrl">
              <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500">
                <UButton color="primary" variant="ghost" class="flex flex-col items-center gap-2" :disabled="disabledFields?.logo" @click="openLogoInput()">
                  <UIcon name="i-heroicons-plus-circle" class="w-12 h-12" />
                  <span class="text-sm">إضافة شعار</span>
                </UButton>
              </div>
            </template>
            <template v-else>
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <UButton color="error" variant="solid" size="sm" :disabled="disabledFields?.logo" @click="removeLogo()">
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
                <UButton color="primary" variant="solid" size="sm" :disabled="disabledFields?.logo" @click="openLogoInput()">
                  <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                </UButton>
              </div>
              <img :src="logoImageUrl" class="w-full h-full object-cover" alt="شعار البطولة" />
            </template>
          </div>
        </div>
      </UFormField>

      <UFormField label="رقم التواصل للاعبين" name="contactPhone" required :error="errors?.contactPhone">
        <div class="flex flex-col items-center gap-4 md:flex-row">
          <AsyncPhoneInput dir="ltr" v-model="modelValue.contactPhone" :disabled="disabledFields?.contactPhone" @blur="onFieldBlur?.('contactPhone')" />
          <div class="shrink-0">
            <div class="flex items-center gap-4">
              <UCheckbox v-model="modelValue.isContactPhoneWhatsapp" :disabled="disabledFields?.isContactPhoneWhatsapp" label="واتساب" @update:model-value="onFieldBlur?.('isContactPhoneWhatsapp')" />
              <UCheckbox v-model="modelValue.isContactPhoneCall" :disabled="disabledFields?.isContactPhoneCall" label="اتصال" @update:model-value="onFieldBlur?.('isContactPhoneCall')" />
            </div>
            <p v-if="errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall" class="mt-1 text-xs text-red-500">
              {{ errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall }}
            </p>
          </div>
        </div>
      </UFormField>

      <UFormField label="مكان البطولة" name="locationDescription" required :error="errors?.locationDescription">
        <UInput v-model="modelValue.locationDescription" :disabled="disabledFields?.locationDescription" placeholder="أدخل عنوان البطولة" @blur="onFieldBlur?.('locationDescription')" />
      </UFormField>
      <UFormField label="موقع البطولة" name="location" required :error="errors?.location" :help="modelValue.location.latitude !== 0 && modelValue.location.longitude !== 0 ? 'تم اختيار الموقع' : 'يرجى اختيار الموقع'">
        <MapInputModal v-model="modelValue.location" :disabled="disabledFields?.location" name="location" label="مكان البطولة" required @update:model-value="onFieldBlur?.('location')" />
      </UFormField>
      <UFormField label="نوع البطولة" name="type" required :error="errors?.type">
        <USelect v-model="modelValue.type" :disabled="disabledFields?.type" :items="TournamentTypeOptions" placeholder="اختر نوع البطولة" @update:model-value="onFieldBlur?.('type')" />
      </UFormField>
      <UFormField v-if="modelValue.type === TournamentType.private" label="رمز السري البطولة " name="tournamentPrivatePassword" required :error="errors?.tournamentPrivatePassword">
        <UInput v-model="modelValue.tournamentPrivatePassword" :disabled="disabledFields?.tournamentPrivatePassword" placeholder="أدخل  الرمز السري للبطولة " @blur="onFieldBlur?.('tournamentPrivatePassword')" />
      </UFormField>

      <div class="flex items-center justify-between">
        <UFormField label=" هل يوجد الرعاة" name="Sponsered">
          <USwitch v-model="sponsersAvilabel" :disabled="disabledFields?.sponsors" size="lg" />
        </UFormField>
        <UButton v-if="sponsersAvilabel" color="primary" variant="soft" icon="i-heroicons-plus" size="sm" :disabled="disabledFields?.sponsors" @click="AddSponser">إضافة راعي</UButton>
        <input ref="SponsorInput" type="file" name="sponsor" class="hidden" accept=".png,.jpg,.jpeg" :disabled="disabledFields?.sponsors" @input="onSponsorsChange($event)" />
      </div>
      <div v-if="sponsersAvilabel" class="sponsors-gallery p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-28 md:h-40">
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="(image, index) of SponsorsUrl" :key="index" class="relative group flex-shrink-0">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <img :src="image || 'https://avatars.githubusercontent.com/u/739984?v=4'" class="w-full h-full object-cover" alt="شعار الراعي" />
              <button type="button" :disabled="disabledFields?.sponsors" class="absolute inset-0 bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed" @click="removeSponsors(index)">
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
import type { TournamentOwner } from "~/features/tournament/models/tournamentOwner";
import { TournamentType } from "~/features/tournament/models/tournamenetType";

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
  initialLogoUrl?: string;
  owner?: TournamentOwner | null;
}>();
const modelValue = defineModel<any>({ required: true });
const { errors, onFieldBlur, disabledFields, owner } = toRefs(props);

const ownerLabel = computed(() => {
  const n = owner.value?.name as string | Record<string, string> | undefined;
  if (n == null) return owner.value?.username ?? "";
  return typeof n === "string" ? n : Object.values(n).find(Boolean)?.toString() ?? "";
});

const TournamentTypeOptions = [
  { label: "بطولة عامة", value: TournamentType.public },
  { label: "بطولة خاصة", value: TournamentType.private },
];

const logoImageUrl = ref<string>("");
watch(
  () => props.initialLogoUrl,
  (url) => {
    if (!logoImageUrl.value && url) logoImageUrl.value = url;
  },
  { immediate: true },
);

watch(
  () => modelValue.value?.logo,
  (file) => {
    if (!(file instanceof File) && logoImageUrl.value === "" && props.initialLogoUrl)
      logoImageUrl.value = props.initialLogoUrl;
  },
);

const fileInput = ref<HTMLInputElement>();
const openLogoInput = () => {
  if (props.disabledFields?.logo) return;
  fileInput.value?.click();
};
const removeLogo = () => {
  if (props.disabledFields?.logo) return;
  logoImageUrl.value = "";
  modelValue.value.logo = undefined;
};
const onLogoChange = (event: Event) => {
  const traget = event.target as HTMLInputElement;
  const file = traget.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImageUrl.value = e.target?.result as string;
      modelValue.value.logo = file;
    };
    reader.readAsDataURL(file);
    props.onFieldBlur?.("logo");
  }
};
const SponsorInput = ref<any>();
const sponsersAvilabel = ref(false);
const SponsorsUrl = ref<string[]>([]);
const AddSponser = () => SponsorInput.value?.click();
const onSponsorsChange = (event: Event) => {
  if (props.disabledFields?.sponsors) return;
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      SponsorsUrl.value.push(e.target?.result as string);
      modelValue.value.sponsors.push(file);
    };
    reader.readAsDataURL(file);
    props.onFieldBlur?.("sponsors");
  }
};
const removeSponsors = (index: number) => {
  SponsorsUrl.value.splice(index, 1);
  modelValue.value.sponsors.splice(index, 1);
};

watch(
  () => props.disabledFields?.sponsors,
  (isDisabled) => {
    if (isDisabled) sponsersAvilabel.value = !!modelValue.value.sponsors?.length;
  },
);

watch(
  () => modelValue.value.sponsors?.length,
  (n) => {
    if ((n ?? 0) > 0) sponsersAvilabel.value = true;
  },
  { immediate: true },
);
</script>

<style scoped></style>
