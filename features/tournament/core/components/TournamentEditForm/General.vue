<template>
  <UCard class="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900">
    <template #header>
      <div class="form-header mb-6">
        <h2
          class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100"
        >
          معلومات البطولة
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          يرجى إدخال المعلومات الأساسية للبطولة
        </p>
      </div>
    </template>

    <UForm :state="modelValue" class="flex flex-col space-y-6">
      <UFormField
        label="اسم البطولة"
        name="title"
        required
        :error="errors?.title"
      >
        <UInput
          v-model="modelValue.title"
          :disabled="disabledFields?.title"
          placeholder="أدخل اسم البطولة"
          @blur="onFieldBlur?.('title')"
        />
      </UFormField>
      <UFormField
        label="وصف البطولة"
        name="description"
        required
        :error="errors?.description"
      >
        <UTextarea
          v-model="modelValue.description"
          :disabled="disabledFields?.description"
          :rows="5"
          placeholder="أدخل وصف البطولة"
          @blur="onFieldBlur?.('description')"
        />
      </UFormField>
      <UFormField
        label="شعار البطولة"
        name="logo"
        required
        :error="errors?.logo"
      >
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept=".png,.jpg,.jpeg"
          :disabled="disabledFields?.logo"
          @change="onLogoChange"
        />
        <div class="flex flex-col items-center gap-4">
          <div
            class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800"
          >
            <template v-if="!logoImageUrl">
              <div
                class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500"
              >
                <UButton
                  color="primary"
                  variant="ghost"
                  class="flex flex-col items-center gap-2"
                  :disabled="disabledFields?.logo"
                  @click="openLogoInput()"
                >
                  <UIcon name="i-heroicons-plus-circle" class="w-12 h-12" />
                  <span class="text-sm">إضافة شعار</span>
                </UButton>
              </div>
            </template>
            <template v-else>
              <div
                class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2"
              >
                <UButton
                  color="error"
                  variant="solid"
                  size="sm"
                  :disabled="disabledFields?.logo"
                  @click="removeLogo()"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
                <UButton
                  color="primary"
                  variant="solid"
                  size="sm"
                  :disabled="disabledFields?.logo"
                  @click="openLogoInput()"
                >
                  <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                </UButton>
              </div>
              <img
                :src="logoImageUrl"
                class="w-full h-full object-cover"
                alt="شعار البطولة"
              />
            </template>
          </div>
        </div>
      </UFormField>

      <UFormField
        label="رقم التواصل للاعبين"
        name="contactPhone"
        required
        :error="errors?.contactPhone"
      >
        <div class="flex items-center gap-4 flex-col md:flex-row">
          <AsyncPhoneInput
            v-model="modelValue.contactPhone"
            dir="ltr"
            :disabled="disabledFields?.contactPhone"
            @blur="onFieldBlur?.('contactPhone')"
          />
          <div class="shrink-0">
            <div class="flex items-center gap-4">
              <UCheckbox
                v-model="modelValue.isContactPhoneWhatsapp"
                :disabled="disabledFields?.isContactPhoneWhatsapp"
                label="واتساب"
                @update:model-value="onFieldBlur?.('isContactPhoneWhatsapp')"
              />
              <UCheckbox
                v-model="modelValue.isContactPhoneCall"
                :disabled="disabledFields?.isContactPhoneCall"
                label="اتصال"
                @update:model-value="onFieldBlur?.('isContactPhoneCall')"
              />
            </div>
            <p
              v-if="
                errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall
              "
              class="mt-1 text-xs text-red-500"
            >
              {{ errors?.isContactPhoneWhatsapp || errors?.isContactPhoneCall }}
            </p>
          </div>
        </div>
      </UFormField>

      <UFormField
        label="مكان البطولة"
        name="locationDescription"
        required
        :error="errors?.locationDescription"
      >
        <UInput
          v-model="modelValue.locationDescription"
          :disabled="disabledFields?.locationDescription"
          placeholder="أدخل عنوان البطولة"
          @blur="onFieldBlur?.('locationDescription')"
        />
      </UFormField>
      <UFormField
        label="موقع البطولة"
        name="location"
        required
        :error="errors?.location"
        :help="
          modelValue.location.latitude != 0 &&
          modelValue.location.longitude != 0
            ? 'تم اختيار الموقع'
            : 'يرجى اختيار الموقع'
        "
      >
        <MapGoogleMapsUrlInput
          v-model:location="modelValue.location"
          v-model:location-name="modelValue.locationDescription"
          :disabled="disabledFields?.location"
          name="location"
          label="رابط Google Maps"
          @parsed="onFieldBlur?.('location')"
        />
      </UFormField>
      <UFormField
        label="نوع البطولة"
        name="type"
        required
        :error="errors?.type"
      >
        <USelect
          v-model="modelValue.type"
          :disabled="disabledFields?.type"
          :items="TournamentTypeOptions"
          placeholder="اختر نوع البطولة"
          @update:model-value="onFieldBlur?.('type')"
        />
      </UFormField>
      <UFormField
        v-if="modelValue.type == TournamentType.private"
        label="رمز السري البطولة "
        name="tournamentPrivatePassword"
        required
        :error="errors?.tournamentPrivatePassword"
      >
        <UInput
          v-model="modelValue.tournamentPrivatePassword"
          :disabled="disabledFields?.tournamentPrivatePassword"
          placeholder="أدخل  الرمز السري للبطولة "
          @blur="onFieldBlur?.('tournamentPrivatePassword')"
        />
      </UFormField>

      <div class="flex items-center justify-between">
        <UFormField label=" هل يوجد الرعاة" name="Sponsered">
          <USwitch
            v-model="sponsersAvilabel"
            :disabled="disabledFields?.sponsors"
            size="lg"
          />
        </UFormField>
        <UButton
          v-if="sponsersAvilabel"
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          size="sm"
          :disabled="disabledFields?.sponsors"
          @click="AddSponser"
        >
          إضافة راعي
        </UButton>
        <input
          ref="SponsorInput"
          type="file"
          name="sponsor"
          class="hidden"
          accept=".png,.jpg,.jpeg"
          :disabled="disabledFields?.sponsors"
          @input="onSponsorsChange($event)"
        />
      </div>
      <div
        v-if="sponsersAvilabel"
        class="sponsors-gallery p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-28 md:h-40"
      >
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div
            v-for="(image, index) of SponsorsUrl"
            :key="index"
            class="relative group shrink-0"
          >
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <img
                :src="
                  image || 'https://avatars.githubusercontent.com/u/739984?v=4'
                "
                class="w-full h-full object-cover"
                alt="شعار الراعي"
              />
              <button
                type="button"
                :disabled="disabledFields?.sponsors"
                class="absolute inset-0 bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed"
                @click="removeSponsors(index)"
              >
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

