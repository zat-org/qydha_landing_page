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
        <UFormGroup :ui="{
          wrapper: 'space-y-1',
          label: {
            base: 'text-sm font-medium text-gray-700 dark:text-gray-300',
          },
          error: 'text-xs mt-1 text-red-500'
        }" label="اسم البطولة" name="TournamentName" required>
          <UInput :ui="{
            base: 'form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200',
          }" v-model="modelValue.TournamentName" placeholder="أدخل اسم البطولة" icon="i-heroicons-trophy" />
        </UFormGroup>

        <UFormGroup :ui="{
          wrapper: 'space-y-1',
          label: {
            base: 'text-sm font-medium text-gray-700 dark:text-gray-300',
          },
          error: 'text-xs mt-1 text-red-500'
        }" label="وصف البطولة" name="TournamentDescription" required>
          <UTextarea :ui="{
            base: 'form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200',
          }" v-model="modelValue.TournamentDescription" :rows="5" placeholder="أدخل وصف البطولة" />
        </UFormGroup>
      </div>

      <!-- Right Column logo select   -->
      <div>
        <UFormGroup :ui="{
          wrapper: 'space-y-1',
          label: {
            base: 'text-sm font-medium text-gray-700 dark:text-gray-300',
          },
          error: 'text-xs mt-1 text-red-500'
        }" label="شعار البطولة" name="TournamentLogo" required>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onLogoChange" />
          
          <div class="flex flex-col items-center gap-4">
            <div
              class="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200 cursor-pointer group bg-gray-50 dark:bg-gray-800">
              <template v-if="!logoImageUrl">
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-500">
                  <UButton
                    color="amber"
                    variant="ghost"
                    class="flex flex-col items-center gap-2"
                    @click="openLogoInput()"
                  >
                    <UIcon name="i-heroicons-plus-circle" class="w-12 h-12" />
                    <span class="text-sm">إضافة شعار</span>
                  </UButton>
                </div>
              </template>
              <template v-else>
                <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <UButton
                    color="red"
                    variant="solid"
                    size="sm"
                    @click="removeLogo()"
                  >
                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                  </UButton>
                  <UButton
                    color="primary"
                    variant="solid"
                    size="sm"
                    @click="openLogoInput()"
                  >
                    <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                  </UButton>
                </div>
                <img :src="logoImageUrl" class="w-full h-full object-cover" alt="شعار البطولة" />
              </template>
            </div>
          </div>
        </UFormGroup>
      </div>
    </div>

    <!-- Date and Duration Section -->
    <div class="space-y-4 md:space-y-6 p-3 md:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <UFormGroup :ui="{
        wrapper: 'space-y-2',
        label: {
          base: 'text-base font-semibold text-gray-800 dark:text-gray-100',
        },
        error: 'text-sm mt-1 text-red-500'
      }" label="عدد أيام البطولة" name="TournamentDays" required>
        <div class="relative flex items-center gap-2">
          <UInput 
            type="number" 
            :ui="{
              base: 'form-input w-24 px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base',
            }" 
            v-model="modelValue.TournamentDaysNumber" 
            min="1" 
            @input="updateTournamentDates"
            class="hover:border-primary-300 text-center" 
          />
          <span class="text-gray-600 dark:text-gray-400">يوم</span>
        </div>
      </UFormGroup>

      <div v-if="modelValue.TournamentDaysNumber > 0" class="space-y-4 mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="(date, index) in modelValue.TournamentDates" 
               :key="index" 
               class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition-colors duration-200">
            <UFormGroup :ui="{
              wrapper: 'space-y-2',
              label: {
                base: 'text-sm font-medium text-gray-700 dark:text-gray-300',
              },
              error: 'text-xs mt-1 text-red-500'
            }" :label="`تاريخ اليوم ${index + 1}`" :name="`TournamentDate${index + 1}`" required>
              <div class="relative">
                <UInput 
                  type="date" 
                  :ui="{
                    base: 'form-input w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200',
                  }" 
                  v-model="modelValue.TournamentDates[index]"
                  class="hover:border-primary-300" 
                />
              </div>
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Number Section -->
    <UFormGroup :ui="{
      wrapper: 'space-y-2',
      label: {
        base: 'text-base font-semibold text-gray-800 dark:text-gray-100',
      },
      error: 'text-sm mt-1 text-red-500'
    }" label="رقم التواصل للاعبين" name="ConnectionPhoneNumberForPlayers" required>
      <div class="flex items-center gap-4">
        <AsyncPhoneInput 
          dir="ltr"
          v-model="modelValue.ConnectionPhoneNumberForPlayers"
        />
        
        <div class="flex items-center gap-4 shrink-0">
          <UCheckbox
            v-model="modelValue.isWhatsappAvailable"
            label="واتساب"
            :ui="{
              wrapper: 'flex items-center gap-2',
              label: 'text-sm text-gray-700 dark:text-gray-300',
              checkbox: {
                base: 'h-4 w-4 rounded border-2 border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
              }
            }"
          />
          <UCheckbox
            v-model="modelValue.isCallAvailable"
            label="اتصال"
            :ui="{
              wrapper: 'flex items-center gap-2',
              label: 'text-sm text-gray-700',
              checkbox: {
                base: 'h-4 w-4 rounded border-2 border-gray-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              }
            }"
          />
        </div>
      </div>
    </UFormGroup>

    <!-- Sponsors Section -->
    
      <div class="flex items-center justify-between">
        <UFormGroup :ui="{
          wrapper: 'space-y-1',
          label: {
            base: 'text-sm font-medium text-gray-700'
          },
          error: 'text-xs mt-1 text-red-500'
        }" label=" هل يوجد الرعاة" name="Sponsered">
          <UToggle v-model="modelValue.Sponsered" size="lg" />
        </UFormGroup>

        <UButton 
          v-if="modelValue.Sponsered" 
          @click="AddSponser()" 
          color="primary" 
          variant="soft"
          icon="i-heroicons-plus" 
          size="sm"
          class="p-2.5 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
          :ui="{
            base: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-200',
          }"
        >
          إضافة راعي
        </UButton>
        
        <input 
          ref="SponsorInput" 
          type="file" 
          name="sponsor" 
          class="hidden" 
          @input="onSponsorsChange($event)"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
        />
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
  </div>
</template>

<script lang="ts" setup>

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
  };
}>();
const emit = defineEmits(["update:modelValue"]);
const logoImageUrl = ref<string>("");
const logoImageFile = ref<File>();
const fileInput = ref<HTMLInputElement>();

const openLogoInput = () => {
  fileInput.value?.click()
}
const removeLogo = () => {
  logoImageUrl.value = ""
}

const onLogoChange = (event: Event ) => {
  const traget  = event.target as HTMLInputElement
  const file  = traget.files?.[0]

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const updateTournamentDates = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  console.log(value);
  props.modelValue.TournamentDates =
   Array.from({ length:value || 1 }, 
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

</script>

<style></style>
