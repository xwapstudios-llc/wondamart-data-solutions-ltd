import type {AdminNewDataBundle} from "@common/types/data-bundle.ts";
import {DataBundleFn} from "@common-server/fn/data-bundle/data-bundle-fn";
import {RouteHandler, sendResponse} from "@common-server/express";
import {httpResponse} from "@common/types/request";

const newBundles: AdminNewDataBundle[] = [
    {
        "validityPeriod": 0,
        "price": 3.99,
        "dataPackage": {
            "data": 1,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 8.00,
        "dataPackage": {
            "data": 2,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 12.00,
        "dataPackage": {
            "data": 3,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 15.99,
        "dataPackage": {
            "data": 4,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 19.95,
        "dataPackage": {
            "data": 5,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 23.90,
        "dataPackage": {
            "data": 6,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 27.90,
        "dataPackage": {
            "data": 7,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 31.95,
        "dataPackage": {
            "data": 8,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 39.75,
        "dataPackage": {
            "data": 10,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 47.85,
        "dataPackage": {
            "data": 12,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 59.99,
        "dataPackage": {
            "data": 15,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 63.45,
        "dataPackage": {
            "data": 20,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 68.50,
        "dataPackage": {
            "data": 25,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 75.00,
        "dataPackage": {
            "data": 30,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 87.00,
        "dataPackage": {
            "data": 40,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 98.00,
        "dataPackage": {
            "data": 50,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 111.00,
        "dataPackage": {
            "data": 60,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 127.00,
        "dataPackage": {
            "data": 70,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 151.00,
        "dataPackage": {
            "data": 80,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 171.00,
        "dataPackage": {
            "data": 100,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 338.00,
        "dataPackage": {
            "data": 200,
        },
        "name": "iSHARE",
        "commission": 0.19,
        "network": "airteltigo",
        "enabled": true
    },

    {
        "validityPeriod": 0,
        "price": 4.50,
        "dataPackage": {
            "data": 1,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 9.00,
        "dataPackage": {
            "data": 2,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 13.40,
        "dataPackage": {
            "data": 3,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 17.90,
        "dataPackage": {
            "data": 4,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 22.25,
        "dataPackage": {
            "data": 5,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 26.60,
        "dataPackage": {
            "data": 6,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 31.00,
        "dataPackage": {
            "data": 7,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 35.15,
        "dataPackage": {
            "data": 8,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 41.50,
        "dataPackage": {
            "data": 10,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 49.95,
        "dataPackage": {
            "data": 12,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 61.80,
        "dataPackage": {
            "data": 15,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 80.46,
        "dataPackage": {
            "data": 20,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 99.95,
        "dataPackage": {
            "data": 25,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 120.00,
        "dataPackage": {
            "data": 30,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 158.00,
        "dataPackage": {
            "data": 40,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 192.00,
        "dataPackage": {
            "data": 50,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 368.00,
        "dataPackage": {
            "data": 100,
        },
        "name": "MTNUP2U ",
        "commission": 0.19,
        "network": "mtn",
        "enabled": true
    },

    {
        "validityPeriod": 0,
        "price": 20.99,
        "dataPackage": {
            "data": 5,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 38.50,
        "dataPackage": {
            "data": 10,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 57.40,
        "dataPackage": {
            "data": 15,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 75.50,
        "dataPackage": {
            "data": 20,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 93.00,
        "dataPackage": {
            "data": 25,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 110.00,
        "dataPackage": {
            "data": 30,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 146.00,
        "dataPackage": {
            "data": 40,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 180.00,
        "dataPackage": {
            "data": 50,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    },
    {
        "validityPeriod": 0,
        "price": 354.20,
        "dataPackage": {
            "data": 100,
        },
        "name": "TELECEL BUNDLE",
        "commission": 0.19,
        "network": "telecel",
        "enabled": true
    }
]

export const publishNewBundles: RouteHandler = async (req, res) => {
    for (const bundle of newBundles) {
        try {
            await DataBundleFn.create(bundle);
        } catch (error) {
            console.error("Error creating data bundle:", error);
            sendResponse(res, httpResponse(
                "error",
                "An unexpected error occurred while creating data bundle. Please try again."
            ))
        }
        console.log("Saving data bundle", bundle.network +" "+bundle.dataPackage.data);
    }
    res.send("Successfully published new bundles");
}