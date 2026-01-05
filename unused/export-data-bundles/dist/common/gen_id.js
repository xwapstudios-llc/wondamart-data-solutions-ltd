"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_bundle_id = gen_bundle_id;
function gen_bundle_id(d) {
    let id = `${d.network}-${d.validityPeriod == 0 ? "non-expiry" : d.validityPeriod + "-days"}`;
    if (d.dataPackage.data)
        id = id + `-${d.dataPackage.data}gb`;
    if (d.dataPackage.minutes)
        id = id + `-${d.dataPackage.minutes}min`;
    if (d.dataPackage.sms)
        id = id + `-${d.dataPackage.sms}sms`;
    return id;
}
//# sourceMappingURL=gen_id.js.map