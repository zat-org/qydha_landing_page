<template>
  <UCard class="mx-auto min-h-full max-w-7xl bg-gray-50 dark:bg-gray-900" :ui="{ root: 'min-h-full overflow-visible' }">
    <template #header>
      <div class="form-header mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">معلومات البطولة</h2>
      </div>
    </template>
    <UForm :state="modelValue" class="flex flex-col space-y-6">
      <UFormField label="اسم البطولة" name="title" required :error="errors?.title"><UInput v-model="modelValue.title" @blur="onFieldBlur?.('title')" /></UFormField>
      <UFormField label="وصف البطولة" name="description" :error="errors?.description"><UTextarea v-model="modelValue.description" :rows="5" @blur="onFieldBlur?.('description')" /></UFormField>
      <UFormField label="شعار البطولة" name="logo" required :error="errors?.logo">
        <input type="file" ref="fileInput" class="hidden" accept=".png,.jpg,.jpeg" @change="onLogoChange" />
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800">
            <template v-if="!logoImageUrl">
              <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500">
                <UButton color="primary" variant="ghost" class="flex flex-col items-center gap-2" @click="openLogoInput()">
                  <UIcon name="i-heroicons-plus-circle" class="w-12 h-12" />
                  <span class="text-sm">إضافة شعار</span>
                </UButton>
              </div>
            </template>
            <template v-else>
              <img :src="logoImageUrl" class="w-full h-full object-cover" alt="شعار البطولة" />
              <div class="absolute inset-0 z-10 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <UButton color="error" variant="solid" size="sm" @click.stop="removeLogo()">
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
                <UButton color="primary" variant="solid" size="sm" @click.stop="openLogoInput()">
                  <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                </UButton>
              </div>
            </template>
          </div>
        </div>
      </UFormField>
      <UFormField label="رقم التواصل" name="contactPhone" required :error="errors?.contactPhone">
        <div class="flex items-center gap-4 flex-col md:flex-row">
          <AsyncPhoneInput dir="ltr" v-model="modelValue.contactPhone" @blur="onFieldBlur?.('contactPhone')" />
          <div class="shrink-0">
            <div class="flex items-center gap-4">
              <UCheckbox v-model="modelValue.isContactPhoneWhatsapp" label="واتساب" @update:model-value="onFieldBlur?.('isContactPhoneWhatsapp')" />
              <UCheckbox v-model="modelValue.isContactPhoneCall" label="اتصال" @update:model-value="onFieldBlur?.('isContactPhoneCall')" />
            </div>
            <p v-if="errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall" class="mt-1 text-xs text-red-500">
              {{ errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall }}
            </p>
          </div>
        </div>
      </UFormField>
      <UFormField label="نوع البطولة" name="type" required :error="errors?.type"><USelect v-model="modelValue.type" :items="TournamentTypeOptions" @update:model-value="onFieldBlur?.('type')" /></UFormField>
      <UFormField label="رمز سري" name="tournamentPrivatePassword" v-if="modelValue.type == TournamentType.private" required :error="errors?.tournamentPrivatePassword"><UInput v-model="modelValue.tournamentPrivatePassword" @blur="onFieldBlur?.('tournamentPrivatePassword')" /></UFormField>
      <div class="flex items-center justify-between">
        <UFormField label="هل يوجد الرعاة" name="Sponsered"><USwitch v-model="sponsersAvilabel" size="lg" /></UFormField>
        <UButton v-if="sponsersAvilabel" @click="AddSponser()" color="primary" variant="soft">إضافة راعي</UButton>
        <input ref="SponsorInput" type="file" name="sponsor" class="hidden" @input="onSponsorsChange($event)" accept=".png,.jpg,.jpeg" />
      </div>
      <div v-if="sponsersAvilabel" class="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-28 md:h-40">
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="(image, index) of SponsorsUrl" :key="index" class="relative group flex-shrink-0">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <img :src="image || 'https://avatars.githubusercontent.com/u/739984?v=4'" class="w-full h-full object-cover" alt="شعار الراعي" />
              <button @click="removeSponsors(index)" class="absolute inset-0 bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
import { TournamentType } from "~/features/tournament/models/tournamenetType";
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";

