"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txType = exports.txTypes = exports.txStatus = void 0;
exports.txPrefix = txPrefix;
exports.getTxTypeFromTxID = getTxTypeFromTxID;
exports.txStatus = [
    "pending",
    "processing",
    "completed",
    "failed",
    // "canceled" // TODO: Add a canceled
];
exports.txTypes = [
    "data-bundle",
    "afa-bundle",
    "result-checker",
    "user-registration",
    "deposit",
];
exports.txType = {
    dataBundle: "data-bundle",
    afaBundle: "afa-bundle",
    resultChecker: "result-checker",
    userRegistration: "user-registration",
    deposit: "deposit",
};
function txPrefix(type) {
    switch (type) {
        case "afa-bundle": return "af_";
        case "data-bundle": return "db_";
        case "user-registration": return "ur_";
        case "result-checker": return "rc_";
        case "deposit": return "dp_";
        default: return "tx_";
    }
}
function getTxTypeFromTxID(txID) {
    if (txID.startsWith("af_"))
        return exports.txType.afaBundle;
    if (txID.startsWith("db_"))
        return exports.txType.dataBundle;
    if (txID.startsWith("ur_"))
        return exports.txType.userRegistration;
    if (txID.startsWith("rc_"))
        return exports.txType.resultChecker;
    if (txID.startsWith("dp_"))
        return exports.txType.deposit;
    else
        return "tx";
}
//# sourceMappingURL=tx.js.map