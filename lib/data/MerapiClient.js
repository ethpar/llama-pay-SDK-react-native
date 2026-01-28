"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerapiClient = void 0;
const device_info_1 = require("../device-info");
const HttpClient_1 = require("./HttpClient");
class MerapiClient {
    constructor(params) {
        this.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        this.generateLoginCode = (params) => {
            return this.http.post('/wallet/login/code', params);
        };
        this.confirmLoginCode = (params) => {
            return this.http
                .post('/wallet/login/confirm', params)
                .then((data) => data.data);
        };
        this.getCurrentUser = () => {
            return this.http.get('/wallet/users/me');
        };
        this.getBalances = (address, tokens) => {
            return this.http.post(`/wallet/blockchain/${address}/get-balance`, {
                tokens
            });
        };
        this.setUserPublicAddress = async (params) => {
            await this.http.post('/wallet/users/set-address', params);
        };
        this.getDefaultTokens = () => {
            return this.http.get(`/wallet/blockchain/tokens`);
        };
        this.createMultisigWallet = (params) => {
            return this.http.post('/wallet/wallets', params);
        };
        this.acceptMultisigWallet = async (walletId) => {
            await this.http.post(`/wallet/wallets/${walletId}/accept`, { walletId });
        };
        this.getMultisigWallets = () => {
            return this.http.get('/wallet/wallets');
        };
        this.createMultisigTransaction = (params) => {
            return this.http.post('/wallet/tx', params);
        };
        this.getMultisigWalletTransactions = (walletId) => {
            return this.http.get(`/wallet/wallets/${walletId}/tx`);
        };
        this.getMultisigWalletTransaction = async (txId) => {
            return this.http.get(`/wallet/tx/${txId}`);
        };
        this.addMultisigTxSignature = (txId, data) => {
            return this.http.post(`/wallet/tx/${txId}/signature`, data);
        };
        this.executeTransaction = (txId) => {
            return this.http.post(`/wallet/tx/${txId}/execute`, { txid: txId });
        };
        this.getCCWallet = () => {
            return this.http.get('/wallet/ccwallet').then((wallet) => {
                if (wallet && Object.keys(wallet).length > 0) {
                    return wallet;
                }
                return null;
            });
        };
        this.getCCWalletTransactions = (walletId) => {
            return this.http.get(`/wallet/ccwallet/${walletId}/tx`);
        };
        this.createCCWallet = (params) => {
            return this.http.post('/wallet/ccwallet', params);
        };
        this.executePosTransaction = (params) => {
            return this.http.post('/wallet/tx/pos', params);
        };
        this.getTokenInfo = async (tokenAddress) => {
            return this.http.get(`/wallet/blockchain/${tokenAddress}/token-info`);
        };
        this.getFeatureFlags = async () => {
            // TOOD: remove mock
            return {
                multisignatureWallet: true,
                paymentWallet: true
            };
        };
        this.markTopup = async (walletId, hash) => {
            return this.http.post(`/wallet/ccwallet/${walletId}/topup`, {
                walletId,
                hash
            });
        };
        this.http = new HttpClient_1.HttpClient(params.baseUrl, this.headers);
        this.headers['X-Client-Id'] = params.clientId;
        this.http.setBeforeRequestCallback(async (req) => {
            if (!this.headers['X-Device-ID']) {
                this.headers['X-Device-ID'] = await (0, device_info_1.getDeviceId)();
            }
            if (!this.headers['User-Agent']) {
                this.headers['User-Agent'] = await (0, device_info_1.getUserAgent)();
            }
            if (!this.headers['X-Bundle-Id']) {
                this.headers['X-Bundle-Id'] = await (0, device_info_1.getBundleId)();
            }
            const authToken = await this.authTokenProvider?.call(null);
            if (authToken) {
                req.headers['Authorization'] = authToken;
            }
        });
        this.http.setAfterRequestCallback(async (res) => {
            if (!res.ok) {
                const body = await res.json().catch((e) => null);
                this.afterRequestCallback?.call(null, body, res);
                throw new Error(body?.error?.server_message ||
                    body?.error?.code ||
                    res.statusText);
            }
        });
    }
    setAuthTokenProvider(provider) {
        this.authTokenProvider = provider;
    }
}
exports.MerapiClient = MerapiClient;
//# sourceMappingURL=MerapiClient.js.map