const props = defineProps<{ modelValue: any; errors?: Record<string, string | undefined>; onFieldBlur?: (field: string) => void }>();
const { errors, onFieldBlur } = toRefs(props);
const sponsersAvilabel = ref(false)

const route =useRoute()
const id= route.params.id.toString()
const adminData =useNuxtData<DetailTournamentRequest>(appKeys.adminSingleTourRequest(id))
const SelectedRequest = computed(()=> unref(adminData.data))
const logoImageUrl = ref<string>("");
const logoCleared = ref(false);
watch(SelectedRequest, () => {
  if (props.modelValue.logo instanceof File || logoCleared.value) return;
  if (SelectedRequest.value?.logoUrl) logoImageUrl.value = SelectedRequest.value.logoUrl;
}, { immediate: true });
const fileInput = ref<HTMLInputElement>();
const openLogoInput = () => { fileInput.value?.click() }
const removeLogo = () => {
  logoCleared.value = true;
  logoImageUrl.value = "";
  props.modelValue.logo = undefined;
  if (fileInput.value) fileInput.value.value = "";
  props.onFieldBlur?.("logo");
};
const onLogoChange = (event: Event) => {
  const traget = event.target as HTMLInputElement
  const file = traget.files?.[0]
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { logoImageUrl.value = e.target?.result as string; props.modelValue.logo = file };
    reader.readAsDataURL(file);
    logoCleared.value = false;
    props.onFieldBlur?.("logo");
  }
  if (fileInput.value) fileInput.value.value = "";
};
interface SponsorItem { type: 'existing' | 'new'; url: string; fileIndex?: number; urlIndex?: number; }
const SponsorInput = ref<any>()
const sponsorItems = ref<SponsorItem[]>([]);
const SponsorsUrl = computed(() => sponsorItems.value.map(item => item.url));
watch(SelectedRequest, () => {
  if (SelectedRequest.value?.sponsorsUrls && SelectedRequest.value?.sponsorsUrls.length > 0) {
    props.modelValue.remainingSponsorsUrls = [...SelectedRequest.value.sponsorsUrls];
    sponsorItems.value = SelectedRequest.value.sponsorsUrls.map((url, index) => ({ type: 'existing', url, urlIndex: index }));
    sponsersAvilabel.value = true;
  } else { props.modelValue.remainingSponsorsUrls = []; sponsorItems.value = []; }
}, { immediate: true });
const AddSponser = () => SponsorInput.value?.click()
const onSponsorsChange = (event: Event) => {
  const target = event.target as HTMLInputElement; const files = target.files;
  if (files && files.length > 0) {
    const file = files[0]; const reader = new FileReader();
    reader.onload = (e) => { const previewUrl = e.target?.result as string; props.modelValue.sponsors.push(file); const fileIndex = props.modelValue.sponsors.length - 1; sponsorItems.value.push({ type: 'new', url: previewUrl, fileIndex }); };
    reader.readAsDataURL(file); target.value = '';
    props.onFieldBlur?.("sponsors");
  }
}
const removeSponsors = (index: number) => {
  const item = sponsorItems.value[index];
  if (item.type === 'existing' && item.urlIndex !== undefined) {
    props.modelValue.remainingSponsorsUrls.splice(item.urlIndex, 1);
    sponsorItems.value.forEach((sponsorItem) => {
      if (sponsorItem.type === 'existing' && sponsorItem.urlIndex !== undefined && sponsorItem.urlIndex > item.urlIndex!) sponsorItem.urlIndex! -= 1;
    });
  } else if (item.type === 'new' && item.fileIndex !== undefined) {
    props.modelValue.sponsors.splice(item.fileIndex, 1);
    sponsorItems.value.forEach((sponsorItem) => {
      if (sponsorItem.type === 'new' && sponsorItem.fileIndex !== undefined && sponsorItem.fileIndex > item.fileIndex!) sponsorItem.fileIndex! -= 1;
    });
  }
  sponsorItems.value.splice(index, 1);
}
const TournamentTypeOptions = [{ label: "بطولة عامة", value: TournamentType.public }, { label: "بطولة خاصة", value: TournamentType.private }]
</script>

<style></style>
