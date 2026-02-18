import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { getBundleId, getDeviceId, getUserAgent } from './device-info'
import { BalanceResponse } from './models/Balance'
import { Atm } from './models/cashout/Atm'
import { CashoutRequest } from './models/cashout/CashoutRequest'
import { CreateCashoutResponse } from './models/cashout/CreateCashoutResponse'
import { FeatureFlags } from './models/FeatureFlags'
import {
    ICreditCardMultisigWallet,
    IGeneralMultisigWallet
} from './models/IMultisigWallet'
import { ITokenInfo } from './models/ITokenInfo'
import { ITransaction } from './models/ITransaction'
import { IUser } from './models/IUser'
import ResponseWrapper from './models/ResponseWrapper'
import { CashoutLimits } from './models/cashout/CashoutLimits'

type AuthTokenProvider = () => Promise<string | null>

type Response<T> = {
    result: 'ok' | 'error'
    error: {
        code: string
        server_message: string
    } | null
    data: T
}

export class MerapiClient {
    http: AxiosInstance

    private deviceId?: string
    private userAgent?: string
    private bundleId?: string

    afterRequestCallback?: (
        responseBody: any,
        response: AxiosResponse
    ) => void | Promise<void>

    authTokenProvider?: AuthTokenProvider

    constructor(params: { baseUrl: string; clientId: string }) {
        this.http = axios.create({
            baseURL: params.baseUrl,
            timeout: 30 * 1000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Client-Id': params.clientId
            },
            validateStatus: () => true
        })

        this.http.interceptors.request.use(
            async (config) => {
                config.headers = config.headers ?? {}

                if (!this.deviceId) this.deviceId = await getDeviceId()
                if (!this.userAgent) this.userAgent = await getUserAgent()
                if (!this.bundleId) this.bundleId = await getBundleId()

                const token = await this.authTokenProvider?.()

                if (token) config.headers.Authorization = token
                if (this.deviceId) config.headers['X-Device-ID'] = this.deviceId
                if (this.userAgent)
                    config.headers['User-Agent'] = this.userAgent
                if (this.bundleId) config.headers['X-Bundle-Id'] = this.bundleId

                return config
            },
            (error) => Promise.reject(error)
        )

