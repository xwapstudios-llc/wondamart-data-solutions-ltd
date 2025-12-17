import {DataBundle} from "@common/types/data-bundle";

const testDataBundle: DataBundle = {
    commission: 0.15,

    dataPackage: {
        data: 10,
        minutes: 1000,
        sms: 1000
    },

    enabled: true,
    id: "mtn-7-days-10gb-1000min-1000sms",
    name: "JaMBo",
    network: "mtn",
    price: 25,
    validityPeriod: "7 Days"
}

export {
    testDataBundle
}