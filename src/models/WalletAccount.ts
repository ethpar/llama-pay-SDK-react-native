export interface WalletAccount {
    id: number
    name: string
    address: string
    derivationPath: string
    accountIndex: number
    parentFingerprint: string
    active: boolean
}
