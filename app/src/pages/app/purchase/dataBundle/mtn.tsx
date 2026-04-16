import React, {useCallback, useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/cn/components/ui/tabs.tsx";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {DataBundles} from "@common/client-api/db-data-bundle.ts";
import BundlesView from "@/ui/components/views/BundlesView.tsx";
import {NoticeConstructor, type NoticeData,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";

const nonExpiryNotice: NoticeData = {
    heading: "IMPORTANT",
    subHeading: "Please Read Before Purchase",
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
    heading: "IMPORTANT",
    subHeading: "Please Read Before Purchase",
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
const verificationNotice: NoticeData = {
    heading: "IMPORTANT",
    subHeading: "Please Read Before Purchase",
    notices: [
        {
            title: "Premium Delivery",
            description:
                "All data purchases are instant or faster than normal delivery.",
        },
        {
            title: "One Time Verify",
            description: "This bundle requires a one-time verification for new numbers. Once verified, you can buy anytime without repeating the process."
        },
        {
            title: "Verified Number",
            description: "When you see “Verified Number”, request the SMS sent to the customer."
        },
        {
            title: "Tip",
            description: "Follow the tutorial video to complete verification."
        },
        {
            title: "Delivery",
            description: "Delivery is usually faster than normal process."
        }
    ],
};

const DataBundleMTN: React.FC = () => {
    // Use Effect to fetch MTN data bundles from an API could be added here
    const [expiry, setExpiry] = useState<DataBundle[]>([]);
    const [nonExpiry, setNoExpiry] = useState<DataBundle[]>([]);
    const [verification, setVerification] = useState<DataBundle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingExpiry, setLoadingExpiry] = useState<boolean>(false);
    const [loadingVerfiy, setLoadingVerfiy] = useState<boolean>(false);

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

    const fetchVerification = useCallback(async () => {
        if (settings && settings.enabled && settings.mtn.enabled) {
            setLoadingVerfiy(true);
            const res = await DataBundles.read({
                network: "mtn",
                validityPeriod: -1,
            });
            setVerification(res);
            setLoadingVerfiy(false);
        }
    }, [settings])

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
                        if (tab == "verification" && verification.length == 0)
                            await fetchVerification();
                    }}
                >
                    <TabsContent value={"non-expiry"}>
                        <NoticeConstructor className={"p-2"} collapsable notice={nonExpiryNotice}/>
                    </TabsContent>
                    <TabsContent value={"expiry"}>
                        <NoticeConstructor className={"p-2"} collapsable notice={expiryNotice}/>
                    </TabsContent>

                    <TabsContent value={"verification"}>
                        <NoticeConstructor className={"p-2"} collapsable notice={verificationNotice}/>
                    </TabsContent>

                    <TabsList className={"w-full sticky top-0 z-10 shadow-xl"}>
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
                        <TabsTrigger
                            value={"verification"}
                            className={
                                "data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black dark:data-[state=active]:border-mtn"
                            }
                        >
                            Verification
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={"non-expiry"}>
                        <BundlesView loading={loading} bundles={nonExpiry}/>
                    </TabsContent>
                    <TabsContent value={"expiry"}>
                        <BundlesView loading={loadingExpiry} bundles={expiry}/>
                    </TabsContent>
                    <TabsContent value={"verification"}>
                        <BundlesView loading={loadingVerfiy} bundles={verification}/>
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
