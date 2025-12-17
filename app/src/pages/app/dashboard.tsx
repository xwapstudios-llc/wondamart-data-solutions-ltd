import React from 'react';
import Page from "@/ui/page/Page.tsx"
import PageHeading from "@/ui/page/PageHeading.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {buttonVariants} from "@/cn/components/ui/button.tsx";
import {BellIcon, PackageXIcon, PlusIcon} from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";
import {Link, useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {cn} from "@/cn/lib/utils.ts";
import TxMiniCardSync from "@/ui/components/cards/tx/TxMiniCardSync.tsx";
// import StockHighlights from "@/ui/components/cards/dashboard/StockHighlights.tsx";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";
import NoItems from "@/ui/components/cards/NoItems.tsx";
import ActivityHighlights from "@/ui/components/cards/dashboard/ActivityHighlights.tsx";
import OverviewGraph from "@/ui/components/OverviewGraph.tsx";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";

const Dashboard: React.FC = () => {
    const {profile, wallet, claims} = useAppStore();
    const navigate = useNavigate()

    return (
        <Page className={"pt-2 space-y-4"}>
            <div className={"flex gap-4 justify-between"}>
                <div>
                    <p className={"text-xl"}>Hello,</p>
                    <PageHeading>{profile?.firstName}</PageHeading>
                </div>
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
            <div className={"bg-linear-90 from-secondary/25 to-primary/90 flex items-center justify-between rounded-md gap-4 p-4"}>
                <div className={"space-y-2"}>
                    <p className={"text-xs opacity-75"}>Current Balance</p>
                    <span className={"text-2xl font-semibold"}>{toCurrency(wallet?.balance || 0)}</span>
                </div>
                <Link
                    to={R.app.deposit}
                    className={cn(
                        buttonVariants({size: "icon-lg", variant: "secondary"}),
                        "rounded-full"
                    )}
                >
                    <PlusIcon strokeWidth={1.5}/>
                </Link>
            </div>
            {
                claims?.isActivated ? (
                    <>

                        {/*Highlights*/}
                        <DashboardSection
                            title={"Highlights"}
                            link={{to: R.app.purchase.index, label: "Purchase"}}
                            className={""}
                        >
                            {/*<StockHighlights className={"mt-1"} />*/}
                            <OverviewGraph className={"mt-1"} />
                        </DashboardSection>

                        {/*Activity*/}
                        <DashboardSection
                            title={"Activity"}
                        >
                            <ActivityHighlights />
                        </DashboardSection>

                        {/*Recent Transactions*/}
                        <DashboardSection
                            title={"Recent Transactions"}
                            link={{to: R.app.history.purchases.index, label: "See all"}}
                            className={"space-y-2"}
                        >
                            {
                                profile?.recentTx == undefined || profile.recentTx.length == 0 ? (
                                    <NoItems>
                                        No recent transactions
                                    </NoItems>
                                ) : profile.recentTx.map((tx) => (
                                    <TxMiniCardSync key={tx} txID={tx} />
                                ))
                            }
                        </DashboardSection>
                    </>
                ) : (
                    <ActivationCard
                        className={"w-full md:w-lg"}
                        Icon={PackageXIcon}
                        title={"Account Activation"}
                        cta={{label: "Go to Activation", action: () => navigate(R.app.user.activate)}}
                    >
                        You are not activated to use all of wondamart services.
                    </ActivationCard>
                )
            }
        </Page>
    );
};

export default Dashboard;
