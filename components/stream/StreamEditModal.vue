<template>
  <UModal>
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">تعديل إعدادات الطاولة</h3>
      </template>

      <UForm
        ref="updateForm"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormGroup label="المسافة العلوية للنتيجة" name="scoreMarginTop">
          <UInput
            v-model.number="state.scoreMarginTop"
            type="number"
            placeholder="مثال: 20"
          />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Left Player -->

          <!-- Right Player -->
          <UFormGroup
            label="اللاعب الأيمن"
            name="RightPlayer"
            class="space-y-2"
          >
            <UInput
              type="number"
              v-model.number="state.RightPlayer"
              placeholder="المسافة من اليمين"
            />
          </UFormGroup>

          <UFormGroup label="اللاعب الأيسر" name="LeftPlayer" class="space-y-2">
            <UInput
              type="number"
              v-model.number="state.LeftPlayer"
              placeholder="المسافة من اليسار"
            />
          </UFormGroup>
        </div>

        <!-- Bottom Player -->
        <UFormGroup label="اللاعب السفلي" name="BottomPlayer" class="space-y-2">
          <UInput
            v-model.number="state.BottomPlayer"
            type="number"
            placeholder="المسافة من الأسفل"
          />
        </UFormGroup>

        <UFormGroup label="عرض صورة اللاعب" name="PlayerImageWidth">
          <UInput
            v-model.number="state.PlayerImageWidth"
            type="number"
            placeholder="عرض الصورة بالبكسل"
          />
        </UFormGroup>
        <UFormGroup label="لون خاص بالنشرة التفصيلية" name="DetailScoreColor">
          <UInput
            class="w-[50px]"
            v-model="state.DetailScoreColor"
            type="color"
            placeholder="عرض الصورة بالبكسل"
          />
        </UFormGroup>
        {{ color }}
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton @click="closeModal()" color="red"> غلق </UButton>
          <UButton @click="resetBoard()">اعادة الضبط </UButton>

          <UButton @click="updateBoard()">حفظ </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, number } from "yup";
import { useMyAuthStore } from "~/store/Auth";
const color = ref();
const updateForm = ref<HTMLFormElement>();
const authstore = useMyAuthStore();
const boardID = computed(() => {
  if (authstore.user)
    return authstore.user.boardLink.split("/")[
      authstore.user.boardLink.split("/").length - 1
    ];
});
const schema = object({
  scoreMarginTop: number().required("المسافة العلوية للنتيجة مطلوبة"),
  LeftPlayer: string().required("المسافة من اليسار مطلوبة"),
  RightPlayer: string().required("المسافة من اليمين مطلوبة"),
  BottomPlayer: string().required("المسافة من الأسفل مطلوبة"),
  PlayerImageWidth: number()
    .required("عرض صورة اللاعب مطلوب")
    .min(1, "يجب أن يكون العرض أكبر من 0"),
  DetailScoreColor: string(),
});

let data = await useBoardFB().getOrCreateTable(boardID.value!);

const state = ref({
  scoreMarginTop: Number.parseInt(data.scoreMarginTop.replace("px", "")),
  LeftPlayer: Number.parseInt(data.LeftPlayer.left.replace("px", "")),
  RightPlayer: Number.parseInt(data.RightPlayer.right.replace("px", "")),
  BottomPlayer: Number.parseInt(data.BottomPlayer.bottom.replace("px", "")),
  PlayerImageWidth: data.PlayerImageWidth,
  DetailScoreColor:data.DetailScoreColor,
});

const updateBoard = () => {
  updateForm.value?.submit();
};
const closeModal = () => {
  useModal().close();
};
const onSubmit = async (event: any) => {
  try {
    await useBoardFB().updateTable(boardID.value!, state.value);
    useToast().add({ title: "update Done" });
  } catch (error: any) {
    console.log(error.message);
    useToast().add({ title: "update error", color: "red" });
  }
};

const resetBoard = async () => {
  const defaultValues = {
    scoreMarginTop: 0,
    LeftPlayer: 0,
    RightPlayer: 0,
    BottomPlayer: 0,
    PlayerImageWidth: 60,
    DetailScoreColor:"#000000"
  };
  try {
    await useBoardFB().updateTable(boardID.value!, defaultValues);
    state.value = defaultValues;
    useToast().add({ title: "update Done" });
  } catch (error: any) {
    console.log(error.message);
    useToast().add({ title: "update error", color: "red" });
  }
};
</script>

<style scoped>
.u-form {
  @apply max-w-2xl mx-auto;
}
</style>
