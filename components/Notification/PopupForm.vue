<template>
  <UForm
    :state="formState"
    :schema="schema"
    ref="notificationForm"
    @submit="onSubmit"
    class="flex flex-col gap-2"
  >
    <UButtonGroup class="mx-auto">
      <UButton
        :color="target == 'All' ? 'primary' : 'neutral'"
        @click="target = 'All'"
        label="الكل"
      />
      <UButton
        :color="target == 'Anonymos' ? 'primary' : 'neutral'"
        @click="target = 'Anonymos'"
        label="غير مسجلين"
      />
      <UButton
        :color="target == 'User' ? 'primary' : 'neutral'"
        @click="target = 'User'"
        label="مستخدم"
      />
    </UButtonGroup>
    <UFormField label="المستخدم" name="user" v-if="target == 'User'">
      <UInputMenu
        v-model="formState.user"
        v-model:search-term="search_user"
        :loading="usergetREQ.status.value == 'pending'"
        :items="users"
        
        option-key="username"
        value-key="id"
      />
    </UFormField>
    <UFormField label="العنوان" name="title">
      <UInput v-model="formState.title" />
    </UFormField>
    <UFormField label="الوصف" name="description">
      <UInput v-model="formState.description" />
    </UFormField>
    <UFormField label="النوع" name="actionType">
      <USelect v-model="formState.actionType" :items="notificationActionsArray" class="w-full"  />
    </UFormField>
    <UFormField
      label="الهدف"
      name="actionPath"
      v-if="formState.actionType != popUpActionType.PopUpWithNoAction"
    >
      <UInput
        v-model="formState.actionPath"
        v-if="formState.actionType == popUpActionType.PopUpWithGoToURL"
      />
      <USelect
        class="w-full"
        v-model="formState.actionPath"
        :items="
          formState.actionType == popUpActionType.PopUpWithGoToScreen
            ? screenOptions
            : tabOptions
        "
        v-if="
          formState.actionType == popUpActionType.PopUpWithGoToScreen ||
          formState.actionType == popUpActionType.PopUpWithGoToTab
        "
      />
    </UFormField>
    <div class="flex justify-between items-center">
      <UFormField label="الصورة المرفقة" name="popUpImage">
        <UInput @change="filechange" type="file" />
      </UFormField>
      <img :src="imageUrl" class="w-[100px] h-[100]" />
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { string, object } from "yup";
import { refDebounced } from '@vueuse/core'
import {
  popUpActionType,
  type INotificationPopupCreate,
} from "~/models/notification";
const notificationForm = ref<HTMLFormElement>();
const toast = useToast();
const emit = defineEmits(['close'])
const imageUrl = ref("");
const search_user = ref("")
const search_userDebounced = refDebounced(search_user, 500)
const AddNotificatoion = () => {
  notificationForm.value?.submit();
};

defineExpose({ AddNotificatoion });
const usergetREQ = await useUsers().getAllUsers();
await usergetREQ.fetchREQ("");
const users = computed(() => {
  return usergetREQ.data.value?.data.items.map((ele) => ({ ...ele, label: ele.username, value: ele.id }));
});

const target = ref<"All" | "User" | "Anonymos">("All");
watch(target, (newValue, oldValue) => {
  schema.fields.user = string();
  if (newValue == "User") {
    schema.fields.user = string().required();
  }
});
// Watch for changes in the debounced search term and trigger search
watch(search_userDebounced, async (newSearchTerm) => {
    await search(newSearchTerm);
});

const search = async (q: string) => {
  await usergetREQ.fetchREQ(q);
  return users.value!;
};

const formState = reactive({
  title: "",
  description: "",
  actionPath: "_",
  actionType: popUpActionType.PopUpWithNoAction,
  popUpImage: null as string | null,
  user: "",
});

