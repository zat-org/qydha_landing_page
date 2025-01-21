<template>
  <UCard
    :ui="{
      base: 'flex h-full flex-col ',
      body: { base: 'grow flex items-center justify-center      ' },
      header: {
        base:'flex-col ',
        padding: 'p-2   sm:p-2 ',
      },
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">

        <h1
        class="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent "
        >

        نموذج متعدد الخطوات
      </h1>
      <UButton  color="red" variant="outline" sie="xl" icon="mingcute:exit-fill" @click="navigateTo('/tournament')" />
    </div>
      <!-- {{ completedSteps }} ---  {{ currentStep }} -->
      <!-- خطوات النموذج -->
      <div class="flex justify-center  items-center mt-4 mb-4 h-8 md:h-auto">
        <div class=" md:hidden  h-8 w-full flex justify-center item-center   gap-2  relative" >
          <div
            v-for="step in steps"
            :key="step.id"
            class="  h-8 w-[50%] p-2 rounded-lg text-center text-xs cursor-pointer scale-95 transition-all absolute  "
            :class="[
              currentStep === step.id
                ? 'opacity-100 bg-primary-50 text-primary-600 border border-primary-200 scale-110 '
                : 'bg-gray-50 opacity-0',
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
            class=" step-button scale-95"
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

    <!-- معلومات شخصية -->
    <div v-show="currentStep === 1" class="form-step">
      <UForm
        ref="personalForm"
        :schema="personalInfoSchema"
        :state="formData"
        @submit="nextStep"
      >
        <UFormGroup label="الاسم" name="name">
          <UInput
            :ui="{ base: 'form-input' }"
            v-model="formData.name"
            placeholder="ادخل اسمك"
            class=""
          />
        </UFormGroup>
        <UFormGroup label="العمر" name="age">
          <UInput
            :ui="{ base: 'form-input' }"
            v-model.number="formData.age"
            type="number"
            placeholder="ادخل عمرك"
          />
        </UFormGroup>
      </UForm>
    </div>

    <!-- معلومات الاتصال -->
    <div v-show="currentStep === 2" class="form-step">
      <UForm
        ref="contactForm"
        :schema="contactSchema"
        :state="formData"
        @submit="nextStep"
      >
        <UFormGroup label="البريد الإلكتروني" name="email">
          <UInput
            :ui="{ base: 'form-input' }"
            v-model="formData.email"
            type="email"
            placeholder="example@domain.com"
          />
        </UFormGroup>
        <UFormGroup label="رقم الهاتف" name="phone">
          <UInput
            :ui="{ base: 'form-input' }"
            v-model="formData.phone"
            placeholder="05xxxxxxxx"
          />
        </UFormGroup>
      </UForm>
    </div>

    <!-- التفاصيل الإضافية -->
    <div v-show="currentStep === 3" class="form-step">
      <UForm
        :schema="detailsSchema"
        :state="formData"
        ref="detailsForm"
        @submit="submitForm"
      >
        <UFormGroup label="ملاحظات" name="notes">
          <UTextarea
            :ui="{ base: 'form-input' }"
            v-model="formData.notes"
            placeholder="اكتب ملاحظاتك هنا"
            :rows="4"
          />
        </UFormGroup>
      </UForm>
    </div>

    <template #footer>
      <div class="flex justify-between items-center px-6 py-4">
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
import { object, string, number, ValidationError } from "yup";

const currentStep = ref(1);
const isSubmitting = ref(false);
const completedSteps = ref(new Set<number>());

const steps = [
  { id: 1, title: "المعلومات الشخصية" },
  { id: 2, title: "معلومات الاتصال" },
  { id: 3, title: "التفاصيل الإضافية" },
];

const formData = reactive({
  name: "",
  age: "",
  email: "",
  phone: "",
  notes: "",
});
const personalForm = ref<HTMLFormElement>();
const personalInfoSchema = object({
  name: string()
    .required("الاسم مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  age: number()
    .required("العمر مطلوب")
    .typeError("العمر يجب أن يكون رقماً")
    .min(18, "يجب أن يكون العمر 18 سنة على الأقل")
    .max(100, "العمر غير صحيح"),
});

const contactForm = ref<HTMLFormElement>();

const contactSchema = object({
  email: string()
    .required("البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  phone: string()
    .required("رقم الهاتف مطلوب")
    .matches(/^05\d{8}$/, "رقم الهاتف غير صحيح"),
});
const detailsForm = ref<HTMLFormElement>();

const detailsSchema = object({
  notes: string()
    .required("الملاحظات مطلوبة")
    .min(10, "الملاحظات يجب أن تكون 10 أحرف على الأقل"),
});

const isStepCompleted = (stepId: number) => {
  return completedSteps.value.has(stepId);
};

const validateCurrentStep = async () => {
  try {
    switch (currentStep.value) {
      case 1:
        // personalForm.value!.submit();
        await personalInfoSchema.validate(formData);
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
  @apply space-y-6 animate-fadeIn  w-[80%];
}

.step-button {
  @apply flex items-center space-x-2 rtl:space-x-reverse p-4 rounded-lg cursor-pointer  transition-all duration-300;
  
}

.step-button.active {
  @apply bg-primary-50 text-primary-600  ;
  
}

.step-button.completed {
  @apply bg-green-50 text-green-600  transition-all duration-300;
}

.step-number {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium;
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
