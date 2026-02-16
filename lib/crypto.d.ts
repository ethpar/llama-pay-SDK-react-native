import { ethers, TransactionResponse } from 'ethers';
import { SimpleMultisigTransactionData } from './models/SimpleMultisigTransactionData';
export type TransactionRequest = ethers.TransactionRequest;
export declare function getPublicAddress(privateKey: string): string;
export declare function signTx(privateKey: string, tx: TransactionRequest, rpcUrl?: string): Promise<string>;
export declare function signERC20(privateKey: string, tx: TransactionRequest & {
    tokenAddress: string;
}, rpcUrl?: string): Promise<string>;
export declare function signTypedData(privateKey: string, txData: SimpleMultisigTransactionData, rpcUrl?: string): Promise<string>;
export declare function broadcastTx(signedTx: string, rpcUrl: string): Promise<TransactionResponse>;
//# sourceMappingURL=crypto.d.ts.map