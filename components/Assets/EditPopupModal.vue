<template>
  <UModal :ui="{ width: 'w-[800px] sm:max-w-[800px] ' }">
    <UCard :ui="{ base: 'flex flex-col', body: { base: 'grow ' } }">
      <UTabs :items="tabItems" @change="onChangeindex">
        <template #data>
          <UForm
            :state="state"
            :schema="schema"
            ref="poupForm"
            @submit="onSubmit"
            class="flex flex-col gap-2"
          >
            <UFormGroup label="الظهور في قيدها" name=" show ">
              <UToggle v-model="state.show"></UToggle>
            </UFormGroup>

            <UFormGroup label="النوع" name="actionType">
              <USelect
                v-model="state.actionType"
                :options="notificationActionsArray"
              />
            </UFormGroup>

            <UFormGroup
              label="التارجيت"
              name="actionPath"
              v-if="
                state.actionType != AssetPopUpActionType.PopUpWithNoAction &&
                state.actionType
              "
            >
              <UInput
                v-model="state.actionPath"
                v-if="state.actionType == AssetPopUpActionType.PopUpWithGoToURL"
              />
              <USelect
                v-model="state.actionPath"
                :options="
                  state.actionType == AssetPopUpActionType.PopUpWithGoToScreen
                    ? screenOptions
                    : tabOptions
                "
                v-if="
                  state.actionType ==
                    AssetPopUpActionType.PopUpWithGoToScreen ||
                  state.actionType == AssetPopUpActionType.PopUpWithGoToTab
                "
              />
            </UFormGroup>
          </UForm>
        </template>
        <template #image>
          <UForm
            :state="imageState"
            :schema="imageSchema"
            ref="imageForm"
            @submit="onSubmitImage"
          >
            <div class="flex justify-between items-center">
              <UFormGroup label="الصورة" name="image">
                <UInput
                  type="file"
                  @change="onChange"
                  accept=".jpg , .png , .jpeg "
                  v-model="imageState.image"
                >
                </UInput>
              </UFormGroup>

              <img
                v-if="imageUrl"
                :src="imageUrl"
                class="w-[200px] h-[200px]"
                alt="selected image for  new popup"
              />
            </div>
          </UForm>
        </template>
      </UTabs>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="عودة" color="red" @click="modal.close()" />
          <UButton label=" حفظ" @click="onSubmitFoms" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { string, object, boolean } from "yup";
import {
  AssetPopUpActionType,
  type IAssetPopUpUpdate,
} from "~/models/assetPopup";
const tabindex = ref(0);
const onChangeindex = (index: number) => {
  tabindex.value = index;
};
const tabItems = [
  { label: "البيانات", slot: "data" },
  { label: "الصورة", slot: "image" },
];
const poupForm = ref<HTMLFormElement>();
const toast = useToast();
const modal = useModal();

const updatePopUpREQ = await useAssets().updatePopupData();
const getPopUp = await useAssets().getPopup();
const popupData = computed(() => {
  return getPopUp.data.value?.data!;
});

const state = reactive<IAssetPopUpUpdate>({
  show: popupData.value?.show,
  actionPath: popupData.value?.actionPath,
  actionType: popupData.value?.actionType,
});
const schema = object({
  actionPath: string(),
  actionType: string().required(),
  show: boolean().required(),
});

// handel imageg input
const imageForm = ref<HTMLFormElement>();
const file = ref<File>();
const imageUrl = ref<string>();
const imageSchema = object({
  image: string(),
});
const imageState = reactive({
  image: "",
});
const onChange = (files: FileList) => {
  const _file = files.item(0);
  imageUrl.value = "";
  if (_file) {
    file.value = _file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(_file);
  }
};
const updateImageREQ = await useAssets().updatePopUpImage();
const onSubmitImage = async () => {
  await updateImageREQ.fetchREQ(file.value!);
  if (updateImageREQ.status.value == "success") {
    toast.add({ title: "image updated successfuly" });
  }
};

// screen name options
const screenOptions = [
  { label: "البلوت", value: "/baloot-game" },
  { label: "الهند", value: "/hand-game" },
  { label: "  الاعدادات الفرق", value: "/team-settings" },
  { label: "تعديل البرفيل", value: "/edit-profile" },
  { label: "الاعدادات", value: "/app-settings" },
  { label: "مسح المستخدم", value: "/delete-user" },
  { label: "تغيير كلمة المرور", value: "/change-password" },
  { label: "عنا", value: "/about-us" },
  { label: "قوانين الخصوصية", value: "/privacy-policy" },
];
// tab names options
const tabOptions = [
  { label: "الصفحة الشخصية", value: "profile" },
  { label: "المتجر", value: "store" },
  { label: "الاحصائيات", value: "statistics" },
  { label: "الكتاب", value: "books" },
  { label: " الرئيسية", value: "home" },
];

// handel notification action type data
const notificationActionsArray = Object.values(AssetPopUpActionType).map(
  (action) => {
    if (action == "NoAction") {
      return {
        value: action,
        label: "اشعار فقط",
      };
    } else if (action == "GoToURL") {
      return {
        value: action,
        label: "التوجه للينك معين",
      };
    } else if (action == "GoToScreen") {
      return {
        value: action,
        label: "التوجة لشاشة في التطبيق",
      };
    } else if (action == "GoToTab") {
      return {
        value: action,
        label: "التوجة لواجهة  في التطبيق",
      };
    }
  }
);

watch(
  () => state.actionType,
  (newValue, oldValue) => {
    if (newValue == AssetPopUpActionType.PopUpWithNoAction) {
      schema.fields.actionPath = string();
      state.actionPath = "_";
    } else if (newValue == AssetPopUpActionType.PopUpWithGoToURL) {
      schema.fields.actionPath = string().url().required();
    } else {
      schema.fields.actionPath = string().required();
    }
  },
  { immediate: true }
);

// handel sent req on form submit

const onSubmit = async () => {
  await updatePopUpREQ.fetchREQ(state);
  if (updatePopUpREQ.status.value == "success") {
    toast.add({ title: "update done" });
    modal.close();
  } else if (updatePopUpREQ.status.value == "error") {
    toast.add({ title: "update failed" });
  }
};

const onSubmitFoms = () => {
  if (tabindex.value == 0) {
    poupForm.value?.submit();
  } else if (tabindex.value == 1) {
    imageForm.value?.submit();
  }
};
</script>

<style></style>
