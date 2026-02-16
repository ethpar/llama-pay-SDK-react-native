import { AxiosInstance } from 'axios';
import { Atm } from './models/cashout/Atm';
import { CashoutRequest } from './models/cashout/CashoutRequest';
import { ConfirmSecureWordResponse } from './models/cashout/ConfirmSecureWordResponse';
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
    confirmVerificationWord: (params: {
        atmId: string;
        amount: string;
        verificationCode: string;
    }) => Promise<ConfirmSecureWordResponse>;
    getCashOutRequest: (cashCode: string) => Promise<CashoutRequest>;
}
//# sourceMappingURL=CashoutClient.d.ts.map