<template>
  <UModal
    v-model:open="isOpen"
    :title="mode === 'create' ? 'بنر جديد' : 'تعديل البنر'"
    :description="mode === 'create' ? 'أضف صورة ورابطًا اختياريًا' : 'حدّث الصورة أو الرابط'"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField :label="mode === 'create' ? 'صورة البنر' : 'صورة البنر (اختياري)'" name="file">
          <UInput
            :key="fileInputKey"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            class="w-full"
            @change="onFileChange"
          />
        </UFormField>
        <div
          v-if="displayPreviewUrl"
          class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48 w-fit"
        >
          <img :src="displayPreviewUrl" alt="معاينة البنر" class="max-h-48 object-contain">
        </div>
        <UFormField label="رابط عند الضغط (اختياري)" name="linkUrl">
          <UInput v-model="linkUrl" type="url" placeholder="https://..." dir="ltr" class="text-left" />
        </UFormField>
        <p class="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          اتركه فارغًا إذا لا يوجد انتقال لرابط.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-2 w-full">
        <UButton label="إلغاء" color="neutral" variant="soft" @click="close" />
        <UButton
          :label="mode === 'create' ? 'إضافة' : 'حفظ'"
          color="primary"
          :loading="saving"
          :disabled="mode === 'create' && !selectedFile"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { IAssetBanner } from "~/models/assetBanner"

const props = withDefaults(
  defineProps<{
    mode: "create" | "edit"
    banner?: IAssetBanner | null
  }>(),
  { banner: null },
)

const isOpen = defineModel<boolean>("open", { default: false })

const toast = useToast()
const assets = useAssets()
const createBannerREQ = await assets.createBanner()
const updateBannerREQ = await assets.updateBanner()

const linkUrl = ref("")
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const fileInputKey = ref(0)

const displayPreviewUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (props.mode === "edit" && props.banner && !selectedFile.value) {
    return props.banner.imageUrl
  }
  return null
})

const saving = computed(
  () => createBannerREQ.pending.value || updateBannerREQ.pending.value,
)

watch(isOpen, (open) => {
  if (!open) {
    resetForm()
    return
  }
  linkUrl.value =
    props.mode === "edit" && props.banner ? (props.banner.linkUrl ?? "") : ""
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  fileInputKey.value += 1
})

function resetForm() {
  linkUrl.value = ""
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  selectedFile.value = file
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function close() {
  isOpen.value = false
}

const normalizedLink = () => {
  const t = linkUrl.value.trim()
  return t === "" ? null : t
}

const submit = async () => {
  const url = normalizedLink()
  if (props.mode === "create") {
    if (!selectedFile.value) {
      toast.add({ title: "اختر ملف صورة", color: "warning" })
      return
    }
    await createBannerREQ.fetchREQ(selectedFile.value, url)
    if (createBannerREQ.status.value === "success") {
      toast.add({ title: "تم إضافة البنر", color: "success" })
      close()
    } else if (createBannerREQ.error.value) {
      toast.add({ title: "فشل رفع البنر", color: "error" })
    }
    return
  }
  if (!props.banner) return
  await updateBannerREQ.fetchREQ(
    props.banner.id,
    selectedFile.value ?? undefined,
    url,
  )
  if (updateBannerREQ.status.value === "success") {
    toast.add({ title: "تم حفظ التعديلات", color: "success" })
    close()
  } else if (updateBannerREQ.error.value) {
    toast.add({ title: "تعذر حفظ التعديلات", color: "error" })
  }
}
</script>
