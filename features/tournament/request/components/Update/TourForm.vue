<template>
  <UCard class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900 ">
    <template #header>
      <div class="form-header mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">معلومات البطولة</h2>
      </div>
    </template>
    <UForm :schema="localSchema" :state="modelValue" class="flex flex-col space-y-6  " ref="form">
      <UFormField label="اسم البطولة" name="title" required><UInput v-model="modelValue.title" /></UFormField>
      <UFormField label="وصف البطولة" name="description"><UTextarea v-model="modelValue.description" :rows="5" /></UFormField>
      <UFormField label="شعار البطولة" name="logo" required>
        <input type="file" ref="fileInput" class="hidden" accept=".png,.jpg,.jpeg" @change="onLogoChange" />
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer group bg-gray-50 dark:bg-gray-800">
            <template v-if="!logoImageUrl"><div class="absolute inset-0 flex items-center justify-center"><UButton @click="openLogoInput()">إضافة شعار</UButton></div></template>
            <template v-else><img :src="logoImageUrl" class="w-full h-full object-cover" alt="شعار البطولة" /></template>
          </div>
        </div>
      </UFormField>
      <UFormField label="رقم التواصل" name="contactPhone" required><AsyncPhoneInput dir="ltr" v-model="modelValue.contactPhone" /></UFormField>
      <UFormField label="مكان البطولة" name="locationDescription" required><UInput v-model="modelValue.locationDescription" /></UFormField>
      <UFormField label="موقع البطولة" name="location" required><MapInputModal v-model="modelValue.location" name="location" label="مكان البطولة" required /></UFormField>
      <UFormField label="نوع البطولة" name="type" required><USelect v-model="modelValue.type" :items="TournamentTypeOptions" /></UFormField>
      <UFormField label="رمز سري" name="tournamentPrivatePassword" v-if="modelValue.type == TournamentType.private" required><UInput v-model="modelValue.tournamentPrivatePassword" /></UFormField>
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
import { object, string, number, boolean, array, mixed } from "yup";
import { TournamentType } from "~/features/tournament/models/tournamenetType";
import type { DetailTournamentRequest } from "~/features/tournament/models/tournamentRequest";
import { useMyAuthStore } from "~/store/Auth";

const props = defineProps<{ modelValue: any }>();
const sponsersAvilabel = ref(false)
const isValid = ref(false);
const errors = ref<Record<string, string>>({});
const isValidating = ref(false);
const localSchema = object({
  title: string().required("اسم البطولة مطلوب"),
  description: string().required("وصف البطولة مطلوب"),
  logo: mixed(),
  type: string().required("نوع البطولة مطلوب"),
  tournamentPrivatePassword: string().when('type', { is: TournamentType.private, then: (schema) => schema.required("رمز البطولة الخاصة مطلوب"), otherwise: (schema) => schema.notRequired() }),
  locationDescription: string().required("عنوان البطولة مطلوب"),
  location: object({ latitude: number(), longitude: number() }).test('location-selected', 'يرجى اختيار الموقع', function (value) { return !!value && value.latitude !== 0 && value.longitude !== 0; }),
  contactPhone: string().required("رقم للتواصل للاعبين مطلوب").min(10, "رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام"),
  isContactPhoneCall: boolean(),
  isContactPhoneWhatsapp: boolean().test("at-least-one-contact-method","يجب اختيار وسيلة تواصل واحدة على الأقل (واتساب أو اتصال)",function(value){ const parent = this.parent; return value  || parent.isContactPhoneCall; }),
  sponsors: array().of(mixed()),
});
const form = useTemplateRef("form");
const validate = async (): Promise<boolean> => {
  isValidating.value = true; errors.value = {};
  try { await form.value?.validate(); isValid.value = true; return true; } catch { isValid.value = false; return false; } finally { isValidating.value = false; }
};
defineExpose({ validate, isValid: readonly(isValid), errors: readonly(errors), isValidating: readonly(isValidating) });

const route =useRoute()
const id= route.params.id.toString()
const adminData =useNuxtData<{data:DetailTournamentRequest}>(`AdminGetSingleTournamentRequest-${id}`)
const SelectedRequest = computed(()=> unref(adminData.data.value?.data))
const logoImageUrl = ref<string>();
watch(SelectedRequest,()=>{ if(SelectedRequest.value?.logoUrl){ logoImageUrl.value = SelectedRequest.value?.logoUrl; } },{immediate:true})
const fileInput = ref<HTMLInputElement>();
const openLogoInput = () => { fileInput.value?.click() }
const onLogoChange = (event: Event) => {
  const traget = event.target as HTMLInputElement
  const file = traget.files?.[0]
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { logoImageUrl.value = e.target?.result as string; props.modelValue.logo = file };
    reader.readAsDataURL(file);
  }
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
watch(() => props.modelValue.location, () => { form.value?.clear("location") }, { deep: true })
</script>

<style></style>
