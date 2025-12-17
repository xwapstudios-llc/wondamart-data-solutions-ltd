import React, {useCallback, useEffect, useState} from "react";
import type {DataBundle} from "@common/types/data-bundle";
import {DataBundles} from "@common/client-api/db-data-bundle";
import BundlesView from "@/ui/components/views/BundlesView";
import {NoticeConstructor, type NoticeData,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";

const notice: NoticeData = {
    heading: "IMPORTANT: Please Read Before Purchase",
    notices: [
        {
            title: "Premium Delivery",
            description: "All data purchases are either instant or faster than normal delivery.",
        },
        {
            title: "No Refunds",
            description:
                "No refunds will be issued for wrong transactions or incorrect phone numbers.",
        },
        {
            title: "AirtelTigo Numbers Only",
            description:
                "Works with prefixes 026, 056, 027, 057, 023, 053. Or Potted AT numbers.",
        },
        {
            title: "Confirmation of Delivery",
            description:
                "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance.",
        },
    ],
};

const DataBundleAirtelTigo: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [bundles, setBundles] = useState<DataBundle[]>([]);

    const {commonSettings} = useAppStore();
    const settings = commonSettings.dataBundles

    const fetchBundles = useCallback(async () => {
        if (settings && settings.enabled && settings.airteltigo.enabled) {
            setLoading(true);
            const res = await DataBundles.readByNetwork("airteltigo");
            setBundles(res);
            setLoading(false);
        }
    }, [settings]);

    useEffect(() => {
        const run = () => {
            fetchBundles().then();
        };
        if (settings && settings.enabled && settings.airteltigo.enabled) {
            run();
        }
    }, [fetchBundles, settings]);


    if (settings && settings.enabled && settings.airteltigo.enabled)
        return (
            <div className={"space-y-4"}>
                <NoticeConstructor notice={notice}/>
                <BundlesView loading={loading} bundles={bundles}/>
            </div>
        );
    else return (
        <DisabledNotice title={"AirtelTigo Bundles Unavailable"}>
            AirtelTigo bundle purchases are currently unavailable. Please come back later. <br/>
            For more information, please contact administrator.
        </DisabledNotice>
    );
};

export default DataBundleAirtelTigo;
