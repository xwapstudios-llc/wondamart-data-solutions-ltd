import React, {useCallback, useEffect, useState} from 'react';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import WondaButton from "@/ui/components/buttons/WondaButton.tsx";
import {R} from "@/app/routes.ts";
import {useSidebar} from "@/cn/components/ui/sidebar.tsx";
import PageHeader from "@/ui/page/PageHeader.tsx";
import {NoticeConstructor, type NoticeData} from "@/ui/components/typography/Notice.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/cn/components/ui/tabs.tsx";
import BundlesView from "@/ui/components/views/BundlesView.tsx";
import DisabledNotice from "@/ui/components/cards/DisabledNotice.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {DataBundles} from "@common/client-api/db-data-bundle.ts";
import type {DataBundle, NetworkId} from "@common/types/data-bundle.ts";

// ─── Notices ────────────────────────────────────────────────────────────────

const mtnNonExpiryNotice: NoticeData = {
    heading: "IMPORTANT", subHeading: "Please Read Before Purchase",
    notices: [
        {title: "Turbonet, Broadband, Roaming & Company/Schools/Group Sim Cards", description: "These types of SIM cards do not support non-expiry data bundles."},
        {title: "Order Intervals", description: "Intervals for placing orders for the same numbers should be 10mins."},
        {title: "No Refunds", description: "No refunds will be issued for wrong transactions or incorrect phone numbers."},
        {title: "Network Prefixes", description: "MTN (024, 025, 053-055, 059) or Potted MTN numbers."},
        {title: "Delivery", description: "Data bundle delivery is not instant. Some numbers may receive data faster while others take some time."},
    ],
};

const mtnExpiryNotice: NoticeData = {
    heading: "IMPORTANT", subHeading: "Please Read Before Purchase",
    notices: [
        {title: "Premium Delivery", description: "All data purchases are instant or faster than normal delivery."},
        {title: "Expiry", description: "This data bundle expires on midnight of the purchase duration."},
        {title: "No Refunds", description: "No refunds will be issued for wrong transactions or incorrect phone numbers."},
        {title: "Network Prefixes", description: "MTN (024, 025, 053-055, 059) or Potted MTN numbers."},
        {title: "Delivery", description: "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance."},
    ],
};

const mtnVerificationNotice: NoticeData = {
    heading: "IMPORTANT", subHeading: "Please Read Before Purchase",
    notices: [
        {title: "Premium Delivery", description: "All data purchases are instant or faster than normal delivery."},
        {title: "One Time Verify", description: "This bundle requires a one-time verification for new numbers. Once verified, you can buy anytime without repeating the process."},
        {title: "Verified Number", description: "When you see \"Verified Number\", request the SMS sent to the customer."},
        {title: "Tip", description: "Follow the tutorial video to complete verification."},
        {title: "Delivery", description: "Delivery is usually faster than normal process."},
    ],
};

const telecelNotice: NoticeData = {
    heading: "IMPORTANT", subHeading: "Please Read Before Purchase",
    notices: [
        {title: "Delivery", description: "Data bundle delivery is not instant. Some numbers may receive data faster while others take some time."},
        {title: "No Refunds", description: "No refunds will be issued for wrong transactions or incorrect phone numbers."},
        {title: "Network Prefixes", description: "Telecel (020, 050), or Potted Telecel numbers."},
        {title: "Confirmation of Delivery", description: "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance."},
    ],
};

const airteltigoNotice: NoticeData = {
    heading: "IMPORTANT", subHeading: "Please Read Before Purchase",
    notices: [
        {title: "Premium Delivery", description: "All data purchases are either instant or faster than normal delivery."},
        {title: "No Refunds", description: "No refunds will be issued for wrong transactions or incorrect phone numbers."},
        {title: "AirtelTigo Numbers Only", description: "Works with prefixes 026, 056, 027, 057, 023, 053. Or Potted AT numbers."},
        {title: "Confirmation of Delivery", description: "May or May-not received a message when data is delivered. Tell your customer, reps, and subs to confirm by checking their balance."},
    ],
};

// ─── MTN View ────────────────────────────────────────────────────────────────

