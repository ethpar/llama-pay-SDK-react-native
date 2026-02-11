import { BalanceResponse } from '../models/Balance'
import { FeatureFlags } from '../models/FeatureFlags'
import {
    ICreditCardMultisigWallet,
    IGeneralMultisigWallet
} from '../models/IMultisigWallet'
import { ITokenInfo } from '../models/ITokenInfo'
import { ITransaction } from '../models/ITransaction'
import { IUser } from '../models/IUser'
import { getBundleId, getDeviceId, getUserAgent } from '../device-info'
import { HttpClient } from './HttpClient'
import ResponseWrapper from '../models/ResponseWrapper'

type Headers = { [key: string]: string }

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
    http: HttpClient
    headers: Headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
    afterRequestCallback?: (
        responseBody: any,
        req: globalThis.Response
    ) => void | Promise<void>
    authTokenProvider?: AuthTokenProvider

    constructor(params: { baseUrl: string; clientId: string }) {
        this.http = new HttpClient(params.baseUrl, this.headers)
        this.headers['X-Client-Id'] = params.clientId
        this.http.setBeforeRequestCallback(async (req) => {
            if (!this.headers['X-Device-ID']) {
                this.headers['X-Device-ID'] = await getDeviceId()
            }
            if (!this.headers['User-Agent']) {
                this.headers['User-Agent'] = await getUserAgent()
            }
            if (!this.headers['X-Bundle-Id']) {
                this.headers['X-Bundle-Id'] = await getBundleId()
            }
            const authToken = await this.authTokenProvider?.call(null)
            if (authToken) {
                req.headers['Authorization'] = authToken
            }
        })
        this.http.setAfterRequestCallback(async (res) => {
            if (!res.ok) {
                const body = await res.json().catch((e) => null)
                this.afterRequestCallback?.call(null, body, res)
                throw new Error(
                    body?.error?.server_message ||
                        body?.error?.code ||
                        res.statusText
                )
            }
        })
    }

    setAuthTokenProvider(provider: AuthTokenProvider) {
        this.authTokenProvider = provider
    }

    generateLoginCode = (params: {
        contact: string
        password?: string
    }): Promise<void> => {
        return this.http.post('/wallet/login/code', params)
    }

    confirmLoginCode = async (params: {
        contact: string
        code: string
    }): Promise<{
        sessionKey: string
    }> => {
        const result: ResponseWrapper<{ sessionKey: string }> =
            await this.http.post<Response<{ sessionKey: string }>>(
                '/wallet/login/confirm',
                params
            )
        return result.data
    }

    getCurrentUser = (): Promise<IUser> => {
        return this.http.get('/wallet/users/me')
    }

    getBalances = (
        address: string,
        tokens: {
            tokenAddress: string | null
        }[]
    ): Promise<BalanceResponse[]> => {
        return this.http.post(`/wallet/blockchain/${address}/get-balance`, {
            tokens
        })
    }

    setUserPublicAddress = async (params: { address: string }) => {
        await this.http.post('/wallet/users/set-address', params)
    }

    getDefaultTokens = (): Promise<ITokenInfo[]> => {
        return this.http.get(`/wallet/blockchain/tokens`)
    }

    createMultisigWallet = (params: {
        name: string
        signers: string[]
        threshold: number
    }): Promise<IGeneralMultisigWallet> => {
        return this.http.post('/wallet/wallets', params)
    }

    acceptMultisigWallet = async (walletId: string) => {
        await this.http.post(`/wallet/wallets/${walletId}/accept`, { walletId })
    }

    getMultisigWallets = (): Promise<IGeneralMultisigWallet[]> => {
        return this.http.get('/wallet/wallets')
    }

    createMultisigTransaction = (params: {
        walletId: string
        assetType: 'native' | 'erc20'
        to: string
        amount: string
        tokenAddress: string | null
        remark: string | null
    }): Promise<ITransaction> => {
        return this.http.post('/wallet/tx', params)
    }

    getMultisigWalletTransactions = (
        walletId: string
    ): Promise<ITransaction[]> => {
        return this.http.get(`/wallet/wallets/${walletId}/tx`)
    }

    getMultisigWalletTransaction = async (
        txId: string
    ): Promise<ITransaction> => {
        return this.http.get(`/wallet/tx/${txId}`)
    }

    addMultisigTxSignature = (
        txId: string,
        data: { txid: string; address: string; signature: string }
    ): Promise<ITransaction> => {
        return this.http.post(`/wallet/tx/${txId}/signature`, data)
    }

    executeTransaction = (txId: string): Promise<ITransaction> => {
        return this.http.post(`/wallet/tx/${txId}/execute`, { txid: txId })
    }

    getCCWallet = (): Promise<ICreditCardMultisigWallet | null> => {
        return this.http.get('/wallet/ccwallet').then((wallet) => {
            if (wallet && Object.keys(wallet).length > 0) {
                return wallet as ICreditCardMultisigWallet
            }
            return null
        })
    }

    getCCWalletTransactions = (walletId: string): Promise<ITransaction[]> => {
        return this.http.get(`/wallet/ccwallet/${walletId}/tx`)
    }

    createCCWallet = (params: {
        pan: string
    }): Promise<ICreditCardMultisigWallet> => {
        return this.http.post('/wallet/ccwallet', params)
    }

    executePosTransaction = (params: {
        destination: string
        panHash: string
        amount: string
        remark?: string
        merchant: string
        confirmations?: number
    }): Promise<ITransaction> => {
        return this.http.post('/wallet/tx/pos', params)
    }

    getTokenInfo = async (tokenAddress: string): Promise<ITokenInfo | null> => {
        return this.http.get(`/wallet/blockchain/${tokenAddress}/token-info`)
    }

    getFeatureFlags = async (): Promise<FeatureFlags> => {
        // TOOD: remove mock
        return {
            multisignatureWallet: true,
            paymentWallet: true
        }
    }

    markTopup = async (
        walletId: string,
        hash: string
    ): Promise<ITransaction> => {
        return this.http.post(`/wallet/ccwallet/${walletId}/topup`, {
            walletId,
            hash
        })
    }
}
