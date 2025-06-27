<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          قوانين البطولة
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          قم بإضافة وتعديل قوانين البطولة الخاصة بك
        </p>
      </div>
      
    <UModal v-model="showRulesGuide" title="دليل القوانين المقترحة" description="دليل القوانين المقترحة">
      <UButton size="lg" color="primary" variant="soft" icon="i-heroicons-book-open" @click="showRulesGuide = true">
        دليل القوانين
      </UButton>
      <template #body>
        <div class="space-y-4 p-4 overflow-y-auto max-h-[calc(100vh-300px)] min-h-[400px]">
          <div v-for="(rule, index) in predefinedRules" :key="index" 
            class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 group">
            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full font-medium">
              {{ index + 1 }}
            </span>
            <p class="flex-grow text-gray-700 dark:text-gray-200">{{ rule }}</p>
           
          </div>
        </div>
      </template>
    </UModal>
      
    </div>


    <!-- Add Rule Section -->
    <div class="flex flex-col md:flex-row gap-3 px-2">
      <UInput v-model="newRule" class="grow" placeholder="أدخل قانون جديد..." :error="ruleError" @keyup.enter="addRule">
      </UInput>
      <UButton color="primary" :loading="isAdding" :disabled="!newRule?.trim()" @click="addRule" class="shrink-0">
        <UIcon name="i-heroicons-plus" class="mr-1" />
        إضافة قانون
      </UButton>
    </div>

    <!-- Rules List -->
    <div v-if="modelValue.Roles.length > 0" class="space-y-3">
      <TransitionGroup name="list">
        <div v-for="(rule, index) in modelValue.Roles" :key="index"
          class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group">
          <span
            class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full font-medium">
            {{ index + 1 }}
          </span>

          <div v-if="editingIndex === index" class="flex-grow flex gap-2">
            <UInput v-model="editingRule" class="flex-grow" @keyup.enter="updateRule(index)" />
            <UButton color="primary" @click="updateRule(index)">حفظ</UButton>
            <UButton color="neutral" @click="cancelEdit">إلغاء</UButton>
          </div>

          <p v-else class="flex-grow text-gray-700 dark:text-gray-200">
            {{ rule }}
          </p>

          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <UButton color="primary" variant="ghost" icon="i-heroicons-pencil" @click="startEdit(index, rule)" />
            <UButton color="error" variant="ghost" icon="i-heroicons-trash" @click="deleteRule(index)" />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد قوانين</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإضافة قوانين البطولة الخاصة بك</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: {
    Roles: string[];
  };
}>();

const emit = defineEmits(["update:modelValue"]);
const newRule = ref("");
const ruleError = ref("");
const isAdding = ref(false);
const editingIndex = ref(-1);
const editingRule = ref("");
const showRulesGuide = ref(false);

const predefinedRules = [
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
  "يجب أن يكون لديك قوانين للبطولة",
]
const addRule = async () => {
  if (!newRule.value?.trim()) {
    ruleError.value = "الرجاء إدخال قانون";
    return;
  }

  isAdding.value = true;
  try {
    props.modelValue.Roles.push(newRule.value.trim());
    newRule.value = "";
    ruleError.value = "";
  } finally {
    isAdding.value = false;
  }
};

const startEdit = (index: number, rule: string) => {
  editingIndex.value = index;
  editingRule.value = rule;
};

const updateRule = (index: number) => {
  if (editingRule.value?.trim()) {
    props.modelValue.Roles[index] = editingRule.value.trim();
  }
  cancelEdit();
};

const cancelEdit = () => {
  editingIndex.value = -1;
  editingRule.value = "";
};

const deleteRule = (index: number) => {
  props.modelValue.Roles.splice(index, 1);
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
