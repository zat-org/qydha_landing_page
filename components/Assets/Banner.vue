<template>
  <div class="flex flex-col gap-8 p-6 w-full max-w-5xl mx-auto">
    <AssetsBannerFormModal
      v-model:open="formOpen"
      :mode="formMode"
      :banner="formBanner"
    />

    <UCard>
      <template #header>
        <div class="flex flex-col gap-3 w-full">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">البنرات</h2>
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                label="إضافة بنر"
                color="primary"
                icon="i-heroicons-plus"
                @click="openCreate"
              />
              <UButton
                icon="i-heroicons-arrow-path"
                color="neutral"
                variant="soft"
                :loading="getBannersREQ.pending.value"
                @click="getBannersREQ.refresh()"
              />
            </div>
          </div>
          <div
            v-if="banners.length"
            class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-default px-3 py-2"
          >
            <UBadge
              :color="activeBannerId ? 'success' : 'neutral'"
              size="lg"
              :label="activeBannerId ? 'يُعرض بنر في التطبيق' : 'لا يُعرض أي بنر في التطبيق'"
            />
            <UButton
              v-if="activeBannerId"
              size="sm"
              color="neutral"
              variant="soft"
              label="إيقاف عرض البنر"
              icon="i-heroicons-eye-slash"
              :loading="setActiveREQ.pending.value"
              @click="onClearActive"
            />
          </div>
        </div>
      </template>

      <div v-if="getBannersREQ.error.value" class="text-red-600 dark:text-red-400 text-sm">
        تعذر تحميل البنرات. تأكد من أن واجهة الـ API متاحة.
      </div>

      <div v-else-if="getBannersREQ.pending.value && !banners.length" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500" />
      </div>

      <div v-else-if="!banners.length" class="text-center text-gray-500 dark:text-gray-400 py-10">
        لا توجد بنرات بعد. اضغط «إضافة بنر» للبدء.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard
          v-for="banner in banners"
          :key="banner.id"
          class="transition-shadow"
          :class="banner.id === activeBannerId ? 'ring-2 ring-primary-500' : ''"
        >
          <div class="flex flex-col gap-3">
            <div class="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <img
                :src="banner.imageUrl"
                :alt="`بنر ${banner.id}`"
                class="h-full w-full object-cover"
                loading="lazy"
              >
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                v-if="banner.id === activeBannerId"
                color="success"
                label="يُعرض في التطبيق"
              />
              <UBadge v-else color="neutral" label="غير نشط" />
            </div>
            <p v-if="banner.linkUrl" class="text-sm text-gray-600 dark:text-gray-300 truncate" dir="ltr">
              {{ banner.linkUrl }}
            </p>
            <p v-else class="text-sm text-gray-500 dark:text-gray-400">
              بدون رابط
            </p>
            <div class="flex flex-wrap gap-2">
              <UButton
                size="sm"
                color="warning"
                variant="soft"
                label="تعديل"
                icon="i-heroicons-pencil-square"
                @click="openEdit(banner)"
              />
              <UButton
                v-if="banner.id !== activeBannerId"
                size="sm"
                color="primary"
                variant="soft"
                label="تعيين كبنر ظاهر"
                :loading="setActiveREQ.pending.value"
                @click="onSetActive(banner.id)"
              />
              <UButton
                size="sm"
                color="error"
                variant="ghost"
                label="حذف"
                :loading="deleteBannerREQ.pending.value"
                @click="onDelete(banner.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { IAssetBanner } from "~/models/assetBanner"

const toast = useToast()
const assets = useAssets()
const getBannersREQ = await assets.getBanners()
const setActiveREQ = await assets.setActiveBanner()
const deleteBannerREQ = await assets.deleteBanner()

const payload = computed(() => getBannersREQ.data.value?.data)

const banners = computed<IAssetBanner[]>(() => payload.value?.banners ?? [])
const activeBannerId = computed(() => payload.value?.activeBannerId ?? null)

const formOpen = ref(false)
const formMode = ref<"create" | "edit">("create")
const formBanner = ref<IAssetBanner | null>(null)

const openCreate = () => {
  formMode.value = "create"
  formBanner.value = null
  formOpen.value = true
}

const openEdit = (banner: IAssetBanner) => {
  formMode.value = "edit"
  formBanner.value = { ...banner }
  formOpen.value = true
}

const onSetActive = async (bannerId: string) => {
  await setActiveREQ.fetchREQ(bannerId)
  if (setActiveREQ.status.value === "success") {
    toast.add({ title: "تم تعيين البنر الظاهر", color: "success" })
  } else if (setActiveREQ.error.value) {
    toast.add({ title: "تعذر التعيين", color: "error" })
  }
}

const onClearActive = async () => {
  await setActiveREQ.fetchREQ(null)
  if (setActiveREQ.status.value === "success") {
    toast.add({ title: "لن يُعرض أي بنر في التطبيق", color: "success" })
  } else if (setActiveREQ.error.value) {
    toast.add({ title: "تعذر التحديث", color: "error" })
  }
}

const onDelete = async (id: string) => {
  const ok = confirm("حذف هذا البنر نهائيًا؟")
  if (!ok) return
  await deleteBannerREQ.fetchREQ(id)
  if (deleteBannerREQ.status.value === "success") {
    toast.add({ title: "تم الحذف", color: "success" })
  } else if (deleteBannerREQ.error.value) {
    toast.add({ title: "تعذر الحذف", color: "error" })
  }
}
</script>
