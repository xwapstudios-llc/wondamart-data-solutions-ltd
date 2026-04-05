import React from 'react';
import Page from "@/ui/page/Page.tsx"
import PageHeading from "@/ui/page/PageHeading.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Button, buttonVariants} from "@/cn/components/ui/button.tsx";
import {BellIcon, DollarSignIcon, PackageXIcon, PlusCircleIcon, ShoppingBagIcon, WalletIcon} from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";
import {Link, useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {cn} from "@/cn/lib/utils.ts";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";
import ActivityHighlights from "@/ui/components/cards/dashboard/ActivityHighlightsV2.tsx";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import PWAAction from "@/ui/components/PWAAction.tsx";
import TxTableCardSync from "@/ui/components/TxTableCardSync.tsx";

const Dashboard: React.FC = () => {
    const {profile, wallet, claims} = useAppStore();
    const navigate = useNavigate();

    return (
        <Page className={"pt-2 space-y-4"}>
            <div className={"flex gap-4 justify-between"}>
                <div className={"flex gap-2 items-end"}>
                    <p className={"text-xl"}>Hello,</p>
                    <PageHeading>{profile?.firstName}</PageHeading>
                </div>
                {/*Ernest said notifications should be only for general or high priority notices.*/}
                {/*Todo: Main instant notification on open.*/}
                <Link
                    to={R.app.notifications}
                    className={cn(
                        buttonVariants({size: "icon-lg", variant: "outline"}),
                        "rounded-full"
                    )}
                >
                    <BellIcon strokeWidth={1.5}/>
                </Link>
            </div>
            <PWAAction />
            {/* Balance card */}
            <div className="rounded-xl bg-linear-to-br from-wondamart/80 to-wondamart p-5 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-md bg-white/20">
                            <WalletIcon className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs opacity-75">Wallet Balance</p>
                            <p className="text-2xl font-bold tracking-tight">
                                {toCurrency(wallet?.balance ?? 0)}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(R.app.deposit)}
                        size="sm"
                        className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5"
                        variant="outline"
                    >
                        <PlusCircleIcon className="size-4" />
                        Deposit
                    </Button>
                </div>
                <p className="text-xs opacity-70 mt-1">Funds available in your wallet</p>
            </div>

            {
                claims?.isActivated ? (
                    <>
                        {/*Activity*/}
                        <ActivityHighlights className="mt-1" />

                        {/*Recent Purchases*/}
                        <DashboardSection
                            title={"Recents"}
                            link={{to: R.app.history.purchases.index, label: "See all"}}
                            className={"space-y-4 pt-4"}
                        >
                            <TxTableCardSync
                                title={"Recent Purchases"}
                                icon={<ShoppingBagIcon className="size-4" />}
                                iconColor={"bg-violet-500"}
                                txIds={profile?.recentTx || []}
                                noItemsMessage="No recent purchases"
                            />
                            <TxTableCardSync
                                title={"Recent Transactions"}
                                icon={<DollarSignIcon className="size-4" />}
                                iconColor={"bg-rose-500"}
                                txIds={profile?.recentTx || []}
                                noItemsMessage="No recent transactions"
                            />
                        </DashboardSection>
                    </>
                ) : (
                    <ActivationCard
                        className={"w-full md:w-lg"}
                        Icon={PackageXIcon}
                        title={"Account Activation"}
                        cta={{label: "Go to Activation", action: () => navigate(R.app.user.activate)}}
                    >
                        You are not activated to use wondamart services.
                    </ActivationCard>
                )
            }
        </Page>
    );
};

export default Dashboard;