const state = reactive<INotificationPopupCreate>({
  title: "",
  description: "",
  actionPath: "_",
  actionType: popUpActionType.PopUpWithNoAction,
  popUpImage: null,
  user: "",
});
const schema = object({
  title: string().required(),
  description: string(),
  actionPath: string(),
  actionType: string().required(),
  popUpImage: string().nullable(),
  user: string(),
});
// screen name options
const screenOptions = [
  { label: "البلوت", value: "/baloot-game" },
  { label: "الهند", value: "/hand-game" },
  { label: "المكتبة", value: "/library" },
  { label: "كتاب البلوت", value: "/baloot-book" },
  { label: "المحادثات المباشرة", value: "/live-chat" },
  { label: " الاشعارات", value: "/notifications" },
  { label: " الاشعارات", value: "/notifications" },
  { label: "اشيف الالعاب", value: "/games-archive" },
  { label: "تعديل المستخدم ", value: "/edit-profile" },
  { label: "الاعدادات", value: "/app-settings" },
  { label: "اعدادات المستخدم", value: "/user-settings" },
  { label: "  الاعدادات اللاعبين", value: "/players-settings" },
  { label: "مسح المستخدم", value: "/delete-user" },
  { label: "تغيير كلمة المرور", value: "/change-password" },
  { label: "نسي  كلمة المرور", value: "/forget-password" },
  { label: "تعيين كلمة المرور جديدة ", value: "/set-new-password" },
  { label: "عنا", value: "/about-us" },
  { label: "قوانين الخصوصية", value: "/privacy-policy" },
  { label: "الشروط والاحكام", value: "/terms" },
  { label: "البطولات", value: "/tournaments-tab" },
  { label: " طلبات الانضمام للبطولات  ", value: "/tournament-user-requests" },
  { label: " دعوات الانضمام للبطولات  ", value: "/tournament-invitations" },
];
// tab names options
const tabOptions = [
  { label: "الصفحة الشخصية", value: "profile" },
  { label: "المتجر", value: "store" },
  { label: "الاحصائيات", value: "statistics" },
  { label: "الكتاب", value: "books" },
  { label: " الرئيسية", value: "home" },
];
// handel file input
const filechange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    console.log(files);
    imageUrl.value = "";
    const file = files[0];
    state.popUpImage = file;
    formState.popUpImage = file.name; // Store filename for form validation
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string; // Get the image URL
    };
    reader.readAsDataURL(file);
  }
};
// handel notification action type data
const notificationActionsArray: { value: popUpActionType; label: string }[] = [
  {
    value: popUpActionType.PopUpWithNoAction,
    label: "اشعار فقط",
  },
  {
    value: popUpActionType.PopUpWithGoToURL,
    label: "التوجه للينك معين",
  },
  {
    value: popUpActionType.PopUpWithGoToScreen,
    label: "التوجة لشاشة في التطبيق",
  },
  {
    value: popUpActionType.PopUpWithGoToTab,
    label: "التوجة لواجهة  في التطبيق",
  },
];

watch(
  () => formState.actionType,
  (newValue, oldValue) => {
    formState.actionPath = "";
    state.actionPath = "";
    if (newValue == popUpActionType.PopUpWithNoAction) {
      schema.fields.actionPath = string();
      formState.actionPath = "_";
      state.actionPath = "_";
    } else if (newValue == popUpActionType.PopUpWithGoToURL) {
      schema.fields.actionPath = string().url().required();
    } else {
      schema.fields.actionPath = string().required();
    }
  },
  { immediate: true }
);

// handel sent req on form submit
const onSubmit = async () => {
  // Sync formState with state
  state.title = formState.title;
  state.description = formState.description;
  state.actionPath = formState.actionPath;
  state.actionType = formState.actionType;
  state.user = formState.user;
  
  console.log(state);
  await addREQ.fetchREQ(state, target.value, state.user);
  if (addREQ.status.value == "success")
    toast.add({ title: "add new notification doen " });
  emit("close");
};

const addREQ = await useNotification().sendNotificationToAllUsers();
</script>

<style></style>
