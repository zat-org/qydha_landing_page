<template>
  <UFormGroup
    :ui="{ error: 'text-xs' }"
    label=" جائزة البطولة "
    name="TournametPrize"
  >
    <UInput :ui="{ base: 'form-input' }" v-model="modelValue.TournametPrize" />
  </UFormGroup>
  <div class="flex flex-col md:flex-row justify-around">
    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label=" عدد الفرق "
      name="TeamsCount"
    >
      <UInput :ui="{ base: 'form-input' }" v-model="modelValue.TeamsCount" />
    </UFormGroup>

    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label=" عدد الحكام "
      name="RefreeCount"
    >
      <UInput :ui="{ base: 'form-input' }" v-model="modelValue.RefreeCount" />
    </UFormGroup>

    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label=" عدد الطولات "
      name="TablesCount"
    >
      <UInput :ui="{ base: 'form-input' }" v-model="modelValue.TablesCount" />
    </UFormGroup>
  </div>
  <div class="flex flex-col md:flex-row justify-around">
    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label=" الدور ال32 "
      name="Stage32Option"
    >
      <USelect
        class="w-[200px]"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.Stage32Option"
        :options="StageOptions"
      />
      <!-- <UInput :ui="{ base: 'form-input' }" v-model="modelValue.Stage32Option" /> -->
    </UFormGroup>
    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label="الدور ال16 "
      name="Stage16Option"
    >
      <USelect
              class="w-[200px]"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.Stage16Option"
        :options="StageOptions"
      />

      <!-- <UInput :ui="{ base: 'form-input' }" v-model="modelValue.Stage16Option" /> -->
    </UFormGroup>
    <UFormGroup
      :ui="{ error: 'text-xs' }"
      label="الدور ال8 "
      name="Stage8Option"
    >
      <!-- <UInput :ui="{ base: 'form-input' }" v-model="modelValue.Stage8Option" /> -->
      <USelect
              class="w-[200px]"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.Stage8Option"
        :options="StageOptions"
      />
    </UFormGroup>
  </div>
  <div class="flex flex-col md:flex-row justify-around">
    <UFormGroup
            class="w-[200px]"
      :ui="{ error: 'text-xs' }"
      label="نصف النهائي"
      name="SemiFinalOption "
    >
      <USelect
        :ui="{ base: 'form-input' }"
        v-model="modelValue.SemiFinalOption"
        :options="StageOptions"
      />
  
      <!-- <UInput :ui="{ base: 'form-input' }" v-model="modelValue.SemiFinalOption" /> -->
    </UFormGroup>
  
    <UFormGroup :ui="{ error: 'text-xs' }" label="النهائي" name="FinalOption ">
      <USelect
              class="w-[200px]"
        :ui="{ base: 'form-input' }"
        v-model="modelValue.FinalOption"
        :options="StageOptions"
      />
      <!-- <UInput :ui="{ base: 'form-input' }" v-model="modelValue.FinalOption" /> -->
    </UFormGroup>
  </div>
  <UFormGroup
    :ui="{ error: 'text-xs' }"
    label="اختيار المشتركين"
    name="TeamSelectionMode"
  >
    <URadioGroup
      :ui="{ inner: 'mb-4' }"
      v-model="modelValue.TeamSelectionMode"
      :options="options"
    />
    <!-- <UInput
      :ui="{ base: 'form-input' }"
      v-model="modelValue.TeamSelectionMode"
    /> -->
  </UFormGroup>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: {
    TournametPrize: string;
    TeamsCount: number;
    RefreeCount: number;
    TablesCount: number;
    Stage32Option: string;
    Stage16Option: string;
    Stage8Option: string;
    SemiFinalOption: string;
    FinalOption: string;
    TeamSelectionMode: string;
  };
}>();
const emit = defineEmits(["update:modelValue"]);
const StageOptions = ["صكة", "3 صكات", "5 صحكات"];
const options = [
  {
    value: "عشوائي",
    label: "عشوائي",
  },
  {
    value: "محدد",
    label: "محدد",
  },
];
</script>

<style></style>
