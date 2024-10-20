
export interface InfluncerCode {
    influencerCodeId: string,
    createdAt: string | Date,
    usedAt: string | Date,
    expireAt: string | Date,
    numberOfDays: number,
    influencerCodeName: string,
    category: ICategory
}

export interface InfluncerCodeCreate {
    code: string,
    categoryId: number,
    numberOfDays: number,
    expireAt: string | Date,
    maxInfluencedUsersCount: number
}
export interface ICategory {
    maxCodesPerUserInGroup: number
    categoryName: string
}
export interface CategoryCreate {
    categoryName: string,
    maxCodesPerUserInGroup: number
}