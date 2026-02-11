export declare enum CashoutStatus {
    /** Created but not funded yet */
    New = "A",
    /** Possibly funded but not enough confirmations */
    Unconfirmed = "W",
    /** Funded and ready to use to get cash out */
    Funded = "V",
    /** Used, cash taken */
    Used = "U",
    /** Expired (or canceled) */
    Expired = "C",
    /** Error */
    Error = "E"
}
//# sourceMappingURL=CashoutStatus.d.ts.map