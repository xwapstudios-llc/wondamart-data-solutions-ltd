import React, {useCallback, useEffect, useState} from "react";
import type {DataBundle} from "@common/types/data-bundle";
import {DataBundles} from "@common/client-api/db-data-bundle";
import BundlesView from "@/ui/components/views/BundlesView";
import {NoticeConstructor, type NoticeData,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";

const notice: NoticeData = {
    heading: "Important Notice",
    notices: [
        {
            title: "Delivery",
            description:
                "Data bundle delivery is not instant. Some numbers may receive data faster while others take some time.",
        },
        {
            title: "No Refunds",
            description:
                "No refunds will be issued for wrong transactions or incorrect phone numbers.",
        },
        {
            title: "Network Prefixes",
            description:
                "Telecel (020, 050), or Potted Telecel numbers.",
        },
        {
            title: "Confirmation of Delivery",
            description:
                "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance.",
        },
    ],
};


const DataBundleTelecel: React.FC = () => {
    const [bundles, setBundles] = useState<DataBundle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const {commonSettings} = useAppStore();
    const settings = commonSettings.dataBundles


    const fetchBundles = useCallback(async () => {
        if (settings && settings.enabled && settings.telecel.enabled) {
            setLoading(true);
            const res = await DataBundles.readByNetwork("telecel");
            setBundles(res);
            setLoading(false);
        }
    }, [settings]);

    useEffect(() => {
        const run = () => {
            fetchBundles().then();
        };
        if (settings && settings.enabled && settings.telecel.enabled) {
            run();
        }
    }, [fetchBundles, settings]);


    if (settings && settings.enabled && settings.telecel.enabled)
        return (
            <div className={"space-y-4"}>
                <NoticeConstructor notice={notice}/>
                <BundlesView loading={loading} bundles={bundles}/>
            </div>
        );
    else return (
        <DisabledNotice title={"Telecel Bundles Unavailable"}>
            Telecel bundle purchases are currently unavailable. Please come back later. <br/>
            For more information, please contact administrator.
        </DisabledNotice>
    );
};

export default DataBundleTelecel;
