import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {
    BellIcon,
    DollarSignIcon,
    MessageCircleMoreIcon,
    MusicIcon,
    PlusCircleIcon,
    ShoppingBagIcon,
    WalletIcon
} from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";
import ActivityHighlights from "@/ui/components/cards/dashboard/ActivityHighlightsV2.tsx";
import TxTableCardSync from "@/ui/components/TxTableCardSync.tsx";
import WondamartFooter from "@/ui/layouts/WondamartFooter.tsx";
import {ButtonBadge} from "@/ui/components/buttons/ButtonBadge.tsx";
import PageContent from "@/ui/page/PageContent";

const Dashboard: React.FC = () => {
    const {profile, wallet} = useAppStore();
    const navigate = useNavigate();

    return (
        <Page>
            <PageContent className={"space-y-4"}>
                <div className={"flex gap-4 justify-between"}>
                    <div className={"flex gap-2 items-end"}>
                        <p className={"text-xl"}>Hello,</p>
                        <PageHeading>{profile?.firstName}</PageHeading>
                    </div>
                    {/*Ernest said notifications should be only for general or high priority notices.*/}
                    {/*Todo: Main instant notification on open.*/}
                    {/*Todo: Implement the addition of actual information at the badges and musics*/}
                    <div className={"flex gap-2 items-center"}>
                        <ButtonBadge
                            size={"icon-lg"}
                            variant={"wondamart"}
                            className={"rounded-full"}
                            badgeContent={5}
                        >
                            <MessageCircleMoreIcon />
                        </ButtonBadge>
                        <Button
                            size={"icon-lg"}
                            variant={"wondamart"}
                            className={"rounded-full"}
                        >
                            <MusicIcon />
                        </Button>
                        <ButtonBadge
                            size={"icon-lg"}
                            variant={"wondamart"}
                            className={"rounded-full"}
                            badgeContent={5}
                            onClick={() => navigate(R.app.notifications)}
                        >
                            <BellIcon />
                        </ButtonBadge>
                    </div>
                </div>
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
            </PageContent>

            <WondamartFooter />
        </Page>
    );
};

export default Dashboard;