        this.http.interceptors.response.use(
            (response) => {
                const body = response.data

                this.afterRequestCallback?.call(null, body, response)

                const errorMessage =
                    body?.error?.server_message || body?.error?.code
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

    setAuthTokenProvider(provider: AuthTokenProvider) {
        this.authTokenProvider = provider
    }

    generateLoginCode = async (params: {
        contact: string
        password?: string
    }): Promise<void> => {
        await this.http.post('/wallet/login/code', params)
    }

    confirmLoginCode = async (params: {
        contact: string
        code: string
    }): Promise<{
        sessionKey: string
    }> => {
        return this.http
            .post<
                Response<{ sessionKey: string }>
            >('/wallet/login/confirm', params)
            .then((res) => res.data.data)
    }

    getCurrentUser = async (): Promise<IUser> => {
        return this.http.get<IUser>('/wallet/users/me').then((res) => res.data)
    }

    getBalances = (
        address: string,
        tokens: {
            tokenAddress: string | null
        }[]
    ): Promise<BalanceResponse[]> => {
        return this.http
            .post(`/wallet/blockchain/${address}/get-balance`, {
                tokens
            })
            .then((res) => res.data)
    }

    setUserPublicAddress = async (params: { address: string }) => {
        await this.http.post('/wallet/users/set-address', params)
    }

    getDefaultTokens = (): Promise<ITokenInfo[]> => {
        return this.http
            .get<ITokenInfo[]>(`/wallet/blockchain/tokens`)
            .then((res) => res.data)
    }

    createMultisigWallet = (params: {
        name: string
        signers: string[]
        threshold: number
    }): Promise<IGeneralMultisigWallet> => {
        return this.http
            .post<IGeneralMultisigWallet>('/wallet/wallets', params)
            .then((res) => res.data)
    }

    acceptMultisigWallet = async (walletId: string) => {
        await this.http.post(`/wallet/wallets/${walletId}/accept`, { walletId })
    }

    getMultisigWallets = (): Promise<IGeneralMultisigWallet[]> => {
        return this.http
            .get<IGeneralMultisigWallet[]>('/wallet/wallets')
            .then((res) => res.data)
    }

    createMultisigTransaction = (params: {
        walletId: string
        assetType: 'native' | 'erc20'
        to: string
        amount: string
        tokenAddress: string | null
        remark: string | null
    }): Promise<ITransaction> => {
        return this.http
            .post<ITransaction>('/wallet/tx', params)
            .then((res) => res.data)
    }

    getMultisigWalletTransactions = (
        walletId: string
    ): Promise<ITransaction[]> => {
        return this.http
            .get<ITransaction[]>(`/wallet/wallets/${walletId}/tx`)
            .then((res) => res.data)
    }

    getMultisigWalletTransaction = async (
        txId: string
    ): Promise<ITransaction> => {
        return this.http
            .get<ITransaction>(`/wallet/tx/${txId}`)
            .then((res) => res.data)
    }

    addMultisigTxSignature = (
        txId: string,
        data: { txid: string; address: string; signature: string }
    ): Promise<ITransaction> => {
        return this.http
            .post<ITransaction>(`/wallet/tx/${txId}/signature`, data)
            .then((res) => res.data)
    }

    executeTransaction = (txId: string): Promise<ITransaction> => {
        return this.http
            .post<ITransaction>(`/wallet/tx/${txId}/execute`, { txid: txId })
            .then((res) => res.data)
    }

    getCCWallet = async (): Promise<ICreditCardMultisigWallet | null> => {
        const response =
            await this.http.get<ICreditCardMultisigWallet>('/wallet/ccwallet')
        const wallet = response.data
        if (wallet && Object.keys(wallet).length > 0) {
            return wallet as ICreditCardMultisigWallet
        }
        return null
    }

    getCCWalletTransactions = (walletId: string): Promise<ITransaction[]> => {
        return this.http
            .get<ITransaction[]>(`/wallet/ccwallet/${walletId}/tx`)
            .then((res) => res.data)
    }

    createCCWallet = (params: {
        pan: string
    }): Promise<ICreditCardMultisigWallet> => {
        return this.http
            .post<ICreditCardMultisigWallet>('/wallet/ccwallet', params)
            .then((res) => res.data)
    }

    executePosTransaction = (params: {
        destination: string
        panHash: string
        amount: string
        remark?: string
        merchant: string
        confirmations?: number
    }): Promise<ITransaction> => {
        return this.http
            .post<ITransaction>('/wallet/tx/pos', params)
            .then((res) => res.data)
    }

    getTokenInfo = async (tokenAddress: string): Promise<ITokenInfo | null> => {
        return this.http
            .get<ITokenInfo | null>(
                `/wallet/blockchain/${tokenAddress}/token-info`
            )
            .then((res) => res.data)
    }

    getFeatureFlags = async (): Promise<FeatureFlags> => {
        // TODO: remove mock
        return {
            multisignatureWallet: true,
            paymentWallet: true
        }
    }

    markTopup = async (
        walletId: string,
        hash: string
    ): Promise<ITransaction> => {
        return this.http
            .post<ITransaction>(`/wallet/ccwallet/${walletId}/topup`, {
                walletId,
                hash
            })
            .then((res) => res.data)
    }

    // cashout

    getCashoutLimits = async (): Promise<CashoutLimits> => {
        return this.http
            .get<CashoutLimits>('/cashout/limits')
            .then((res) => res.data)
    }

    getAtmList = async () => {
        const response =
            await this.http.get<ResponseWrapper<{ items: Atm[] }>>(
                '/cashout/atm/list'
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

        await this.http.post('/cashout/pcode/verify', data, {
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
        >('/cashout/pcode', data, {
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
        >(`/cashout/pcode/${cashCode}`)
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
