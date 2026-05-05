<template>
  <div class="space-y-6">
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">قوانين البطولة</h2>
    </div>
    <UForm :schema="localSchema" :state="model" ref="formRef" class="space-y-6">
      <div class="flex flex-col md:flex-row gap-3 px-2">
       <UFormField name="Rules" label="قوانين البطولة" class="grow"><UInput v-model="newRule" class="grow" @keyup.enter="addRule" /></UFormField>
        <UButton color="primary" :loading="isAdding" :disabled="!newRule?.trim()" @click="addRule">إضافة قانون</UButton>
      </div>
      <UFormField name="rules" class="hidden"><UInput :model-value="model?.rules.join(',')" class="hidden" /></UFormField>
      <div v-if=" model?.rules && model?.rules.length > 0" class="space-y-3">
        <TransitionGroup name="list">
          <div v-for="(rule, index) in model.rules" :key="index" class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <span class="font-bold text-sm">{{ index + 1 }}.</span>
            <div v-if="editingIndex === index" class="flex-grow flex gap-2">
              <UInput v-model="editingRule" class="flex-grow" @keyup.enter="updateRule(index)" />
              <UButton color="primary" @click="updateRule(index)">حفظ</UButton>
              <UButton color="neutral" @click="cancelEdit">إلغاء</UButton>
            </div>
            <p v-else class="flex-grow">{{ rule }}</p>
            <div class="flex gap-2">
              <UButton color="primary" variant="ghost" icon="i-heroicons-pencil" @click="startEdit(index, rule)" />
              <UButton color="error" variant="ghost" icon="i-heroicons-trash" @click="deleteRule(index)" />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { object, array, string } from "yup";
const model = defineModel<{ rules: string[] }>({ default: () => ({ rules: [] }) })
const isValid = ref(false); const errors = ref<Record<string, string>>({}); const isValidating = ref(false);
const formRef = ref<HTMLFormElement | null>(null);
const localSchema = object({ rules: array().of(string()) });
const validate = async (): Promise<boolean> => { isValidating.value = true; errors.value = {}; try { await formRef.value?.validate(); isValid.value = true; return true; } catch { isValid.value = false; return false; } finally { isValidating.value = false; } };
defineExpose({ validate, isValid: readonly(isValid), errors: readonly(errors), isValidating: readonly(isValidating) });
const {data:book} = await useAssets().getBook()
const newRule = ref(""); const isAdding = ref(false); const editingIndex = ref(-1); const editingRule = ref("");
const addRule = async () => { if (!newRule.value?.trim()) return; isAdding.value = true; try { model.value.rules.push(newRule.value.trim()); newRule.value = ""; } finally { isAdding.value = false; } };
const startEdit = (index: number, rule: string) => { editingIndex.value = index; editingRule.value = rule; };
const updateRule = (index: number) => { if (editingRule.value?.trim()) model.value.rules[index] = editingRule.value.trim(); cancelEdit(); };
const cancelEdit = () => { editingIndex.value = -1; editingRule.value = ""; };
const deleteRule = (index: number) => { model.value.rules.splice(index, 1); };
</script>
