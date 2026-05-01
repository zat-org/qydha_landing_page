// import { extendNuxtSchema } from "nuxt/kit";
import type { IAssetPopUp, IAssetPopUpUpdate } from "~/models/assetPopup";
import type { IAssetBannersPayload } from "~/models/assetBanner";
import { useAssetBannersMockState } from "~/mocks/assetBanners";
// import type { popUpActionType } from "~/models/notification";

export const useAssets = () => {
  const { $api } = useNuxtApp();
  const mockBanners = () => Boolean(useRuntimeConfig().public.mockAssetBanners);
  const getBook = async () => {
    const { data, pending, error, refresh } = await useAsyncData<{ data: { url: string, lastUpdateAt: string }, message: string }>(
      'getBook',
      () => $api('/assets/baloot-book')
    );
    return { data, pending, error, refresh }
  }
  const updateBook = async () => {
    const body = ref<FormData>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateBook',
      () => $api('/assets/baloot-book', { method: "put", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (file: File) => {
      body.value = new FormData()
      body.value.append('file', file)
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }


  const getPopup = async () => {
    const { data, pending, error, refresh } = await useAsyncData
      <{
        data: IAssetPopUp,
        messsage: string
      }>
      (
        'getPopup',
        () => $api('/assets/popup')
      );
    return { data, pending, error, refresh }
  }

  const updatePopupData = async () => {
    const body = ref<IAssetPopUpUpdate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updatePopupData',
      () => $api('/assets/popup', { method: 'put',body:body.value }), { immediate: false }
    );
    const fetchREQ = async(_new_popup:IAssetPopUpUpdate) => {
      body.value=_new_popup
      await execute()
      if (status.value=='success'){
        refreshNuxtData('getPopup')
      }
    }


    return {data, pending, error, refresh, status,fetchREQ}

  }
  const updatePopUpImage =async()=>{
    const body =ref<FormData>(new FormData())
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
        '',
        () => $api('/assets/popup/image',{method:'put',body:body.value}),{immediate:false}
    );
    const fetchREQ =async(_image:File)=>{
      body.value =new FormData()
      body.value.append('file',_image)

      await execute()
      if (status.value=='success'){
        refreshNuxtData('getPopup')
      }
    }
    return { data, pending, error, refresh ,status,fetchREQ}
  }

  const getBanners = async () => {
    if (mockBanners()) {
      const { data, pending, error, refresh } = await useAsyncData<{
        data: IAssetBannersPayload
        message: string
      }>("getBanners", () => {
        const s = useAssetBannersMockState()
        return Promise.resolve({
          data: {
            banners: s.value.banners.map((b) => ({ ...b })),
            activeBannerId: s.value.activeBannerId,
          },
          message: "mock",
        })
      })
      return { data, pending, error, refresh }
    }
    const { data, pending, error, refresh } = await useAsyncData<{
      data: IAssetBannersPayload
      message: string
    }>("getBanners", () => $api("/assets/banners"))
    return { data, pending, error, refresh }
  }

  const createBanner = async () => {
    if (mockBanners()) {
      const data = ref(null)
      const pending = ref(false)
      const error = ref<Error | null>(null)
      const status = ref<"idle" | "pending" | "success" | "error">("idle")
      const refresh = async () => {
        await refreshNuxtData("getBanners")
      }
      const fetchREQ = async (file: File, linkUrl: string | null) => {
        pending.value = true
        error.value = null
        status.value = "pending"
        try {
          const imageUrl = URL.createObjectURL(file)
          const s = useAssetBannersMockState()
          const id = `mock-${Date.now()}`
          s.value = {
            banners: [...s.value.banners, { id, imageUrl, linkUrl }],
            activeBannerId: s.value.activeBannerId,
          }
          status.value = "success"
          await refreshNuxtData("getBanners")
        } catch (e) {
          status.value = "error"
          error.value = e instanceof Error ? e : new Error(String(e))
        } finally {
          pending.value = false
        }
      }
      return { data, pending, error, refresh, status, fetchREQ }
    }
    const body = ref<FormData>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      "createBanner",
      () => $api("/assets/banners", { method: "post", body: body.value }),
      { immediate: false }
    )
    const fetchREQ = async (file: File, linkUrl: string | null) => {
      const fd = new FormData()
      fd.append("file", file)
      if (linkUrl != null && linkUrl.trim() !== "") {
        fd.append("linkUrl", linkUrl.trim())
      }
      body.value = fd
      await execute()
      if (status.value === "success") {
        refreshNuxtData("getBanners")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const updateBanner = async () => {
    if (mockBanners()) {
      const data = ref(null)
      const pending = ref(false)
      const error = ref<Error | null>(null)
      const status = ref<"idle" | "pending" | "success" | "error">("idle")
      const refresh = async () => {
        await refreshNuxtData("getBanners")
      }
      const fetchREQ = async (
        bannerId: string,
        file: File | undefined,
        linkUrl: string | null,
      ) => {
        pending.value = true
        error.value = null
        status.value = "pending"
        try {
          const s = useAssetBannersMockState()
          const idx = s.value.banners.findIndex((b) => b.id === bannerId)
          if (idx === -1) {
            status.value = "error"
            error.value = new Error("Banner not found")
            return
          }
          const cur = s.value.banners[idx]
          let imageUrl = cur.imageUrl
          if (file) {
            if (cur.imageUrl.startsWith("blob:")) {
              try {
                URL.revokeObjectURL(cur.imageUrl)
              } catch {
                /* ignore */
              }
            }
            imageUrl = URL.createObjectURL(file)
          }
          const nextBanners = [...s.value.banners]
          nextBanners[idx] = { ...cur, imageUrl, linkUrl }
          s.value = { ...s.value, banners: nextBanners }
          status.value = "success"
          await refreshNuxtData("getBanners")
        } catch (e) {
          status.value = "error"
          error.value = e instanceof Error ? e : new Error(String(e))
        } finally {
          pending.value = false
        }
      }
      return { data, pending, error, refresh, status, fetchREQ }
    }
    const bannerId = ref("")
    const body = ref<FormData>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      "updateBanner",
      () => $api(`/assets/banners/${bannerId.value}`, { method: "put", body: body.value }),
      { immediate: false },
    )
    const fetchREQ = async (
      id: string,
      file: File | undefined,
      linkUrl: string | null,
    ) => {
      bannerId.value = id
      const fd = new FormData()
      if (file) {
        fd.append("file", file)
      }
      fd.append("linkUrl", linkUrl ?? "")
      body.value = fd
      await execute()
      if (status.value === "success") {
        refreshNuxtData("getBanners")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const setActiveBanner = async () => {
    if (mockBanners()) {
      const data = ref(null)
      const pending = ref(false)
      const error = ref<Error | null>(null)
      const status = ref<"idle" | "pending" | "success" | "error">("idle")
      const refresh = async () => {
        await refreshNuxtData("getBanners")
      }
      const fetchREQ = async (bannerId: string | null) => {
        pending.value = true
        error.value = null
        status.value = "pending"
        try {
          const s = useAssetBannersMockState()
          if (bannerId !== null && !s.value.banners.some((b) => b.id === bannerId)) {
            status.value = "error"
            error.value = new Error("Banner not found")
            return
          }
          s.value = { ...s.value, activeBannerId: bannerId }
          status.value = "success"
          await refreshNuxtData("getBanners")
        } catch (e) {
          status.value = "error"
          error.value = e instanceof Error ? e : new Error(String(e))
        } finally {
          pending.value = false
        }
      }
      return { data, pending, error, refresh, status, fetchREQ }
    }
    const body = ref<{ bannerId: string | null }>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      "setActiveBanner",
      () => $api("/assets/banners/active", { method: "put", body: body.value }),
      { immediate: false }
    )
    const fetchREQ = async (bannerId: string | null) => {
      body.value = { bannerId }
      await execute()
      if (status.value === "success") {
        refreshNuxtData("getBanners")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const deleteBanner = async () => {
    if (mockBanners()) {
      const data = ref(null)
      const pending = ref(false)
      const error = ref<Error | null>(null)
      const status = ref<"idle" | "pending" | "success" | "error">("idle")
      const refresh = async () => {
        await refreshNuxtData("getBanners")
      }
      const fetchREQ = async (id: string) => {
        pending.value = true
        error.value = null
        status.value = "pending"
        try {
          const s = useAssetBannersMockState()
          const removed = s.value.banners.find((b) => b.id === id)
          const nextBanners = s.value.banners.filter((b) => b.id !== id)
          let nextActive = s.value.activeBannerId
          if (nextActive === id) {
            nextActive = null
          }
          if (removed?.imageUrl.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(removed.imageUrl)
            } catch {
              /* ignore */
            }
          }
          s.value = { banners: nextBanners, activeBannerId: nextActive }
          status.value = "success"
          await refreshNuxtData("getBanners")
        } catch (e) {
          status.value = "error"
          error.value = e instanceof Error ? e : new Error(String(e))
        } finally {
          pending.value = false
        }
      }
      return { data, pending, error, refresh, status, fetchREQ }
    }
    const bannerId = ref("")
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      "deleteBanner",
      () => $api(`/assets/banners/${bannerId.value}`, { method: "delete" }),
      { immediate: false }
    )
    const fetchREQ = async (id: string) => {
      bannerId.value = id
      await execute()
      if (status.value === "success") {
        refreshNuxtData("getBanners")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  return {
    getBook,
    updateBook,
    getPopup,
    updatePopupData,
    updatePopUpImage,
    getBanners,
    createBanner,
    updateBanner,
    setActiveBanner,
    deleteBanner,
  }
}
