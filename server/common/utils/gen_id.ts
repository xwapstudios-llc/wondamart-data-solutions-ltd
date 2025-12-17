import {AdminNewDataBundle} from "@common/types/data-bundle";

export
function gen_bundle_id(d: AdminNewDataBundle): string {
    let id = `${d.network}-${d.validityPeriod == 0 ? "non-expiry" : d.validityPeriod+"-days"}`;
    if (d.dataPackage.data) id = id + `-${d.dataPackage.data}gb`;
    if (d.dataPackage.minutes) id = id + `-${d.dataPackage.minutes}min`;
    if (d.dataPackage.sms) id = id + `-${d.dataPackage.sms}sms`;
    return id;
}