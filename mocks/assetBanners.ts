import type { IAssetBannersPayload } from "~/models/assetBanner"

/** Seed list for local / staging UI when API banners are not wired yet */
export const initialMockAssetBanners: IAssetBannersPayload = {
  banners: [
    {
      id: "mock-1",
      imageUrl: "https://picsum.photos/seed/qydha-banner-1/840/360",
      linkUrl: "https://qydha.com",
    },
    {
      id: "mock-2",
      imageUrl: "https://picsum.photos/seed/qydha-banner-2/840/360",
      linkUrl: null,
    },
  ],
  activeBannerId: "mock-1",
}

export function useAssetBannersMockState() {
  return useState<IAssetBannersPayload>("asset-banners-mock", () => ({
    banners: initialMockAssetBanners.banners.map((b) => ({ ...b })),
    activeBannerId: initialMockAssetBanners.activeBannerId,
  }))
}
