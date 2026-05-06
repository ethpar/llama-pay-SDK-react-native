import axios, { AxiosInstance } from "axios";
import {
    LoginParams,
    LoginResponse,
    GetCashPrams,
    GetCashReponse,
    BuyCoinParams,
    BuyCoinResponse,
} from "./types";

export class AtmClient {
    http: AxiosInstance;

    constructor(params: { baseUrl: string }) {
        this.http = axios.create({
            baseURL: params.baseUrl,
            timeout: 30 * 1000,
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
}
