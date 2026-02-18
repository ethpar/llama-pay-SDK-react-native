"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerapiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const device_info_1 = require("./device-info");
class MerapiClient {
    constructor(params) {
        this.generateLoginCode = async (params) => {
            await this.http.post('/wallet/login/code', params);
        };
        this.confirmLoginCode = async (params) => {
            return this.http
                .post('/wallet/login/confirm', params)
                .then((res) => res.data.data);
        };
        this.getCurrentUser = async () => {
            return this.http.get('/wallet/users/me').then((res) => res.data);
        };
        this.updateProfile = async (params) => {
            return this.http
                .post('/wallet/profile', {
                first_name: params.firstName,
                second_name: params.lastName
            })
                .then((res) => res.data);
        };
        this.getBalances = (address, tokens) => {
            return this.http
                .post(`/wallet/blockchain/${address}/get-balance`, {
                tokens
            })
                .then((res) => res.data);
        };
        this.setUserPublicAddress = async (params) => {
            await this.http.post('/wallet/users/set-address', params);
        };
        this.getDefaultTokens = () => {
            return this.http
                .get(`/wallet/blockchain/tokens`)
                .then((res) => res.data);
        };
        this.createMultisigWallet = (params) => {
            return this.http
                .post('/wallet/wallets', params)
                .then((res) => res.data);
        };
        this.acceptMultisigWallet = async (walletId) => {
            await this.http.post(`/wallet/wallets/${walletId}/accept`, { walletId });
        };
        this.getMultisigWallets = () => {
            return this.http
                .get('/wallet/wallets')
                .then((res) => res.data);
        };
        this.createMultisigTransaction = (params) => {
            return this.http
                .post('/wallet/tx', params)
                .then((res) => res.data);
        };
        this.getMultisigWalletTransactions = (walletId) => {
            return this.http
                .get(`/wallet/wallets/${walletId}/tx`)
                .then((res) => res.data);
        };
        this.getMultisigWalletTransaction = async (txId) => {
            return this.http
                .get(`/wallet/tx/${txId}`)
                .then((res) => res.data);
        };
        this.addMultisigTxSignature = (txId, data) => {
            return this.http
                .post(`/wallet/tx/${txId}/signature`, data)
                .then((res) => res.data);
        };
        this.executeTransaction = (txId) => {
            return this.http
                .post(`/wallet/tx/${txId}/execute`, { txid: txId })
                .then((res) => res.data);
        };
        this.getCCWallet = async () => {
            const response = await this.http.get('/wallet/ccwallet');
            const wallet = response.data;
            if (wallet && Object.keys(wallet).length > 0) {
                return wallet;
            }
            return null;
        };
        this.getCCWalletTransactions = (walletId) => {
            return this.http
                .get(`/wallet/ccwallet/${walletId}/tx`)
                .then((res) => res.data);
        };
        this.createCCWallet = (params) => {
            return this.http
                .post('/wallet/ccwallet', params)
                .then((res) => res.data);
        };
        this.executePosTransaction = (params) => {
            return this.http
                .post('/wallet/tx/pos', params)
                .then((res) => res.data);
        };
        this.getTokenInfo = async (tokenAddress) => {
            return this.http
                .get(`/wallet/blockchain/${tokenAddress}/token-info`)
                .then((res) => res.data);
        };
        this.getFeatureFlags = async () => {
            // TODO: remove mock
            return {
                multisignatureWallet: true,
                paymentWallet: true
            };
        };
        this.markTopup = async (walletId, hash) => {
            return this.http
                .post(`/wallet/ccwallet/${walletId}/topup`, {
                walletId,
                hash
            })
                .then((res) => res.data);
        };
        // cashout
        this.getCashoutLimits = async () => {
            return this.http
                .get('/cashout/limits')
                .then((res) => res.data);
        };
        this.getAtmList = async () => {
            const response = await this.http.get('/cashout/atm/list');
            return response.data.data.items;
        };
        this.sendVerificationWord = async (params) => {
            const data = new URLSearchParams();
            data.append('first_name', params.firstName);
            data.append('last_name', params.lastName);
            data.append('phone_number', params.phoneNumber);
            data.append('word_code', '1');
            data.append('_t', new Date().getTime().toString());
            await this.http.post('/cashout/pcode/verify', data, {
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
            const response = await this.http.post('/cashout/pcode', data, {
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
            const response = await this.http.get(`/cashout/pcode/${cashCode}`);
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
        this.http = axios_1.default.create({
            baseURL: params.baseUrl,
            timeout: 30 * 1000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Client-Id': params.clientId
            },
            validateStatus: () => true
        });
        this.http.interceptors.request.use(async (config) => {
            config.headers = config.headers ?? {};
            if (!this.deviceId)
                this.deviceId = await (0, device_info_1.getDeviceId)();
            if (!this.userAgent)
                this.userAgent = await (0, device_info_1.getUserAgent)();
            if (!this.bundleId)
                this.bundleId = await (0, device_info_1.getBundleId)();
            const token = await this.authTokenProvider?.();
            if (token)
                config.headers.Authorization = token;
            if (this.deviceId)
                config.headers['X-Device-ID'] = this.deviceId;
            if (this.userAgent)
                config.headers['User-Agent'] = this.userAgent;
            if (this.bundleId)
                config.headers['X-Bundle-Id'] = this.bundleId;
            return config;
        }, (error) => Promise.reject(error));
        this.http.interceptors.response.use((response) => {
            const body = response.data;
            this.afterRequestCallback?.call(null, body, response);
            const errorMessage = body?.error?.server_message || body?.error?.code;
            if (errorMessage) {
                return Promise.reject(new Error(errorMessage));
            }
            return response;
        }, (error) => {
            return Promise.reject(error);
        });
    }
    setAuthTokenProvider(provider) {
        this.authTokenProvider = provider;
    }
}
exports.MerapiClient = MerapiClient;
//# sourceMappingURL=MerapiClient.js.map