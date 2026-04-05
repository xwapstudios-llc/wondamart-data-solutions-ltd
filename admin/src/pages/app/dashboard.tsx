import React from 'react';
import Page from "@/ui/page/Page.tsx"
import PageHeading from "@/ui/page/PageHeading.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {DollarSignIcon, ShoppingBagIcon} from "lucide-react";
import ActivityHighlights from "@/ui/components/cards/dashboard/ActivityHighlightsV2.tsx";
import PWAAction from "@/ui/components/PWAAction.tsx";
import TxTableCardSync from "@/ui/components/TxTableCardSync.tsx";


const Dashboard: React.FC = () => {
    const {profile} = useAppStore();

    return (
        <Page className={"pt-2 space-y-4"}>
            <div className={"flex gap-4 justify-between"}>
                <div className={"flex gap-2 items-end"}>
                    <p className={"text-xl"}>Hello,</p>
                    <PageHeading>{profile?.firstName}</PageHeading>
                </div>
            </div>
            <PWAAction />

            {/*Activity*/}
            <ActivityHighlights className="mt-1" />

            {/*Recent Purchases*/}
            <TxTableCardSync
                title={"Recent Orders"}
                icon={<ShoppingBagIcon className="size-4" />}
                iconColor={"bg-violet-500"}
                txIds={profile?.recentTx || []}
                noItemsMessage="No recent orders"
            />
            <TxTableCardSync
                title={"Recent Transactions"}
                icon={<DollarSignIcon className="size-4" />}
                iconColor={"bg-rose-500"}
                txIds={profile?.recentTx || []}
                noItemsMessage="No recent transactions"
            />
        </Page>
    );
};

export default Dashboard;
