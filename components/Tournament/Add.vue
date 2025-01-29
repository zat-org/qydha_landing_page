<template>
  <UCard
    :ui="{
      base: '   ',
      body: {
        base: 'flex  h-[400px] md:h-[350  px] justify-center overflow-auto  ',
      },
      header: {
        base: 'flex-col  sticky top-0  z-10 bg-white rounded-xl ',
        padding: 'p-2   sm:p-2 ',
      },
      footer: {
        padding: 'p-2   sm:p-2 ',
      },
    }"
  >
    <template #header class="reactive">
      <UButton
        color="red"
        variant="outline"
        sie="xl"
        icon="mingcute:exit-fill"
        @click="navigateTo('/tournament')"
      />
      <!-- <div class="flex justify-between items-center ">
        <h1
          class="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
        >
          {{ steps.find(s=>s.id==currentStep)?.title }}
        </h1>
      </div> -->
      <!-- خطوات النموذج -->
      <div class="flex justify-center items-center">
        <div class="md:hidden w-full flex justify-center item-center gap-2">
          <div
            v-for="step in steps"
            :key="step.id"
            class="p-2 rounded-lg text-center text-xs scale-95 transition-all"
            :class="[
              currentStep === step.id
                ? 'bg-primary-50 text-primary-600 border border-primary-200 scale-110 '
                : 'bg-gray-50 ',
              isStepCompleted(step.id)
                ? 'bg-primary-50 text-primary-600 border border-primary-200'
                : '',
            ]"
          >
            {{ step.title }}
          </div>
        </div>

        <div class="hidden md:flex justify-center w-full gap-4">
          <div
            v-for="step in steps"
            :key="step.id"
            class="step-button scale-95"
            :class="[
              currentStep === step.id ? 'active scale-110' : ' ',
              isStepCompleted(step.id) ? 'completed' : '',
            ]"
          >
            <div class="step-number">{{ step.id }}</div>
            <span class="step-title">{{ step.title }}</span>
          </div>
        </div>
      </div>
    </template>

    <div v-show="currentStep === 1" class="form-step">
      <UForm
        :schema="CompanySchema"
        :state="formData"
        @submit="nextStep"
        class="inner-Form"
      >
        <TournamentAddCompanyForm v-model="formData" />
        <!-- <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="اسم الشركة المؤسسة "
          name="CompanyName"
        >
          <UInput :ui="{ base: 'form-input' }" v-model="formData.CompanyName" />
        </UFormGroup>
        <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="رقم السجل التجاري "
          name="RegisterNumber"
        >
          <UInput
            :ui="{ base: 'form-input' }"
            v-model.number="formData.RegisterNumber"
          />
        </UFormGroup>
        <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="رقم التواصل مع المؤسسة"
          name="CompanyPhoneNumber"
        >
          <UInput
            :ui="{ base: 'form-input' }"
            v-model.number="formData.CompanyPhoneNumber"
          />
        </UFormGroup> -->
      </UForm>
    </div>

    <!-- معلومات الاتصال -->
    <div v-show="currentStep === 2" class="form-step">
      <UForm
        class="inner-Form"
        :schema="contactSchema"
        :state="formData"
        @submit="nextStep"
      >
        <TournamentAddTourForm v-model="formData" />
      </UForm>
    </div>

    <!-- التفاصيل الإضافية -->
    <div v-show="currentStep === 3" class="form-step">
      <UForm
        :schema="detailsSchema"
        :state="formData"
        @submit="submitForm"
        class="flex flex-col gap-3"
      >
        <TournamentAddTourDetailForm v-model="formData" />
      </UForm>
    </div>

    <div v-show="currentStep === 4" class="form-step">
      <UForm
        :schema="detailsSchema"
        :state="formData"
        @submit="submitForm"
        class="flex flex-col gap-3"
      >
        <TournamentAddRolesForm v-model="formData" />
      </UForm>
    </div>
    <template #footer>
      <div class="flex justify-between items-center px-6">
        <UButton
          v-if="currentStep > 1"
          variant="outline"
          @click="previousStep"
          label="السابق"
          size="xl"
        />
        <UButton
          v-if="currentStep < steps.length"
          color="primary"
          @click="validateAndNext"
          label="التالي"
          size="xl"
        />
        <UButton
          v-if="currentStep === steps.length"
          color="primary"
          :loading="isSubmitting"
          @click="submitForm"
          size="xl"
        >
          إرسال
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import {
  object,
  string,
  number,
  ValidationError,
  date,
  boolean,
  array,
} from "yup";

const currentStep = ref(1);
const isSubmitting = ref(false);
const completedSteps = ref(new Set<number>());

