import { ERC20Transaction, NativeTransaction } from './models/Transaction';
import { HttpClient } from './HttpClient';
type Headers = {
    [key: string]: string;
};
export declare class DoraApiClient {
    http: HttpClient;
    headers: Headers;
    constructor();
    getTransactions: (address: string, params?: {
        offset: number;
        size: number;
    }) => Promise<{
        data: NativeTransaction[];
        totalCount: number;
        pageSize: number;
        offset: number;
    }>;
    getERC20Transactions: (address: string, contract: string, params?: {
        offset: number;
        size: number;
    }) => Promise<{
        data: ERC20Transaction[];
        totalCount: number;
        pageSize: number;
        offset: number;
    }>;
}
export {};
//# sourceMappingURL=DoraApiClient.d.ts.map