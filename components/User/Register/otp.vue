<template>
    <UCard class="w-full mx-auto p-4 h-full">
        <!-- Header -->
        <template #header>
            <div class="text-center">
                
                <h2 class="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">التحقق من رقم الجوال</h2>
                <p class="text-[var(--color-text-secondary)]">تم إرسال رمز التحقق إلى رقم جوالك</p>
            </div>
        </template>

        <!-- Content -->
        <div class="flex flex-col gap-4 items-center justify-center">
            <OtpInput v-model="otp" :length="6" />
        </div>

        <!-- Footer -->
        <template #footer>
            <div class="text-center text-sm text-[var(--color-text-secondary)]">
                <UButton block size="lg" :disabled="otp.length !== 6" :loading="status === 'pending'" @click="verifyOtp" class="w-full">
                    تحقق
                </UButton>
                <!-- <div class="flex gap-1 justify-center  items-center ">
                    <p>لم يصلك الرمز؟</p>
                    <UButton variant="link" color="primary" :loading="status === 'pending'" @click="resendOtp">
                        إعادة إرسال الرمز
                    </UButton>

                </div> -->
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
const toast = useToast()
const otp = ref('')
const props = defineProps<{
    id: string
}>()

const { fetchREQ, error, status, data } = await useAuth().registerConfirm();

const verifyOtp = async () => {

    await fetchREQ(props.id, otp.value);

    if (status.value === 'success') {
        toast.add({
            title: 'تم التحقق بنجاح',
            description: 'تم التحقق من رقم الجوال بنجاح',
            color: 'success',
            icon: 'i-heroicons-check-circle',
        })

        // Navigate to login or dashboard
        navigateTo('/login')
    }
    if (status.value === 'error') {
        toast.add({
            title: 'خطأ في التحقق',
            description: 'رمز التحقق غير صحيح',
            color: 'error',
            icon: 'i-heroicons-x-circle',
        })
    }
}

// const resendOtp = async () => {

//     await fetchREQ(props.id, otp.value);
//     if (status.value === 'success') {
//         toast.add({
//             title: 'تم إعادة الإرسال',
//             description: 'تم إرسال رمز تحقق جديد إلى رقم جوالك',
//             color: 'green',
//             icon: 'i-heroicons-check-circle',
//         })
//     } if (status.value === 'error') {
//         toast.add({
//             title: 'خطأ في إعادة الإرسال',
//             description: 'حدث خطأ أثناء إعادة إرسال الرمز',
//             color: 'red',
//             icon: 'i-heroicons-x-circle',
//         })
//     }
// }
</script>