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
