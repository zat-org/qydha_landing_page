<template>
  <div class="space-y-6">
    <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
      <h2 class="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">قوانين البطولة</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">تحرير قواعد اللعب كما ستظهر للاعبين</p>
    </div>
    <UForm :state="model" class="space-y-6">
      <div class="flex flex-col gap-3 px-2 md:flex-row">
        <UFormField name="Rules" label="قوانين البطولة" class="grow" :error="errors?.rules">
          <UInput v-model="newRule" class="grow" :disabled="disabledFields?.rules" @keyup.enter="addRule" @blur="onFieldBlur?.('rules')" />
        </UFormField>
        <UButton color="primary" :loading="isAdding" :disabled="!newRule?.trim() || disabledFields?.rules" @click="addRule">إضافة قانون</UButton>
      </div>
      <UFormField name="rules" class="hidden">
        <UInput :model-value="model?.rules?.join(',')" class="hidden" />
      </UFormField>
      <div v-if="model?.rules?.length > 0" class="space-y-3">
        <TransitionGroup name="list">
          <div v-for="(rule, index) in model.rules" :key="index" class="flex items-center gap-3 rounded-lg border bg-white p-3 dark:bg-gray-800">
            <span class="text-sm font-bold">{{ index + 1 }}.</span>
            <div v-if="editingIndex === index" class="flex flex-grow gap-2">
              <UInput v-model="editingRule" class="flex-grow" :disabled="disabledFields?.rules" @keyup.enter="updateRule(index)" />
              <UButton color="primary" :disabled="disabledFields?.rules" @click="updateRule(index)">حفظ</UButton>
              <UButton color="neutral" :disabled="disabledFields?.rules" @click="cancelEdit">إلغاء</UButton>
            </div>
            <p v-else class="flex-grow">{{ rule }}</p>
            <div class="flex gap-2">
              <UButton color="primary" variant="ghost" icon="i-heroicons-pencil" :disabled="disabledFields?.rules" @click="startEdit(index, rule)" />
              <UButton color="error" variant="ghost" icon="i-heroicons-trash" :disabled="disabledFields?.rules" @click="deleteRule(index)" />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ errors?: Record<string, string | undefined>; onFieldBlur?: (field: string) => void; disabledFields?: Record<string, boolean> }>();
const { errors, onFieldBlur, disabledFields } = toRefs(props);
const model = defineModel<{ rules: string[] }>({ default: () => ({ rules: [] }) });

await useAssets().getBook();

const newRule = ref("");
const isAdding = ref(false);
const editingIndex = ref(-1);
const editingRule = ref("");

const addRule = async () => {
  if (props.disabledFields?.rules || !newRule.value?.trim()) return;
  isAdding.value = true;
  try {
    model.value.rules.push(newRule.value.trim());
    newRule.value = "";
    props.onFieldBlur?.("rules");
  } finally {
    isAdding.value = false;
  }
};

const startEdit = (index: number, rule: string) => {
  editingIndex.value = index;
  editingRule.value = rule;
};

const updateRule = (index: number) => {
  if (props.disabledFields?.rules) return;
  if (editingRule.value?.trim()) model.value.rules[index] = editingRule.value.trim();
  props.onFieldBlur?.("rules");
  cancelEdit();
};

const cancelEdit = () => {
  editingIndex.value = -1;
  editingRule.value = "";
};

const deleteRule = (index: number) => {
  if (props.disabledFields?.rules) return;
  model.value.rules.splice(index, 1);
  props.onFieldBlur?.("rules");
};
</script>
