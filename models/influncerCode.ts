
export interface InfluncerCode {
    id: string
    code: string
    createdAt: string | Date,
    usedAt: string | Date,
    expireAt: string | Date,
    numberOfDays: number,
    categoryName: string
    categoryId: number
    categoryMaxCodesPerUserInGroup: number
    usedCount: number
    maxInfluencedUsersCount: number
}




export interface InfluncerCodeCreate {
    code: string,
    categoryId: number,
    numberOfDays: number,
    expireAt: string | Date,
    maxInfluencedUsersCount: number
}
export interface ICategory {
    id: string
    maxCodesPerUserInGroup: number
    categoryName: string
}
export interface CategoryCreate {
    categoryName: string,
    maxCodesPerUserInGroup: number
}