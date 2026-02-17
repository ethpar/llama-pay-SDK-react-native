import { ethers, TransactionResponse } from 'ethers';
import { SimpleMultisigTransactionData } from './models/SimpleMultisigTransactionData';
export type TransactionRequest = ethers.TransactionRequest;
export declare function getPublicAddress(privateKey: string): string;
export declare function sendNative(privateKey: string, tx: TransactionRequest, rpcUrl?: string): Promise<TransactionResponse>;
export declare function sendERC20(privateKey: string, tx: TransactionRequest & {
    tokenAddress: string;
}, rpcUrl?: string): Promise<TransactionResponse>;
export declare function signTypedData(privateKey: string, txData: SimpleMultisigTransactionData, rpcUrl?: string): Promise<string>;
//# sourceMappingURL=crypto.d.ts.map