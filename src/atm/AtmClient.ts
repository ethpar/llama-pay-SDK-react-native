import axios, { AxiosInstance } from "axios";
import {
    LoginParams,
    LoginResponse,
    GetCashPrams,
    GetCashReponse,
    BuyCoinParams,
    BuyCoinResponse,
    CoinResponse,
    CoinsPurchaseParams,
    CoinsPurchaseCommitParams,
    CoinResponseRaw,
    CoinCommitResponse
} from "./types";

export class AtmClient {
    http: AxiosInstance;

    constructor(params: { baseUrl?: string }) {
        this.http = axios.create({
            baseURL: params.baseUrl || "https://genmega.rampatm.net/atm",
            timeout: 2 * 60 * 1000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            validateStatus: () => true,
        });

        this.http.interceptors.response.use(
            (response) => {
                const body = response.data;

                const errorMessage =
                    body?.error?.server_message || body?.error?.code;
                if (errorMessage) {
                    return Promise.reject(new Error(errorMessage));
                }
                return response;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    setAuthToken(token: string) {
        this.http.defaults.headers.common["Authorization"] = token;
    }

    login = async (
        params: LoginParams
    ): Promise<{
        sessionKey: string;
    }> => {
        return this.http
            .post<LoginResponse>("/atm/login", params)
            .then((res) => res.data.data);
    };

    getCash = async (
        params: GetCashPrams
    ): Promise<{
        amount: string;
    }> => {
        return this.http
            .post<GetCashReponse>("/atm/purchase-code", params)
            .then((res) => res.data.data.items[0]);
    };

    buyToken = async (params: BuyCoinParams) => {
        return this.http
            .post<BuyCoinResponse>("/atm/eth/coins/gift", params)
            .then((res) => res.data.data.items[0]);
    };

    coinsPurchase = async (
        params: CoinsPurchaseParams
    ): Promise<CoinResponse> => {
        const res = await this.http
            .post<{ data: { items: CoinResponseRaw[] } }>("/atm/eth/coins/purchase", {
                terminal_id: params.terminalId,
                amount: params.amount,
                encrypted_card_hash: params.cardHash,
                coin: params.coin
            })
            .then((res) => res.data.data.items[0]);
        return {
            customerPublicKey: res.customer_publicKey,
            fees: res.fees,
            minAmount: res.min_amount,
            price: res.price,
            privateKey: res.privateKey,
            publicKey: res.publicKey,
            quantity: res.quantity,
            wholeUnitPrice: res.wholeUnitPrice
        }
    };

    coinsPurchaseCommit = async (
        commit: boolean,
        params: CoinsPurchaseCommitParams
    ): Promise<CoinCommitResponse> => {
        return this.http
            .post<{ data: { items: CoinCommitResponse[] } }>("/atm/eth/coins/commit", {
                terminal_id: params.terminalId,
                public_key: params.publicKey,
                is_commit: commit ? 1 : 0,
                encrypted_card_hash: params.cardHash,
                coin: params.coin
            })
            .then((res) => res.data.data.items[0]);
    };
}
