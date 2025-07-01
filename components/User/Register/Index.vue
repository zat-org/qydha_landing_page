<template>
 <UCard class="w-ful h-[calc(100vh-4rem)] flex flex-col justify-center items-center">

        <div v-if="currentStep === 1" class="w-full h-full mx-auto max-w-screen-lg  ">
            <UserRegisterForm @register-success="handleRegisterSuccess" />
 
        </div>
        <div v-else-if="currentStep === 2" class="w-full h-full mx-auto max-w-screen-lg  ">
            <UserRegisterOtp :id="requestId" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
const requestId = ref('')
const currentStep = ref(1)

const handleRegisterSuccess = (id: string) => {
    requestId.value = id
    currentStep.value = 2
}

</script>

<style scoped></style>