const steps = [
  { id: 1, title: "معلومات الشركة" },
  { id: 2, title: "معلومات البطولة" },
  { id: 3, title: "تفاصيل البطولة" },
  { id: 4, title: "قوانين البطولة" },
];

const formData = reactive({
  CompanyName: "",
  RegisterNumber: "",
  CompanyPhoneNumber: "",
  TournamentName: "",
  TournamentDescription: "",
  TournamentLogo: "",
  TournamentStartDate: new Date().toString(),
  TournamentDays: 3,
  TournamentLocation: { x: 0, y: 0 },
  ConnectionPhoneNumberForPlayers: "",
  Sponsered: false,
  Sponsers: [],
  TournametPrize: "",
  TeamsCount: 10,
  TablesCount: 10,
  Stage32Option: "",
  Stage16Option: "",
  Stage8Option: "",
  SemiFinalOption: "",
  FinalOption: "",
  RefreeCount: 10,
  TeamSelectionMode: "",
  Roles: [],
});
const CompanySchema = object({
  CompanyName: string()
    .required("الاسم مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  RegisterNumber: string().required(" رقم السجل التجاري  مطلوب "),
  CompanyPhoneNumber: string().required(" رقم التواصل مع المؤسسة مطلوب "),
});
// شعار البطولة
const contactSchema = object({
  TournamentName: string().required(" اسم البطولة مطلوب"),
  TournamentDescription: string().required("  وصف البطولة مطلوب"),
  TournamentLogo: string().required("  شعار البطولة مطلوب"),
  TournamentStartDate: date().required("شعار البطولة مطلوب"),
  TournamentDays: number().required(),
  TournamentLocation: object({
    x: number().required(),
    y: number().required(),
  }),
  ConnectionPhoneNumberForPlayers: string().required(
    " رقم للتواصل للاعبين مطلوب "
  ),
  Sponsered: boolean(),
  Sponsers: array().of(string()),
});

const detailsSchema = object({
  TournametPrize: string().required("جائزة البطولة مطلوبة"),
  TeamsCount: number().required("عدد الفرق مطلوب"),
  TablesCount: number().required("عدد الطاولات مطلوب"),
  Stage32Option: string().required("اختيارات الدور 32 مطلوبة"),
  Stage16Option: string().required("اختيارات الدور 16 مطلوبة"),
  Stage8Option: string().required("اختيارات الدور 8 مطلوبة"),
  SemiFinalOption: string().required("اختيارات نص النهائي مطلوبة"),
  FinalOption: string().required("اختيارات  النهائي مطلوبة"),
  RefreeCount: number().required("عدد الحكام مطلوبة"),
  TeamSelectionMode: string().required("طريقة الاختيار مطلوبة"),
});

const isStepCompleted = (stepId: number) => {
  return completedSteps.value.has(stepId);
};

const validateCurrentStep = async () => {
  try {
    switch (currentStep.value) {
      case 1:
        // personalForm.value!.submit();
        await CompanySchema.validate(formData);
        break;
      case 2:
        // contactForm.value!.submit();
        await contactSchema.validate(formData);
        break;
      case 3:
        // detailsForm.value!.submit();
        await detailsSchema.validate(formData);
        break;
    }
    completedSteps.value.add(currentStep.value);

    return true;
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      useToast().add({
        title: "خطأ",
        description: error.message,
        color: "red",
      });
    }
    return false;
  }
};
const validateAndNext = async () => {
  if (await validateCurrentStep()) {
    nextStep();
  }
};

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    completedSteps.value.delete(currentStep.value);
  }
};

const submitForm = async () => {
  if (await validateCurrentStep()) {
    isSubmitting.value = true;
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      useToast().add({
        title: "تم بنجاح",
        description: "تم إرسال النموذج بنجاح",
        color: "green",
      });
    } catch (error) {
      useToast().add({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال النموذج",
        color: "red",
      });
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<style scoped>
.form-step {
  @apply animate-fadeIn w-full;
}
.inner-Form {
  @apply flex flex-col gap-5 w-full;
}

.step-button {
  @apply flex items-center  gap-2 rtl:space-x-reverse p-2 rounded-lg cursor-pointer  transition-all duration-300;
}

.step-button.active {
  @apply bg-primary-50 text-primary-600;
}

.step-button.completed {
  @apply bg-green-50 text-green-600  transition-all duration-300;
}

.step-number {
  @apply w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium;
}

.active .step-number {
  @apply bg-primary-500 text-white;
}

.completed .step-number {
  @apply bg-green-500 text-white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
