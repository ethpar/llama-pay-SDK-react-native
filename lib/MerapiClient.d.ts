import { BalanceResponse } from './models/Balance';
import { FeatureFlags } from './models/FeatureFlags';
import { ICreditCardMultisigWallet, IGeneralMultisigWallet } from './models/IMultisigWallet';
import { ITokenInfo } from './models/ITokenInfo';
import { ITransaction } from './models/ITransaction';
import { IUser } from './models/IUser';
import { HttpClient } from './HttpClient';
type Headers = {
    [key: string]: string;
};
type AuthTokenProvider = () => Promise<string | null>;
export declare class MerapiClient {
    http: HttpClient;
    headers: Headers;
    afterRequestCallback?: (responseBody: any, req: globalThis.Response) => void | Promise<void>;
    authTokenProvider?: AuthTokenProvider;
    constructor(params: {
        baseUrl: string;
        clientId: string;
    });
    setAuthTokenProvider(provider: AuthTokenProvider): void;
    generateLoginCode: (params: {
        contact: string;
        password?: string;
    }) => Promise<void>;
    confirmLoginCode: (params: {
        contact: string;
        code: string;
    }) => Promise<{
        sessionKey: string;
    }>;
    getCurrentUser: () => Promise<IUser>;
    getBalances: (address: string, tokens: {
        tokenAddress: string | null;
    }[]) => Promise<BalanceResponse[]>;
    setUserPublicAddress: (params: {
        address: string;
    }) => Promise<void>;
    getDefaultTokens: () => Promise<ITokenInfo[]>;
    createMultisigWallet: (params: {
        name: string;
        signers: string[];
        threshold: number;
    }) => Promise<IGeneralMultisigWallet>;
    acceptMultisigWallet: (walletId: string) => Promise<void>;
    getMultisigWallets: () => Promise<IGeneralMultisigWallet[]>;
    createMultisigTransaction: (params: {
        walletId: string;
        assetType: "native" | "erc20";
        to: string;
        amount: string;
        tokenAddress: string | null;
        remark: string | null;
    }) => Promise<ITransaction>;
    getMultisigWalletTransactions: (walletId: string) => Promise<ITransaction[]>;
    getMultisigWalletTransaction: (txId: string) => Promise<ITransaction>;
    addMultisigTxSignature: (txId: string, data: {
        txid: string;
        address: string;
        signature: string;
    }) => Promise<ITransaction>;
    executeTransaction: (txId: string) => Promise<ITransaction>;
    getCCWallet: () => Promise<ICreditCardMultisigWallet | null>;
    getCCWalletTransactions: (walletId: string) => Promise<ITransaction[]>;
    createCCWallet: (params: {
        pan: string;
    }) => Promise<ICreditCardMultisigWallet>;
    executePosTransaction: (params: {
        destination: string;
        panHash: string;
        amount: string;
        remark?: string;
        merchant: string;
        confirmations?: number;
    }) => Promise<ITransaction>;
    getTokenInfo: (tokenAddress: string) => Promise<ITokenInfo | null>;
    getFeatureFlags: () => Promise<FeatureFlags>;
    markTopup: (walletId: string, hash: string) => Promise<ITransaction>;
}
export {};
//# sourceMappingURL=MerapiClient.d.ts.map