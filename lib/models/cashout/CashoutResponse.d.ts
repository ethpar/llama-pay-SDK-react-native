export default interface CashoutResponse {
    secure_code: string;
    pcode: null;
    status: 'A' | string;
    address: string;
    usd_amount: number;
    btc_amount: number;
    btc_whole_unit_price: number;
    expiration: string;
    atm_id: number;
    loc_description: string;
    loc_lat: number;
    loc_lon: number;
}
//# sourceMappingURL=CashoutResponse.d.ts.map