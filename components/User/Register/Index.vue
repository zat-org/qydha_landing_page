<template>
    <div class="flex flex-col items-center justify-center  w-full">
        <div v-if="currentStep === 1" class="w-full max-w-screen-md  ">
            <UserRegisterForm @register-success="handleRegisterSuccess" />
 
        </div>
        <div v-else-if="currentStep === 2" class="w-full max-w-lg">
            <UserRegisterOtp :id="requestId" />
        </div>
    </div>
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