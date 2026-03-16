import { AxiosInstance, AxiosResponse } from 'axios';
import { BalanceResponse } from './models/Balance';
import { Atm } from './models/cashout/Atm';
import { CashoutRequest } from './models/cashout/CashoutRequest';
import { CreateCashoutResponse } from './models/cashout/CreateCashoutResponse';
import { FeatureFlags } from './models/FeatureFlags';
import { ICreditCardMultisigWallet, IGeneralMultisigWallet } from './models/IMultisigWallet';
import { ITokenInfo } from './models/ITokenInfo';
import { IMultisigTransaction } from './models/IMultisigTransaction';
import { IUser } from './models/IUser';
import { CashoutLimits } from './models/cashout/CashoutLimits';
import { Transaction } from './models/Transaction';
type AuthTokenProvider = () => Promise<string | null>;
export declare class MerapiClient {
    http: AxiosInstance;
    private deviceId?;
    private userAgent?;
    private bundleId?;
    afterRequestCallback?: (responseBody: any, response: AxiosResponse) => void | Promise<void>;
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
    updateProfile: (params: {
        firstName: string;
        lastName: string;
    }) => Promise<IUser>;
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
    }) => Promise<IMultisigTransaction>;
    getMultisigWalletTransactions: (walletId: string) => Promise<IMultisigTransaction[]>;
    getMultisigWalletTransaction: (txId: string) => Promise<IMultisigTransaction>;
    addMultisigTxSignature: (txId: string, data: {
        txid: string;
        address: string;
        signature: string;
    }) => Promise<IMultisigTransaction>;
    executeTransaction: (txId: string) => Promise<IMultisigTransaction>;
    getCCWallet: () => Promise<ICreditCardMultisigWallet | null>;
    getCCWalletTransactions: (walletId: string) => Promise<IMultisigTransaction[]>;
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
    }) => Promise<IMultisigTransaction>;
    getTokenInfo: (tokenAddress: string) => Promise<ITokenInfo | null>;
    getFeatureFlags: () => Promise<FeatureFlags>;
    markTopup: (walletId: string, hash: string) => Promise<IMultisigTransaction>;
    getCashoutLimits: () => Promise<CashoutLimits>;
    getAtmList: () => Promise<Atm[]>;
    sendVerificationWord: (params: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    }) => Promise<void>;
    createCashoutRequest: (params: {
        atmId: string;
        amount: string;
    }) => Promise<CreateCashoutResponse>;
    getCashOutRequest: (cashCode: string) => Promise<CashoutRequest>;
    getCashOutRequests: () => Promise<CashoutRequest[]>;
    linkCardToAddress: (params: {
        address: string;
        cardhash: string;
    }) => Promise<void>;
    getAddressByCardHash: (cardhash: string) => Promise<string | undefined>;
    getLinkedCardsCount: () => Promise<number>;
    submitTransaction: (params: {
        transaction: string;
    }) => Promise<{
        hash: string;
    }>;
    getRpcUrl: () => Promise<string>;
    getTransactions: () => Promise<Transaction[]>;
}
export {};
//# sourceMappingURL=MerapiClient.d.ts.map