export interface IPromoCode {
    id: string,
    numberOfDays: number,
    code: string,
    expireAt: string|Date
    createdAt: string |Date,
    usedAt: string |Date|null
    user: {
        avatarUrl: null|string
        id: string
        name: null|string
        phone: string
        username: string
    }
}
export interface IPromoCodeCreate{
    
        code: string,
        userId: string,
        numberOfDays: number,
        expireAt: Date|string
    
}