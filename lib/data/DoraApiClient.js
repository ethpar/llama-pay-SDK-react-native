"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoraApiClient = void 0;
const HttpClient_1 = require("./HttpClient");
class DoraApiClient {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        this.getTransactions = (address, params) => {
            if (!params) {
                params = {
                    offset: 0,
                    size: 1000
                };
            }
            return this.http.get(`/account/txlist/${address}?offset=${params.offset}&pageSize=${params.size}`);
        };
        this.getERC20Transactions = (address, contract, params) => {
            if (!params) {
                params = {
                    offset: 0,
                    size: 1000
                };
            }
            return this.http.get(`/account/txlist/erc20/${address}?contract=${contract}?offset=${params.offset}&pageSize=${params.size}`);
        };
        const doraUrl = 'https://dora.testnet.ethpar.net/api';
        this.http = new HttpClient_1.HttpClient(doraUrl, this.headers);
    }
}
exports.DoraApiClient = DoraApiClient;
//# sourceMappingURL=DoraApiClient.js.map