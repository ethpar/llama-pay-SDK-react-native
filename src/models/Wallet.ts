export type HDWallet = {
    id: string
    name: string
    mnemonic: string
}

export type Account = {
    id: string
    name: string
    address: string
    type: 'hd' | 'single'
    
    // only for hd wallet accounts
    walletId?: string
    privateKey?: string
    derivationPath?: string
}
