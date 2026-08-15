import type { IAssetPopUp, IAssetPopUpUpdate } from "~/models/assetPopup";
import type { IAssetBannersPayload } from "~/models/assetBanner";
import { useAssetBannersMockState } from "~/mocks/assetBanners";

export const useAssets = () => {
  const { $api } = useNuxtApp();
  const mockBanners = () => Boolean(useRuntimeConfig().public.mockAssetBanners);

  const getBook = () =>
    useAppApiData<{ url: string; lastUpdateAt: string }>(appKeys.book, () =>
      $api("/assets/baloot-book"),
    );

  const updateBook = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (file: File) => {
      await execute(async () => {
        const body = new FormData();
        body.append("file", file);
        await $api("/assets/baloot-book", { method: "put", body });
        await refreshAppData(appKeys.book);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getPopup = () =>
    useAppApiData<IAssetPopUp>(appKeys.popup, () => $api("/assets/popup"));

  const updatePopupData = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_new_popup: IAssetPopUpUpdate) => {
      await execute(async () => {
        await $api("/assets/popup", { method: "put", body: _new_popup });
        await refreshAppData(appKeys.popup);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updatePopUpImage = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_image: File) => {
      await execute(async () => {
        const body = new FormData();
        body.append("file", _image);
        await $api("/assets/popup/image", { method: "put", body });
        await refreshAppData(appKeys.popup);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getBanners = () => {
    if (mockBanners()) {
      return useAppApiData<IAssetBannersPayload>(appKeys.banners, () => {
        const s = useAssetBannersMockState();
        return Promise.resolve({
          data: {
            banners: s.value.banners.map((b) => ({ ...b })),
            activeBannerId: s.value.activeBannerId,
          },
          message: "mock",
        });
      });
    }
    return useAppApiData<IAssetBannersPayload>(appKeys.banners, () =>
      $api("/assets/banners"),
    );
  };

  const createBanner = () => {
    if (mockBanners()) {
      const { pending, status, error, execute } = useMutationRequest();
      const fetchREQ = async (file: File, linkUrl: string | null) => {
        await execute(async () => {
          const imageUrl = URL.createObjectURL(file);
          const s = useAssetBannersMockState();
          const id = `mock-${Date.now()}`;
          s.value = {
            banners: [...s.value.banners, { id, imageUrl, linkUrl }],
            activeBannerId: s.value.activeBannerId,
          };
          await refreshAppData(appKeys.banners);
        });
      };
      return { pending, status, error, fetchREQ };
    }

    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (file: File, linkUrl: string | null) => {
      await execute(async () => {
        const fd = new FormData();
        fd.append("file", file);
        if (linkUrl != null && linkUrl.trim() !== "") {
          fd.append("linkUrl", linkUrl.trim());
        }
        await $api("/assets/banners", { method: "post", body: fd });
        await refreshAppData(appKeys.banners);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const updateBanner = () => {
    if (mockBanners()) {
      const { pending, status, error, execute } = useMutationRequest();
      const fetchREQ = async (
        bannerId: string,
        file: File | undefined,
        linkUrl: string | null,
      ) => {
        await execute(async () => {
          const s = useAssetBannersMockState();
          const idx = s.value.banners.findIndex((b) => b.id === bannerId);
          if (idx === -1) {
            throw new Error("Banner not found");
          }
          const cur = s.value.banners[idx]!;
          let imageUrl = cur.imageUrl;
          if (file) {
            if (cur.imageUrl.startsWith("blob:")) {
              try {
                URL.revokeObjectURL(cur.imageUrl);
              } catch {
                /* ignore */
              }
            }
            imageUrl = URL.createObjectURL(file);
          }
          const nextBanners = [...s.value.banners];
          nextBanners[idx] = { ...cur, imageUrl, linkUrl };
          s.value = { ...s.value, banners: nextBanners };
          await refreshAppData(appKeys.banners);
        });
      };
      return { pending, status, error, fetchREQ };
    }

    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (
      id: string,
      file: File | undefined,
      linkUrl: string | null,
    ) => {
      await execute(async () => {
        const fd = new FormData();
        if (file) {
          fd.append("file", file);
        }
        fd.append("linkUrl", linkUrl ?? "");
        await $api(`/assets/banners/${id}`, { method: "put", body: fd });
        await refreshAppData(appKeys.banners);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const setActiveBanner = () => {
    if (mockBanners()) {
      const { pending, status, error, execute } = useMutationRequest();
      const fetchREQ = async (bannerId: string | null) => {
        await execute(async () => {
          const s = useAssetBannersMockState();
          if (
            bannerId !== null &&
            !s.value.banners.some((b) => b.id === bannerId)
          ) {
            throw new Error("Banner not found");
          }
          s.value = { ...s.value, activeBannerId: bannerId };
          await refreshAppData(appKeys.banners);
        });
      };
      return { pending, status, error, fetchREQ };
    }

    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (bannerId: string | null) => {
      await execute(async () => {
        await $api("/assets/banners/active", {
          method: "put",
          body: { bannerId },
        });
        await refreshAppData(appKeys.banners);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const deleteBanner = () => {
    if (mockBanners()) {
      const { pending, status, error, execute } = useMutationRequest();
      const fetchREQ = async (id: string) => {
        await execute(async () => {
          const s = useAssetBannersMockState();
          const removed = s.value.banners.find((b) => b.id === id);
          const nextBanners = s.value.banners.filter((b) => b.id !== id);
          let nextActive = s.value.activeBannerId;
          if (nextActive === id) {
            nextActive = null;
          }
          if (removed?.imageUrl.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(removed.imageUrl);
            } catch {
              /* ignore */
            }
          }
          s.value = { banners: nextBanners, activeBannerId: nextActive };
          await refreshAppData(appKeys.banners);
        });
      };
      return { pending, status, error, fetchREQ };
    }

    const { pending, status, error, execute } = useMutationRequest();
    const fetchREQ = async (id: string) => {
      await execute(async () => {
        await $api(`/assets/banners/${id}`, { method: "delete" });
        await refreshAppData(appKeys.banners);
      });
    };
    return { pending, status, error, fetchREQ };
  };

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
  };
};
