export interface ITokenInfo {
    tokenAddress: string | null
    imageUrl: string
    token: {
        name: string
        decimals: number
        symbol: string
    }
}
