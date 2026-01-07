import React from "react";
import Page from "@/ui/page/Page.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {AdminDataBundles} from "@common/admin-api/db-data-bundle.ts";
import {wondamart_api_client} from "@common/lib/api-wondamart.ts";

const UserSettingsAccount: React.FC = () => {
    const initSettings = async () => {
        console.log("Sent Init Settings");
        const res = await wondamart_api_client("/admin/settings/init");
        console.log("Received res form Init Settings => ", res);
    }

    const init = () => {
        // @ts-ignore
        const dbs: DataBundle[] = [
            {
                "id": "airteltigo-30-days-10gb",
                "validityPeriod": 30,

                "price": 39,
                "dataPackage": {
                    "data": 10,
                },
                "name": "iSHARE",
                "commission": 0.39,
                "network": "airteltigo",
                "enabled": true,
            },
            {
                "id": "airteltigo-30-days-12gb",
                "validityPeriod": 30,

                "price": 46.5,
                "dataPackage": {
                    "data": 12,
                },
                "name": "iSHARE",
                "commission": 0.45,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-15gb",
                "validityPeriod": 30,

                "price": 58,
                "dataPackage": {
                    "data": 15,
                },
                "name": "iSHARE",
                "commission": 0.55,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-1gb",
                "validityPeriod": 30,

                "dataPackage": {
                    "data": 1,
                },
                "name": "iSHARE",
                "commission": 0.04,
                "enabled": true,
                "network": "airteltigo",
                "price": 3.99,
            },
            {
                "id": "airteltigo-30-days-2gb",
                "validityPeriod": 30,

                "price": 8,
                "dataPackage": {
                    "data": 2,
                },
                "name": "iSHARE",
                "commission": 0.08,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-3gb",
                "validityPeriod": 30,

                "price": 12,
                "dataPackage": {
                    "data": 3,
                },
                "name": "iSHARE",
                "commission": 0.12,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-4gb",
                "validityPeriod": 30,

                "price": 16,
                "dataPackage": {
                    "data": 4,
                },
                "name": "iSHARE",
                "commission": 0.16,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-5gb",
                "validityPeriod": 30,

                "price": 20,
                "dataPackage": {
                    "data": 5,
                },
                "name": "iSHARE",
                "commission": 0.2,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-6gb",
                "validityPeriod": 30,

                "price": 24,
                "dataPackage": {
                    "data": 6,
                },
                "name": "iSHARE",
                "commission": 0.24,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-7gb",
                "validityPeriod": 30,

                "price": 28,
                "dataPackage": {
                    "data": 7,
                },
                "name": "iSHARE",
                "commission": 0.28,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-30-days-8gb",
                "validityPeriod": 30,

                "price": 32,
                "dataPackage": {
                    "data": 8,
                },
                "name": "iSHARE",
                "commission": 0.32,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-100gb",
                "validityPeriod": 0,

                "price": 175,
                "dataPackage": {
                    "data": 100,
                },
                "name": "BiG TiMe",
                "commission": 1,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-200gb",
                "validityPeriod": 0,

                "price": 340,
                "dataPackage": {
                    "data": 200,
                },
                "name": "BiG TiMe",
                "commission": 1.5,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-30gb",
                "validityPeriod": 0,

                "price": 75,
                "dataPackage": {
                    "data": 30,
                },
                "name": "BiG TiMe",
                "commission": 0.6,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-40gb",
                "validityPeriod": 0,

                "price": 89,
                "dataPackage": {
                    "data": 40,
                },
                "name": "BiG TiMe",
                "commission": 0.65,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-50gb",
                "validityPeriod": 0,

                "price": 99,
                "dataPackage": {
                    "data": 50,
                },
                "name": "BiG TiMe",
                "commission": 0.7,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-60gb",
                "validityPeriod": 0,

                "price": 125,
                "dataPackage": {
                    "data": 60,
                },
                "name": "BiG TiMe",
                "commission": 0.75,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-70gb",
                "validityPeriod": 0,

                "price": 140,
                "dataPackage": {
                    "data": 70,
                },
                "name": "BiG TiMe",
                "commission": 0.8,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "airteltigo-non-expiry-80gb",
                "validityPeriod": 0,

                "price": 155,
                "dataPackage": {
                    "data": 80,
                },
                "name": "BiG TiMe",
                "commission": 0.85,
                "enabled": true,
                "network": "airteltigo",
            },
            {
                "id": "mtn-1-days-10gb-500min-500sms",
                "validityPeriod": 1,

                "price": 19,
                "dataPackage": {
                    "data": 10,
                    "minutes": 500,
                    "sms": 500
                },
                "name": "JaMBo",
                "commission": 0.1,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-1-days-2gb-80min-100sms",
                "validityPeriod": 1,

                "price": 3.8,
                "dataPackage": {
                    "data": 2,
                    "minutes": 80,
                    "sms": 100
                },
                "name": "JaMBo",
                "commission": 0.02,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-1-days-4gb-160min-200sms",
                "validityPeriod": 1,

                "price": 7.6,
                "dataPackage": {
                    "data": 4,
                    "minutes": 160,
                    "sms": 200
                },
                "name": "JaMBo",
                "commission": 0.04,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-1-days-6gb-250min-310sms",
                "validityPeriod": 1,

                "price": 11.5,
                "dataPackage": {
                    "data": 6,
                    "minutes": 250,
                    "sms": 310
                },
                "name": "JaMBo",
                "commission": 0.06,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-1-days-8gb-340min-390sms",
                "validityPeriod": 1,

                "price": 15,
                "dataPackage": {
                    "data": 8,
                    "minutes": 340,
                    "sms": 390
                },
                "name": "JaMBo",
                "commission": 0.08,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-10gb-1000min-1000sms",
                "validityPeriod": 7,

                "price": 25,
                "dataPackage": {
                    "data": 10,
                    "minutes": 1000,
                    "sms": 1000
                },
                "name": "JaMBo",
                "commission": 0.15,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-15gb-1500min-1500sms",
                "validityPeriod": 7,

                "price": 38,
                "dataPackage": {
                    "data": 15,
                    "minutes": 1500,
                    "sms": 1500
                },
                "name": "JaMBo",
                "commission": 0.2,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-20gb-2000min-2000sms",
                "validityPeriod": 7,

                "price": 50,
                "dataPackage": {
                    "data": 20,
                    "minutes": 2000,
                    "sms": 2000
                },
                "name": "JaMBo",
                "commission": 0.25,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-25gb-2500min-2500sms",
                "validityPeriod": 7,

                "price": 60,
                "dataPackage": {
                    "data": 25,
                    "minutes": 2500,
                    "sms": 2500
                },
                "name": "JaMBo",
                "commission": 0.3,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-30gb-3000min-3000sms",
                "validityPeriod": 7,

                "price": 75,
                "dataPackage": {
                    "data": 30,
                    "minutes": 3000,
                    "sms": 3000
                },
                "name": "JaMBo",
                "commission": 0.35,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-7-days-5gb-500min-500sms",
                "validityPeriod": 7,

                "price": 15,
                "dataPackage": {
                    "data": 5,
                    "minutes": 500,
                    "sms": 500
                },
                "name": "JaMBo",
                "commission": 0.1,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-100gb",
                "validityPeriod": 0,

                "price": 367,
                "dataPackage": {
                    "data": 100,
                },
                "name": "MTNUP2U ",
                "commission": 1.2,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-10gb",
                "validityPeriod": 0,

                "price": 42,
                "dataPackage": {
                    "data": 10,
                },
                "name": "MTNUP2U ",
                "commission": 0.5,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-15gb",
                "validityPeriod": 0,

                "price": 62,
                "dataPackage": {
                    "data": 15,
                },
                "name": "MTNUP2U ",
                "commission": 0.55,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-1gb",
                "validityPeriod": 0,

                "price": 4.5,
                "dataPackage": {
                    "data": 1,
                },
                "name": "MTNUP2U ",
                "commission": 0.05,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-20gb",
                "validityPeriod": 0,

                "price": 80.5,
                "dataPackage": {
                    "data": 20,
                },
                "name": "MTNUP2U ",
                "commission": 0.6,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-25gb",
                "validityPeriod": 0,

                "price": 101,
                "dataPackage": {
                    "data": 25,
                },
                "name": "MTNUP2U ",
                "commission": 0.7,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-2gb",
                "validityPeriod": 0,

                "price": 9,
                "dataPackage": {
                    "data": 2,
                },
                "name": "MTNUP2U ",
                "commission": 0.1,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-30gb",
                "validityPeriod": 0,

                "price": 120,
                "dataPackage": {
                    "data": 30,
                },
                "name": "MTNUP2U ",
                "commission": 0.75,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-3gb",
                "validityPeriod": 0,

                "price": 13.5,
                "dataPackage": {
                    "data": 3,
                },
                "name": "MTNUP2U ",
                "commission": 0.15,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-40gb",
                "validityPeriod": 0,

                "price": 160,
                "dataPackage": {
                    "data": 40,
                },
                "name": "MTNUP2U ",
                "commission": 0.8,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-4gb",
                "validityPeriod": 0,

                "price": 18,
                "dataPackage": {
                    "data": 4,
                },
                "name": "MTNUP2U ",
                "commission": 0.2,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-50gb",
                "validityPeriod": 0,

                "price": 190,
                "dataPackage": {
                    "data": 50,
                },
                "name": "MTNUP2U ",
                "commission": 0.85,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-5gb",
                "validityPeriod": 0,

                "price": 22.5,
                "dataPackage": {
                    "data": 5,
                },
                "name": "MTNUP2U ",
                "commission": 0.25,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-6gb",
                "validityPeriod": 0,

                "price": 27,
                "dataPackage": {
                    "data": 6,
                },
                "name": "MTNUP2U ",
                "commission": 0.3,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "mtn-non-expiry-8gb",
                "validityPeriod": 0,

                "price": 35,
                "dataPackage": {
                    "data": 8,
                },
                "name": "MTNUP2U ",
                "commission": 0.4,
                "enabled": true,
                "network": "mtn",
            },
            {
                "id": "telecel-non-expiry-100gb",
                "validityPeriod": 0,

                "price": 370,
                "dataPackage": {
                    "data": 100,
                },
                "name": "TELECEL BUNDLE",
                "commission": 1,
                "network": "telecel",
                "enabled": true,
            },
            {
                "id": "telecel-non-expiry-10gb",
                "validityPeriod": 0,
                "price": 38.5,
                "dataPackage": {
                    "data": 10,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.4,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-15gb",
                "validityPeriod": 0,
                "price": 57.5,
                "dataPackage": {
                    "data": 15,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.45,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-20gb",
                "validityPeriod": 0,
                "price": 75.5,
                "dataPackage": {
                    "data": 20,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.5,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-25gb",
                "validityPeriod": 0,
                "price": 95,
                "dataPackage": {
                    "data": 25
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.55,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-30gb",
                "validityPeriod": 0,
                "price": 114,
                "dataPackage": {
                    "data": 30,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.6,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-35gb",
                "validityPeriod": 0,
                "price": 130,
                "dataPackage": {
                    "data": 35,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.65,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-40gb",
                "validityPeriod": 0,

                "price": 150,
                "dataPackage": {
                    "data": 40,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.7,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-50gb",
                "validityPeriod": 0,

                "price": 182,
                "dataPackage": {
                    "data": 50,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.8,
                "enabled": true,
                "network": "telecel",
            },
            {
                "id": "telecel-non-expiry-5gb",
                "validityPeriod": 0,

                "dataPackage": {
                    "data": 5,
                },
                "name": "TELECEL BUNDLE",
                "commission": 0.2,
                "enabled": true,
                "network": "telecel",
                "price": 21,
            }
        ]

        dbs.forEach(async (db) => {
            try {
                await AdminDataBundles.create(db);
                console.log("Creating > ", db.id);
            } catch (err) {
                console.error(err);
            }
        })
    }

    const firstAdmin = async () => {
        await wondamart_api_client(
            "/admin/first-admin"
        )
    }

    return (
        <Page>
            UserSettingsAccount
            <Button onClick={initSettings}>
                init Settings
            </Button>

            <Button onClick={init}>
                Init Data bundles
            </Button>

            <Button onClick={firstAdmin}>
                First Admin
            </Button>

        </Page>
    )
}

export default UserSettingsAccount;