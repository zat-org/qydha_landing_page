<template>
  
    <UForm class="w-full flex justify-center " :state="state" :schema="schema" @submit="onSubmit">
      <UCard class="w-1/2">
        
        <UFormGroup name="id" label="رقم الهوية">
          <UInput v-model="state.id"/>    
        </UFormGroup>
        <p class="text-xs ">ستم ارساله رسالة نصية علي  الواتس او عن طريق الايميل</p>
      <template #footer >
        
        <UButton type="submit">ارسال </UButton>
      </template>
      </UCard>
    </UForm>
  
</template>

<script lang="ts" setup>
import { object, string } from "yup";
const emit  = defineEmits(["prD","prnotexist","pralreadyinteam"])
const schema = object({
  id: string().required("برجاء ادخال رقم الهوية"),
});
const state = reactive({
  id: "",
});

const onSubmit = () => {
  console.log(state);
  // check if request is goood 
  // submit event that go next tab
  emit("prD")  
  
};
</script>

<style></style>
