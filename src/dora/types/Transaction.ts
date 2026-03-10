export type Transaction = {
    hash: string
    created_at: string
    from: string
    to: string
    value: string
    is_from: boolean
    tokenSymbol: string
    tokenAddress?: string
}

export type NativeTransaction = {
    hash: string
    created_at: string
    from: string
    to: string
    value: string
    is_from: boolean
}

export type ERC20Transaction = {
    hash: string
    method: string
    created_at: string
    from: string
    to: string
    amount: string
    is_from: boolean
    token: string // tokenSymbol
    contract: string
}
