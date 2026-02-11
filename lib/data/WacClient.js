"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacClient = void 0;
const HttpClient_1 = require("./HttpClient");
class WacClient {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        this.guestLogin = async () => {
            return this.http.post('/wac/guest/login', {});
        };
        this.getAtmList = async () => {
            return this.http.get('/wac/atm/list');
        };
        this.sendVerificationWord = async (params) => {
            const data = new URLSearchParams();
            data.append('first_name', params.firstName);
            data.append('last_name', params.lastName);
            data.append('phone_number', params.phoneNumber);
            data.append('word_code', '1');
            data.append('_t', new Date().getTime().toString());
            return this.http.post('/wac/pcode/verify', data.toString(), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
        };
        this.confirmVerificationWord = async (params) => {
            const data = new URLSearchParams();
            data.append('atm_id', params.amount);
            data.append('amount', params.amount);
            data.append('verification_code', params.verificationCode);
            data.append('_t', new Date().getTime().toString());
            const response = await this.http.post('/wac/pcode', data.toString(), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
            const result = response.data.items[0];
            return {
                secureCode: result.secure_code,
                address: result.address,
                usdAmount: result.usd_amount,
                btcAmount: result.btc_amount,
                btcWholeUnitPrice: result.btc_whole_unit_price
            };
        };
        this.checkCashCodeStatus = async (cashCode) => {
            const response = await this.http.get(`/wac/pcode/${cashCode}`);
            const result = response.data.items[0];
            return {
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
        const baseUrl = 'https://genmega.rampatm.net/wac';
        this.http = new HttpClient_1.HttpClient(baseUrl, this.headers);
        this.http.setAfterRequestCallback(async (response) => {
            const resultText = await response.text();
            let responseJson;
            try {
                responseJson = JSON.parse(resultText);
            }
            catch (e) {
                throw new Error(`Invalid response: ${resultText}`);
            }
            const errorMessage = responseJson.error?.server_message || responseJson.error?.code;
            if (errorMessage) {
                throw new Error(errorMessage);
            }
            return responseJson.data;
        });
    }
}
exports.WacClient = WacClient;
//# sourceMappingURL=WacClient.js.map