import { SimpleMultisigTransactionData } from './SimpleMultisigTransactionData'

export interface ITransaction {
    id: string
    assetType: AssetType
    asset: TransactionAsset
    amount: string
    to: string
    walletId: string
    initiatorUserId: string | null
    executorAddress: string | null
    signatures: ISignature[]
    status: 'pending' | 'completed' | 'failed'
    data: SimpleMultisigTransactionData
    hash: string | null
    fee: FeeQuote
    createdOn: Date
    updatedOn: Date
    remark: string | null
    type: 'normal' | 'merchant'
    incoming: boolean

    // applicable only for merchant
    merchant: string | null
}

export type AssetType = 'native' | 'erc20'

export type TransactionAsset = {
    tokenAddress: string | null
    symbol: string
    decimals: number
    image: string | null
}

export type FeeQuote = {
    gasLimit: string
    maxFeePerGas: string | null
    maxPriorityFeePerGas: string | null

    gasPrice: string | null
    totalWei: string | null
}

export interface ISignature {
    address: string
    signature: string
}