const MTNBundles: React.FC = () => {
    const [nonExpiry, setNonExpiry] = useState<DataBundle[]>([]);
    const [expiry, setExpiry] = useState<DataBundle[]>([]);
    const [verification, setVerification] = useState<DataBundle[]>([]);
    const [loadingNonExpiry, setLoadingNonExpiry] = useState(false);
    const [loadingExpiry, setLoadingExpiry] = useState(false);
    const [loadingVerification, setLoadingVerification] = useState(false);

    const fetchNonExpiry = useCallback(async () => {
        if (nonExpiry.length > 0) return;
        setLoadingNonExpiry(true);
        setNonExpiry(await DataBundles.read({network: "mtn", validityPeriod: 0}));
        setLoadingNonExpiry(false);
    }, [nonExpiry.length]);

    const fetchExpiry = useCallback(async () => {
        if (expiry.length > 0) return;
        setLoadingExpiry(true);
        setExpiry(await DataBundles.read({network: "mtn", validityPeriod: -1}));
        setLoadingExpiry(false);
    }, [expiry.length]);

    const fetchVerification = useCallback(async () => {
        if (verification.length > 0) return;
        setLoadingVerification(true);
        setVerification(await DataBundles.read({network: "mtn", validityPeriod: -1}));
        setLoadingVerification(false);
    }, [verification.length]);

    useEffect(() => { fetchNonExpiry().then(); }, [fetchNonExpiry]);

    return (
        <Tabs className={"space-y-4"} defaultValue={"non-expiry"} onValueChange={async (tab) => {
            if (tab === "expiry") await fetchExpiry();
            if (tab === "non-expiry") await fetchNonExpiry();
            if (tab === "verification") await fetchVerification();
        }}>
            <TabsContent value={"non-expiry"}>
                <NoticeConstructor className={"p-2"} collapsable notice={mtnNonExpiryNotice}/>
            </TabsContent>
            <TabsContent value={"expiry"}>
                <NoticeConstructor className={"p-2"} collapsable notice={mtnExpiryNotice}/>
            </TabsContent>
            <TabsContent value={"verification"}>
                <NoticeConstructor className={"p-2"} collapsable notice={mtnVerificationNotice}/>
            </TabsContent>

            <TabsList className={"w-full sticky top-0 z-10 shadow-xl"}>
                <TabsTrigger value={"non-expiry"} className={"data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black"}>Non Expiry</TabsTrigger>
                <TabsTrigger value={"expiry"} className={"data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black"}>Expiry</TabsTrigger>
                <TabsTrigger value={"verification"} className={"data-[state=active]:bg-mtn dark:data-[state=active]:bg-mtn data-[state=active]:text-black dark:data-[state=active]:text-black"}>Verification</TabsTrigger>
            </TabsList>

            <TabsContent value={"non-expiry"}><BundlesView loading={loadingNonExpiry} bundles={nonExpiry}/></TabsContent>
            <TabsContent value={"expiry"}><BundlesView loading={loadingExpiry} bundles={expiry}/></TabsContent>
            <TabsContent value={"verification"}><BundlesView loading={loadingVerification} bundles={verification}/></TabsContent>
        </Tabs>
    );
};

// ─── Simple Network View (Telecel / AirtelTigo) ───────────────────────────────

interface SimpleBundlesProps {
    network: NetworkId;
    notice: NoticeData;
}

const SimpleBundles: React.FC<SimpleBundlesProps> = ({network, notice}) => {
    const [bundles, setBundles] = useState<DataBundle[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        DataBundles.readByNetwork(network).then((res) => {
            setBundles(res);
            setLoading(false);
        });
    }, [network]);

    return (
        <div className={"space-y-4"}>
            <NoticeConstructor className={"p-2"} collapsable notice={notice}/>
            <BundlesView loading={loading} bundles={bundles}/>
        </div>
    );
};

// ─── Index ────────────────────────────────────────────────────────────────────

const DataBundleIndex: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {isMobile} = useSidebar();
    const {commonSettings} = useAppStore();
    const settings = commonSettings.dataBundles;

    const network = (searchParams.get("network") ?? "mtn") as NetworkId;

    const networkEnabled: Record<NetworkId, boolean> = {
        mtn: settings?.enabled && settings.mtn.enabled,
        telecel: settings?.enabled && settings.telecel.enabled,
        airteltigo: settings?.enabled && settings.airteltigo.enabled,
    };

    const renderBundles = () => {
        if (!networkEnabled[network]) return (
            <DisabledNotice title={`${network.charAt(0).toUpperCase() + network.slice(1)} Bundles Unavailable`}>
                {network} bundle purchases are currently unavailable. Please come back later. <br/>
                For more information, please contact administrator.
            </DisabledNotice>
        );

        if (network === "mtn") return <MTNBundles/>;
        if (network === "telecel") return <SimpleBundles network="telecel" notice={telecelNotice}/>;
        if (network === "airteltigo") return <SimpleBundles network="airteltigo" notice={airteltigoNotice}/>;
    };

    return (
        <Page>
            <PageHeader title={"Data Bundles"} subtitle={"Choose a network and bundle."}/>

            <PageContent>
                <div className={`flex gap-4 justify-between mb-4 ${!isMobile && "max-w-2xl"}`}>
                    <WondaButton
                        className={network === "mtn" ? "outline-2 outline-mtn outline-offset-4 rounded-md" : ""}
                        imgSrc={"/network/mtn.png"} size={80}
                        onClick={() => navigate(R.app.purchase.dataBundle.mtn, {replace: true})}
                    />
                    <WondaButton
                        className={network === "telecel" ? "outline-2 outline-telecel outline-offset-4 rounded-md" : ""}
                        imgSrc={"/network/telecel.png"} size={80}
                        onClick={() => navigate(R.app.purchase.dataBundle.telecel, {replace: true})}
                    />
                    <WondaButton
                        className={network === "airteltigo" ? "outline-2 outline-airteltigo outline-offset-4 rounded-md" : ""}
                        imgSrc={"/network/airteltigo.png"} size={80}
                        onClick={() => navigate(R.app.purchase.dataBundle.airtelTigo, {replace: true})}
                    />
                </div>
                {renderBundles()}
            </PageContent>
        </Page>
    );
};

export default DataBundleIndex;
