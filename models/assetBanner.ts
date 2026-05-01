export interface IAssetBanner {
  id: string
  imageUrl: string
  linkUrl: string | null
  createdAt?: string
}

export interface IAssetBannersPayload {
  banners: IAssetBanner[]
  activeBannerId: string | null
}
