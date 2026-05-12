export interface MerchantLimit {
    merchantId: number
    merchant: string
    allowed: boolean
    perDayLimit: number
    perTransactionLimit: number
}
