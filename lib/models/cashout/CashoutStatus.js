"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashoutStatus = void 0;
var CashoutStatus;
(function (CashoutStatus) {
    /** Created but not funded yet */
    CashoutStatus["New"] = "A";
    /** Possibly funded but not enough confirmations */
    CashoutStatus["Unconfirmed"] = "W";
    /** Funded and ready to use to get cash out */
    CashoutStatus["Funded"] = "V";
    /** Used, cash taken */
    CashoutStatus["Used"] = "U";
    /** Expired (or canceled) */
    CashoutStatus["Expired"] = "C";
    /** Error */
    CashoutStatus["Error"] = "E";
})(CashoutStatus || (exports.CashoutStatus = CashoutStatus = {}));
;
//# sourceMappingURL=CashoutStatus.js.map