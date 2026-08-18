<template>
  <UModal title="إضافة لاعب" prevent-close description="أضف لاعباً إلى قائمتك">
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="formRef"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="اسم اللاعب" name="name" required>
          <UInput v-model="state.name" placeholder="اسم اللاعب" />
        </UFormField>
        <UFormField label="الصورة" name="image">
          <input
            type="file"
            accept=".png,.jpg,.jpeg,image/*"
            class="block w-full text-sm"
            @change="onImageChange"
          />
        </UFormField>
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="معاينة"
          class="h-24 w-24 rounded-full object-cover"
        />
        <UAlert
          v-if="AddREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="AddREQ.error.value?.message || 'حدث خطأ أثناء إضافة اللاعب'"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton
          label="إضافة"
          color="primary"
          icon="i-heroicons-plus-circle"
          :loading="AddREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="AddREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import { useUserPlayersApi } from "../composables/useUserPlayersApi";

const props = defineProps<{
  existingNames: string[];
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();
const previewUrl = ref("");
const imageFile = ref<File | null>(null);

const state = reactive({ name: "" });

const schema = computed(() =>
  object({
    name: string()
      .trim()
      .required("برجاء إدخال اسم اللاعب")
      .max(50, "الاسم يجب ألا يتجاوز 50 حرفاً")
      .test(
        "unique-name",
        "يوجد لاعب بهذا الاسم",
        (value) => {
          if (!value) return true;
          const normalized = value.trim().toLowerCase();
          return !props.existingNames.some(
            (n) => n.trim().toLowerCase() === normalized,
          );
        },
      ),
  }),
);

const AddREQ = useUserPlayersApi().addPlayer();

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.item(0) ?? null;
  imageFile.value = file;
  previewUrl.value = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const onSubmit = async () => {
  await AddREQ.fetchREQ(state.name.trim(), imageFile.value);
  if (AddREQ.status.value === "success") {
    toast.add({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة اللاعب "${state.name.trim()}"`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (AddREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الإضافة",
      description:
        AddREQ.error.value?.message || "حدث خطأ أثناء إضافة اللاعب",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
