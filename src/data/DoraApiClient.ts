import { ERC20Transaction, NativeTransaction } from '../models/Transaction'
import { HttpClient } from './HttpClient'

type Headers = { [key: string]: string }

export class DoraApiClient {
    http: HttpClient
    headers: Headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }

    constructor() {
        const doraUrl = 'https://dora.testnet.ethpar.net/api'
        this.http = new HttpClient(doraUrl, this.headers)
    }

    getTransactions = (
        address: string,
        params?: { offset: number; size: number }
    ): Promise<{
        data: NativeTransaction[]
        totalCount: number
        pageSize: number
        offset: number
    }> => {
        if (!params) {
            params = {
                offset: 0,
                size: 1000
            }
        }
        return this.http.get(
            `/account/txlist/${address}?offset=${params.offset}&pageSize=${params.size}`
        )
    }

    getERC20Transactions = (
        address: string,
        contract: string,
        params?: { offset: number; size: number }
    ): Promise<{
        data: ERC20Transaction[]
        totalCount: number
        pageSize: number
        offset: number
    }> => {
        if (!params) {
            params = {
                offset: 0,
                size: 1000
            }
        }
        return this.http.get(
            `/account/txlist/erc20/${address}?contract=${contract}?offset=${params.offset}&pageSize=${params.size}`
        )
    }
}