interface SponsorItem {
  type: "existing" | "new";
  url: string;
  fileIndex?: number;
  urlIndex?: number;
}

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
  initialLogoUrl?: string;
  owner?: TournamentOwner | null;
}>();

const modelValue = defineModel<any>({ required: true });
const { errors, onFieldBlur, disabledFields } = toRefs(props);

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
    if (
      !(file instanceof File) &&
      logoImageUrl.value === "" &&
      props.initialLogoUrl
    ) {
      logoImageUrl.value = props.initialLogoUrl;
    }
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

const SponsorInput = ref<HTMLInputElement>();
const sponsersAvilabel = ref(false);
const sponsorItems = ref<SponsorItem[]>([]);
const SponsorsUrl = computed(() => sponsorItems.value.map((item) => item.url));

watch(
  () => modelValue.value?.remainingSponsorsUrls,
  (urls) => {
    const list = urls ?? [];
    const newOnly = sponsorItems.value.filter((s) => s.type === "new");
    if (list.length > 0) {
      sponsorItems.value = [
        ...list.map((url: string, urlIndex: number) => ({
          type: "existing" as const,
          url,
          urlIndex,
        })),
        ...newOnly,
      ];
      sponsersAvilabel.value = true;
    } else if (newOnly.length === 0) {
      sponsorItems.value = [];
    } else {
      sponsorItems.value = newOnly;
    }
  },
  { immediate: true, deep: true },
);

const AddSponser = () => SponsorInput.value?.click();

const onSponsorsChange = (event: Event) => {
  if (props.disabledFields?.sponsors) return;
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      modelValue.value.sponsors.push(file);
      const fileIndex = modelValue.value.sponsors.length - 1;
      sponsorItems.value.push({ type: "new", url: previewUrl, fileIndex });
    };
    reader.readAsDataURL(file);
    target.value = "";
    props.onFieldBlur?.("sponsors");
  }
};

const removeSponsors = (index: number) => {
  const item = sponsorItems.value[index];
  if (!item) return;
  if (item.type === "existing" && item.urlIndex !== undefined) {
    modelValue.value.remainingSponsorsUrls.splice(item.urlIndex, 1);
    sponsorItems.value.forEach((sponsorItem) => {
      if (
        sponsorItem.type === "existing" &&
        sponsorItem.urlIndex !== undefined &&
        sponsorItem.urlIndex > item.urlIndex!
      ) {
        sponsorItem.urlIndex -= 1;
      }
    });
  } else if (item.type === "new" && item.fileIndex !== undefined) {
    modelValue.value.sponsors.splice(item.fileIndex, 1);
    sponsorItems.value.forEach((sponsorItem) => {
      if (
        sponsorItem.type === "new" &&
        sponsorItem.fileIndex !== undefined &&
        sponsorItem.fileIndex > item.fileIndex!
      ) {
        sponsorItem.fileIndex -= 1;
      }
    });
  }
  sponsorItems.value.splice(index, 1);
  if (sponsorItems.value.length === 0) sponsersAvilabel.value = false;
};

watch(
  () => props.disabledFields?.sponsors,
  (isDisabled) => {
    if (isDisabled)
      sponsersAvilabel.value = !!(
        modelValue.value.sponsors?.length ||
        modelValue.value.remainingSponsorsUrls?.length
      );
  },
);

watch(
  () =>
    [
      modelValue.value?.sponsors?.length,
      modelValue.value?.remainingSponsorsUrls?.length,
    ] as const,
  ([sponsorsLen, remainingLen]) => {
    if ((sponsorsLen ?? 0) > 0 || (remainingLen ?? 0) > 0)
      sponsersAvilabel.value = true;
  },
  { immediate: true },
);
</script>

<style scoped></style>
