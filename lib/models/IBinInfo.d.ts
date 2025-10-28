export type BinInfo = {
    number?: {
        length: number;
        luhn: boolean;
    };
    scheme?: string;
    type?: string;
    brand?: string;
    country?: {
        numeric: string;
        alpha2: string;
        name: string;
        emoji: string;
        currency: string;
        latitude: number;
        longitude: number;
    };
    bank?: {
        name: string;
        url?: string;
        phone?: string;
        city?: string;
    };
};
//# sourceMappingURL=IBinInfo.d.ts.map