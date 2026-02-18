import { AxiosInstance } from 'axios';
import { Atm } from './models/cashout/Atm';
import { CashoutRequest } from './models/cashout/CashoutRequest';
import { CreateCashoutResponse } from './models/cashout/CreateCashoutResponse';
export declare class CashoutClient {
    http: AxiosInstance;
    constructor();
    setAuthToken(sessionKey: string): void;
    guestLogin: () => Promise<string>;
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
}
//# sourceMappingURL=CashoutClient.d.ts.map