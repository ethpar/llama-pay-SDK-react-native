import { BinInfo } from './IBinInfo'

export interface IMultisigWallet {
    address: string
    m: number
    n: number
    executorAddress: string | null
    signers: ISigner[]
    creationHash?: string
}

export interface ISigner {
    id: string
    address: string
    userId: string | null
    acceptedOn: Date | null
}

export type IBaseMultisigWallet = {
    id: string
    name: string
    userId: string
    wallet: IMultisigWallet
    createdOn: Date
}

export type ICreditCardMultisigWallet = IBaseMultisigWallet & {
    panLastDigits: string
    panHash: string
    binHash: string
    binInfo: BinInfo | null
    type: 'credit-card'
}

export type IGeneralMultisigWallet = IBaseMultisigWallet & {
    creatorId: string
    type: 'general'
    signerIds: (string | null)[]
    signerAddresses: string[]
}
