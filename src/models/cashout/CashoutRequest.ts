import { CashoutStatus } from './CashoutStatus'

export interface CashoutRequest {
    id: string
    pcode: string | null
    status: CashoutStatus
    address: string
    usdAmount: number
    btcAmount: number
    btcWholeUnitPrice: number
    expiration: string
    atmId: number
    locDescription: string
    locLat: number
    locLon: number
}
