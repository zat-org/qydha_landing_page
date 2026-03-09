<template>
  <ClientOnly>
    <VDatePicker v-bind="$attrs" dir="ltr" v-model="internalDate" :is-dark="isDark" :mode="enableTime ? 'dateTime' : 'date'"
      :masks="{ input: 'DD/MM/YYYY HH:mm' }" class="z-100">
      <template #default="{ inputValue, inputEvents }">
        <UInput :value="inputValue" v-on="inputEvents" />
      </template>

    </VDatePicker>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const props = withDefaults(defineProps<{
  enableTime?: boolean
}>(), {
  enableTime: true
})

const isDark = computed(() => colorMode.value === 'dark')

const model = defineModel<string | Date | null>()

const emit = defineEmits<{
  'update:modelValue': [value: string | Date | null]
  'change': [value: Date | null]
  'input': [value: Date | null]
}>()

const internalDate = computed<Date | null>({
  get: () => {
    if (!model.value) return null
    return model.value instanceof Date ? model.value : new Date(model.value as string)
  },
  set: (value) => {
    if (value) {
      const utcIsoString = value.toISOString()
      model.value = utcIsoString as any
      emit('change', value)
      emit('input', value)
    } else {
      model.value = null as any
      emit('change', null)
      emit('input', null)
    }
  }
})
</script>