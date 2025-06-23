<template>
    <UForm ref="RegisterForm" :schema="schema" :state="form" @submit="onSubmit"
       class="w-full max-w-4xl sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto bg-[var(--color-background)] dark:bg-[var(--color-background-secondary)] p-4 sm:p-6  rounded-2xl shadow-md flex flex-col gap-4 border border-[var(--color-border)] dark:border-[var(--color-border)]">
      <legend
        class="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
        تسجيل حساب جديد</legend>
      <UFormGroup name="username" :label="'اسم المستخدم'">
        <UInput v-model="form.username"  placeholder="ادخل اسم المستخدم" autocomplete="username"
          size="lg" />
      </UFormGroup>
  
      <UFormGroup name="phone" :label="'رقم الجوال'" description="مثال: 05xxxxxxxx">
        <ClientOnly>
          <AsyncPhoneInput
            v-model="form.phone"          
            dir="ltr"
            size="lg"
            placeholder="ادخل رقم الجوال"
          />
        </ClientOnly>
      </UFormGroup>
  
      <UFormGroup name="password" :label="'كلمة المرور'">
        <div class="relative">
          <UInput 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="ادخل كلمة المرور"
            autocomplete="new-password" 
            size="lg" 
          />
          <UButton
            class="absolute left-2 top-1/2 -translate-y-1/2"
            color="gray"
            variant="ghost"
            size="xs"
            @click="showPassword = !showPassword"
          >
            <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
          </UButton>
        </div>
      </UFormGroup>
      <UFormGroup name="confirmPassword" :label="'تأكيد كلمة المرور'">
        <UInput v-model="form.confirmPassword" type="password"
          placeholder="اعد كتابة كلمة المرور" autocomplete="new-password" size="lg" />
      </UFormGroup>
      <UAlert v-if="generalError" color="red" variant="subtle" :title="generalError" class="mb-4" />
          <UButton type="submit" block size="lg" class="mt-2">تسجيل</UButton>
    </UForm>
  </template>
  
  <script setup lang="ts" async>
  import { object, string, ref as yupRef } from 'yup'
  import { useAuth } from '~/composables/auth'
  const emit = defineEmits(['register-success'])
  const toast = useToast();
  interface IRegisterForm {
    username: string
    phone: string
    password: string
    confirmPassword: string
  }
  const RegisterForm = ref()
  
  const form = reactive({
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const showPassword = ref(false)
  
  
  const schema = object({
    username: string().required('اسم المستخدم مطلوب'),
    phone: string()
      .required('رقم الجوال مطلوب')
      .min(6, 'رقم الجوال يجب أن يكون 6 أرقام على الأقل'),
    // .matches(/^05\d{8,13}$/, 'رقم الجوال غير صالح'),
    password: string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .matches(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل')
      .required('كلمة المرور مطلوبة'),
    confirmPassword: string()
      .oneOf([yupRef('password')], 'كلمتا المرور غير متطابقتين')
      .required('تأكيد كلمة المرور مطلوب'),
  })
  const generalError = ref('')
  
  const { register } = useAuth()
  
  const { fetchREQ, error, status,data } = await register()
  async function onSubmit() {
    generalError.value = ''
    
      await fetchREQ(form)
  
      if (status.value === 'error') {
        // Handle backend validation errors
        const backendError = error.value?.data as { errors?: { [key: string]: unknown  }, code:string } | undefined
        const backendErrors = backendError?.errors
        if (backendError?.code === 'DbUniqueViolation') {
          generalError.value = 'اسم المستخدم او رقم الجوال مستخدم من قبل'
        }
        else if (backendError?.code === "InvalidBodyInput"){
          console.log(backendErrors)
          if (backendErrors) {
          Object.entries(backendErrors).forEach(([field, messages]) => {
            console.log( messages )
            console.log(field.toLowerCase()) 
              
            if (RegisterForm.value)RegisterForm.value.setErrors([{path:field.trim().toLowerCase(),message:(messages as string[] ).toString()}] )// ( messages as string[]) [0]
            console.log("error added")
          })
        } 
        }
  
        
      }
      if(status.value === 'success'){
        toast.add({
          title: 'تم التسجيل بنجاح',
          description: 'تم إرسال رمز التحقق إلى رقم جوالك',
          color: 'green',
          icon: 'i-heroicons-check-circle',
        })
        emit('register-success',data.value?.data.requestId)
    //    navigateTo('/login'); 
      }
    
    
  }
  </script>