import React, {useCallback, useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/cn/components/ui/tabs.tsx";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {DataBundles} from "@common/client-api/db-data-bundle.ts";
import BundlesView from "@/ui/components/views/BundlesView.tsx";
import {NoticeConstructor, type NoticeData,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";

const nonExpiryNotice: NoticeData = {
    heading: "Important Notice",
    notices: [
        {
            title: "Turbonet, Broadband, Roaming & Company/Schools/Group Sim Cards",
            description:
                "These types of SIM cards do not support non-expiry data bundles.",
        },
        {
            title: "Order Intervals",
            description:
                "Intervals for placing orders for the same numbers should be 10mins.",
        },
        {
            title: "No Refunds",
            description:
                "No refunds will be issued for wrong transactions or incorrect phone numbers.",
        },
        {
            title: "Network Prefixes",
            description: "MTN (024, 025, 053-055, 059) or Potted MTN numbers.",
        },
        {
            title: "Delivery",
            description:
                "Data bundle delivery is not instant. Some numbers may receive data faster while others take some time.",
        },
    ],
};

const expiryNotice: NoticeData = {
    heading: "IMPORTANT: Please Read Before Purchase",
    notices: [
        {
            title: "Premium Delivery",
            description:
                "All data purchases are instant or faster than normal delivery.",
        },
        {
            title: "Expiry",
            description:
                "This data bundle expires on midnight of the purchase duration.",
        },
        {
            title: "No Refunds",
            description:
                "No refunds will be issued for wrong transactions or incorrect phone numbers.",
        },
        {
            title: "Network Prefixes",
            description: "MTN (024, 025, 053-055, 059) or Potted MTN numbers.",
        },
        {
            title: "Delivery",
            description:
                "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance.",
        },
    ],
};

const DataBundleMTN: React.FC = () => {
    // Use Effect to fetch MTN data bundles from an API could be added here
    const [expiry, setExpiry] = useState<DataBundle[]>([]);
    const [nonExpiry, setNoExpiry] = useState<DataBundle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingExpiry, setLoadingExpiry] = useState<boolean>(false);

    const {commonSettings} = useAppStore();
    const settings = commonSettings.dataBundles


    const fetchNonExpiry = useCallback(async () => {
        if (settings && settings.enabled && settings.mtn.enabled) {
            setLoading(true);
            const res = await DataBundles.read({
                network: "mtn",
                validityPeriod: 0,
            });
            setNoExpiry(res);
            setLoading(false);
        }
    }, [settings]);

    const fetchExpiry = useCallback(async () => {
        if (settings && settings.enabled && settings.mtn.enabled) {
            setLoadingExpiry(true);
            const res = await DataBundles.read({
                network: "mtn",
                validityPeriod: -1,
            });
            setExpiry(res);
            setLoadingExpiry(false);
        }
    }, [settings]);

    useEffect(() => {
        const run = () => {
            fetchNonExpiry().then();
        };

        if (settings && settings.enabled && settings.mtn.enabled) {
            run();
        }
    }, [fetchExpiry, fetchNonExpiry, settings]);

    if (settings && settings.enabled && settings.mtn.enabled)
        return (
            <div className={"space-y-4"}>
                <Tabs
                    className={"space-y-4"}
                    defaultValue={"non-expiry"}
                    onValueChange={async (tab) => {
                        if (tab == "expiry" && expiry.length == 0)
                            await fetchExpiry();
                        if (tab == "non-expiry" && nonExpiry.length == 0)
                            await fetchNonExpiry();
                    }}
                >
                    <TabsContent value={"non-expiry"}>
                        <NoticeConstructor notice={nonExpiryNotice}/>
                    </TabsContent>
                    <TabsContent value={"expiry"}>
                        <NoticeConstructor notice={expiryNotice}/>
                    </TabsContent>
                    <TabsList className={"w-full sticky top-16 z-10"}>
                        <TabsTrigger
                            value={"non-expiry"}
                            className={
                                "data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black dark:data-[state=active]:border-mtn"
                            }
                        >
                            Non Expiry
                        </TabsTrigger>
                        <TabsTrigger
                            value={"expiry"}
                            className={
                                "data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black dark:data-[state=active]:border-mtn"
                            }
                        >
                            Expiry
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={"non-expiry"}>
                        <BundlesView loading={loading} bundles={nonExpiry}/>
                    </TabsContent>
                    <TabsContent value={"expiry"}>
                        <BundlesView loading={loadingExpiry} bundles={expiry}/>
                    </TabsContent>
                </Tabs>
            </div>
        );
    else return (
        <DisabledNotice title={"MTN Bundles Unavailable"}>
            MTN bundle purchases are currently unavailable. Please come back later. <br/>
            For more information, please contact administrator.
        </DisabledNotice>
    );
};

export default DataBundleMTN;
