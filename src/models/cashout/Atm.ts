export interface Atm {
    atm_id: number

    address_desc: string
    address_street: string
    address_detail: string | null
    address_city: string
    address_state: string
    address_zip: string

    loc_lon: string // longitude as string from API
    loc_lat: string // latitude as string from API

    atm_desc: string

    atm_min: string // monetary values returned as string
    atm_max: string
    atm_bills: string
    atm_currency: string

    atm_pur: boolean // purchase supported
    atm_red: boolean // redeem supported
}
