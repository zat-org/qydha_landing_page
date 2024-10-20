export interface IPurchase
{
    iapHubPurchaseId: string,
    type: string,
    purchaseDate: string|Date,
    productSku: string,
    numberOfDays: number
  }