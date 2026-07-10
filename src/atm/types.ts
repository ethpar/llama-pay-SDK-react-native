export type ResponseWrapper<T> = {
    result: "ok" | "error";
    error: {
        code: string;
        server_message: string;
    } | null;
    data: T;
};

export type BuyCoinParams = {
    amount: number;
    encrypted_card_hash: string;
    terminal_id: string;
    coin: "psc";
};

export type BuyCoinResponse = ResponseWrapper<{
    items: [{ quantity: number; publicKey: string; txHash: string }];
}>;

export type GetCashPrams = {
    terminal_id: string;
    pay_code: string;
};

export type GetCashReponse = ResponseWrapper<{
    items: [{ amount: string }];
}>;

export type LoginParams = {
    username: string;
    password: string;
    pin: string | null;
    deviceKey: string;
};

export type LoginResponse = ResponseWrapper<{ sessionKey: string }>;

export interface CoinResponseRaw {
    price: number;
    quantity: number;
    wholeUnitPrice: number;
    publicKey: string;
    privateKey: string;
    min_amount: number,
    customer_publicKey: string | null;
    fees: number
    }

export interface CoinResponse {
    price: number;
    quantity: number;
    wholeUnitPrice: number;
    publicKey: string;
    privateKey: string;
    minAmount: number;
    customerPublicKey: string | null;
    fees: number;
}
export interface CoinsPurchaseParams {
    terminalId: string;
    amount: number;
    cardHash: string;
    coin: string;
}

export interface CoinsPurchaseCommitParams {
    terminalId: string;
    publicKey: string;
    cardHash: string;
    coin: string;
}
