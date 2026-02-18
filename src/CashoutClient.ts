import axios, { AxiosInstance } from 'axios'
import { Atm } from './models/cashout/Atm'
import { CashoutRequest } from './models/cashout/CashoutRequest'
import ResponseWrapper from './models/ResponseWrapper'
import { CreateCashoutResponse } from './models/cashout/CreateCashoutResponse'

export class CashoutClient {
    http: AxiosInstance

    constructor() {
        const baseURL = 'https://genmega.rampatm.net/wac'
        this.http = axios.create({
            baseURL,
            timeout: 30 * 1000,
            headers: {
                Accept: '*/*'
            },
            validateStatus: () => true
        })

        this.http.interceptors.response.use(
            (response) => {
                const result = response.data
                const errorMessage =
                    result?.error?.server_message || result?.error?.code
                if (errorMessage) {
                    return Promise.reject(new Error(errorMessage))
                }
                return response
            },
            (error) => {
                return Promise.reject(error)
            }
        )
    }

    setAuthToken(sessionKey: string) {
        this.http.defaults.headers.common['Authorization'] = sessionKey
    }

    guestLogin = async () => {
        const response =
            await this.http.post<ResponseWrapper<{ sessionKey: string }>>(
                '/wac/guest/login'
            )
        const sessionKey = await response.data.data.sessionKey
        this.http.defaults.headers.common['Authorization'] = sessionKey
        return sessionKey
    }

    getAtmList = async () => {
        const response =
            await this.http.get<ResponseWrapper<{ items: Atm[] }>>(
                '/wac/atm/list'
            )
        return response.data.data.items
    }

    sendVerificationWord = async (params: {
        firstName: string
        lastName: string
        phoneNumber: string
    }) => {
        const data = new URLSearchParams()
        data.append('first_name', params.firstName)
        data.append('last_name', params.lastName)
        data.append('phone_number', params.phoneNumber)
        data.append('word_code', '1')
        data.append('_t', new Date().getTime().toString())

        await this.http.post('/wac/pcode/verify', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    createCashoutRequest = async (params: {
        atmId: string
        amount: string
    }): Promise<CreateCashoutResponse> => {
        const data = new URLSearchParams()
        data.append('atm_id', params.atmId)
        data.append('amount', params.amount)
        data.append('_t', new Date().getTime().toString())

        const response = await this.http.post<
            ResponseWrapper<{
                items: [
                    {
                        secure_code: string
                        address: string
                        usd_amount: number
                        btc_amount: number
                        btc_whole_unit_price: number
                    }
                ]
            }>
        >('/wac/pcode', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const result = response.data.data.items[0]

        return {
            secureCode: result.secure_code,
            address: result.address,
            usdAmount: result.usd_amount,
            btcAmount: result.btc_amount,
            btcWholeUnitPrice: result.btc_whole_unit_price
        }
    }

    getCashOutRequest = async (cashCode: string): Promise<CashoutRequest> => {
        const response = await this.http.get<
            ResponseWrapper<{
                items: [
                    {
                        pcode: null
                        status: 'A' | string
                        address: string
                        usd_amount: number
                        btc_amount: number
                        btc_whole_unit_price: number
                        expiration: string
                        atm_id: number
                        loc_description: string
                        loc_lat: number
                        loc_lon: number
                    }
                ]
            }>
        >(`/wac/pcode/${cashCode}`)
        const result = response.data.data.items[0]

        return {
            id: cashCode,
            pcode: result.pcode,
            status: result.status as any,
            address: result.address,
            usdAmount: result.usd_amount,
            btcAmount: result.btc_amount,
            btcWholeUnitPrice: result.btc_whole_unit_price,
            expiration: result.expiration,
            atmId: result.atm_id,
            locDescription: result.loc_description,
            locLat: result.loc_lat,
            locLon: result.loc_lon
        }
    }
}
