"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashoutClient = void 0;
const axios_1 = __importDefault(require("axios"));
class CashoutClient {
    constructor() {
        this.guestLogin = async () => {
            const response = await this.http.post('/wac/guest/login');
            const sessionKey = await response.data.data.sessionKey;
            this.http.defaults.headers.common['Authorization'] = sessionKey;
            return sessionKey;
        };
        this.getAtmList = async () => {
            const response = await this.http.get('/wac/atm/list');
            return response.data.data.items;
        };
        this.sendVerificationWord = async (params) => {
            const data = new URLSearchParams();
            data.append('first_name', params.firstName);
            data.append('last_name', params.lastName);
            data.append('phone_number', params.phoneNumber);
            data.append('word_code', '1');
            data.append('_t', new Date().getTime().toString());
            await this.http.post('/wac/pcode/verify', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        };
        this.createCashoutRequest = async (params) => {
            const data = new URLSearchParams();
            data.append('atm_id', params.atmId);
            data.append('amount', params.amount);
            data.append('_t', new Date().getTime().toString());
            const response = await this.http.post('/wac/pcode', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const result = response.data.data.items[0];
            return {
                secureCode: result.secure_code,
                address: result.address,
                usdAmount: result.usd_amount,
                btcAmount: result.btc_amount,
                btcWholeUnitPrice: result.btc_whole_unit_price
            };
        };
        this.getCashOutRequest = async (cashCode) => {
            const response = await this.http.get(`/wac/pcode/${cashCode}`);
            const result = response.data.data.items[0];
            return {
                id: cashCode,
                pcode: result.pcode,
                status: result.status,
                address: result.address,
                usdAmount: result.usd_amount,
                btcAmount: result.btc_amount,
                btcWholeUnitPrice: result.btc_whole_unit_price,
                expiration: result.expiration,
                atmId: result.atm_id,
                locDescription: result.loc_description,
                locLat: result.loc_lat,
                locLon: result.loc_lon
            };
        };
        const baseURL = 'https://genmega.rampatm.net/wac';
        this.http = axios_1.default.create({
            baseURL,
            timeout: 30 * 1000,
            headers: {
                Accept: '*/*'
            },
            validateStatus: () => true
        });
        this.http.interceptors.response.use((response) => {
            const result = response.data;
            const errorMessage = result?.error?.server_message || result?.error?.code;
            if (errorMessage) {
                return Promise.reject(new Error(errorMessage));
            }
            return response;
        }, (error) => {
            return Promise.reject(error);
        });
    }
    setAuthToken(sessionKey) {
        this.http.defaults.headers.common['Authorization'] = sessionKey;
    }
}
exports.CashoutClient = CashoutClient;
//# sourceMappingURL=CashoutClient.js.map