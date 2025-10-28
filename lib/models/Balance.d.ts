import { ITokenInfo } from './ITokenInfo';
export type Balance = ITokenInfo & Partial<TokenPrice> & {
    amount: string;
};
export type TokenPrice = {
    currentValue: number;
    currentPrice: number;
    priceChangePercentange24h: number;
};
export type BalanceResponse = {
    amount: string;
    tokenAddress: string | null;
    currentPrice: number;
    priceChangePercentange24h: number;
};
//# sourceMappingURL=Balance.d.ts.map