<template>
  <div class="space-y-6">
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">قوانين البطولة</h2>
    </div>
    <UForm :state="model" class="space-y-6">
      <div class="flex flex-col md:flex-row gap-3 px-2">
       <UFormField name="Rules" label="قوانين البطولة" class="grow" :error="errors?.rules"><UInput v-model="newRule" class="grow" @keyup.enter="addRule" @blur="onFieldBlur?.('rules')" /></UFormField>
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
const props = defineProps<{ errors?: Record<string, string | undefined>; onFieldBlur?: (field: string) => void }>();
const { errors, onFieldBlur } = toRefs(props);
const model = defineModel<{ rules: string[] }>({ default: () => ({ rules: [] }) })
const {data:book} = await useAssets().getBook()
const newRule = ref(""); const isAdding = ref(false); const editingIndex = ref(-1); const editingRule = ref("");
const addRule = async () => { if (!newRule.value?.trim()) return; isAdding.value = true; try { model.value.rules.push(newRule.value.trim()); newRule.value = ""; props.onFieldBlur?.("rules"); } finally { isAdding.value = false; } };
const startEdit = (index: number, rule: string) => { editingIndex.value = index; editingRule.value = rule; };
const updateRule = (index: number) => { if (editingRule.value?.trim()) model.value.rules[index] = editingRule.value.trim(); props.onFieldBlur?.("rules"); cancelEdit(); };
const cancelEdit = () => { editingIndex.value = -1; editingRule.value = ""; };
const deleteRule = (index: number) => { model.value.rules.splice(index, 1); props.onFieldBlur?.("rules"); };
</script>
