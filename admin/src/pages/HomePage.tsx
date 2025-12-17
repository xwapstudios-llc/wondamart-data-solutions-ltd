import React from "react";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import {CoinsIcon, DollarSignIcon, Package2Icon, PenBoxIcon, SettingsIcon, User2Icon} from "lucide-react";
import R from "../routes.ts";
import MainMenuItem from "@/ui/components/MainMenuItem.tsx";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";

const HomePage: React.FC = () => {
    return (
        <Page className={"space-y-4 pb-4"}>
            <PageHeader className={"sticky top-0 z-50 w-full bg-background"} />
            <PageContent>
                <div className={"space-y-2"}>
                    <h2>Accounts Overview</h2>
                    <div className={"grid grid-cols-2 gap-2"}>
                        <Skeleton className={"w-full h-44 rounded-md"}/>
                        <Skeleton className={"w-full h-44 rounded-md"}/>
                    </div>
                </div>
                <div className={"space-y-2"}>
                    <h2>Revenue Overview</h2>
                    <div className={"grid grid-cols-2 gap-2"}>
                        <Skeleton className={"w-full h-24 rounded-sm"}/>
                        <Skeleton className={"w-full h-24 rounded-sm"}/>
                    </div>
                    <Skeleton className={"w-full h-44 rounded-md"}/>
                </div>

                <div className={"space-y-1"}>
                    <h2>Users Accounts Graph</h2>
                    <Skeleton className={"w-full h-44 rounded-md"}/>
                </div>

                <div className={"space-y-1"}>
                    <h3>Menu</h3>
                    <div className={"grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"}>
                        <MainMenuItem href={R.accounts} Icon={PenBoxIcon}>Third-Party</MainMenuItem>
                        <MainMenuItem href={R.transactions} Icon={DollarSignIcon}>Transactions</MainMenuItem>
                        <MainMenuItem href={R.commissions} Icon={CoinsIcon}>Commissions</MainMenuItem>
                        <MainMenuItem href={R.users} Icon={User2Icon}>Users</MainMenuItem>
                        <MainMenuItem href={R.bundles} Icon={Package2Icon}>Bundles</MainMenuItem>
                        <MainMenuItem href={R.settings} Icon={SettingsIcon}>Settings</MainMenuItem>
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}

export default HomePage;