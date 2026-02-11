import { Atm } from '../models/wac/Atm';
import { HttpClient } from './HttpClient';
import CashCode from '../models/wac/CashCode';
type Headers = {
    [key: string]: string;
};
export declare class WacClient {
    http: HttpClient;
    headers: Headers;
    constructor();
    guestLogin: () => Promise<{
        sessionKey: string;
    }>;
    getAtmList: () => Promise<{
        items: Atm[];
    }>;
    sendVerificationWord: (params: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    }) => Promise<{}>;
    confirmVerificationWord: (params: {
        atmId: string;
        amount: string;
        verificationCode: string;
    }) => Promise<{
        secureCode: string;
        address: string;
        usdAmount: number;
        btcAmount: number;
        btcWholeUnitPrice: number;
    }>;
    checkCashCodeStatus: (cashCode: string) => Promise<CashCode>;
}
export {};
//# sourceMappingURL=WacClient.d.ts.map