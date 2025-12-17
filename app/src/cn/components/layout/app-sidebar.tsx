"use client";

import * as React from "react";
import {ArrowUpDownIcon, Bot, CoinsIcon, DollarSignIcon, Settings2, SquareTerminal, UserPlus2Icon,} from "lucide-react";
import {NavMain} from "@/cn/components/layout/nav-main.tsx";
import {NavUser} from "@/cn/components/layout/nav-user.tsx";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
    useSidebar,
} from "@/cn/components/ui/sidebar.tsx";
import {R} from "@/app/routes.ts";
import {useNavigate} from "react-router-dom";
import {ModeToggleLg} from "@/cn/components/theme/mode-toggle.tsx";
import {Button} from "@/cn/components/ui/button";

// This is sample data.
const data = {
    buyMenu: [
        {
            title: "Purchase",
            url: R.app.purchase.index,
            isActive: true,
            icon: SquareTerminal,
            items: [
                {
                    title: "Data Bundles",
                    url: R.app.purchase.dataBundle.index,
                },
                {
                    title: "AFA Bundles",
                    url: R.app.purchase.afaBundle,
                },
                {
                    title: "Result Checkers",
                    url: R.app.purchase.resultChecker,
                },
            ],
        },
        {
            title: "Data Bundles",
            url: R.app.purchase.index,
            isActive: true,
            icon: ArrowUpDownIcon,
            items: [
                {
                    title: "MTN",
                    url: R.app.purchase.dataBundle.mtn,
                },
                {
                    title: "Telecel",
                    url: R.app.purchase.dataBundle.telecel,
                },
                {
                    title: "AirtelTigo",
                    url: R.app.purchase.dataBundle.airtelTigo,
                },
            ],
        },
    ],
    util: [
        {
            title: "History",
            url: R.app.history.index,
            icon: Bot,
            items: [
                {
                    title: "Purchases",
                    url: R.app.history.purchases.index,
                },
                {
                    title: "Deposits",
                    url: R.app.history.deposits.index,
                },
                {
                    title: "Data Bundles",
                    url: R.app.history.purchases.dataBundles,
                },
                {
                    title: "AFA Bundles",
                    url: R.app.history.purchases.afaBundles,
                },
                {
                    title: "Result Checkers",
                    url: R.app.history.purchases.resultCheckers,
                },
            ],
        },
        {
            title: "Settings",
            url: R.app.user.settings.index,
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: R.app.user.settings.general,
                },
                {
                    title: "Account",
                    url: R.app.user.settings.account,
                },
                {
                    title: "Security",
                    url: R.app.user.settings.security,
                },
            ],
        },
    ],
    utilButtons: [
        {
            title: "Register Agent",
            url: R.app.registerAgent,
            icon: UserPlus2Icon,
        },
        {
            title: "Commissions",
            url: R.app.commissions.index,
            icon: CoinsIcon,
        },
    ],
};

const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
                                                                        ...props
                                                                    }) => {
    const navigate = useNavigate();
    const {isMobile} = useSidebar();

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            side={isMobile ? "right" : "left"}
        >
            <SidebarHeader>
                {!isMobile && (
                    <SidebarMenuButton
                        onClick={() => navigate(R.app.index)}
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
                    >
                        <img
                            className={"size-8"}
                            src={"/favicon.ico"}
                            alt={"logo"}
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight text-wondamart">
                            <span className="truncate font-semibold">
                                Wondamart
                            </span>
                            <span className="truncate text-xs">Agent</span>
                        </div>
                    </SidebarMenuButton>
                )}
                <NavUser/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.buyMenu} title={"Buy"}/>
                <NavMain
                    items={data.util}
                    buttons={data.utilButtons}
                    title={"Utilities"}
                />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggleLg className={"w-full"}/>
                <Button
                    size={"lg"}
                    className={"cursor-pointer"}
                    onClick={() => navigate(R.app.deposit)}
                >
                    <DollarSignIcon className="size-5"/>
                    <span>Deposit</span>
                </Button>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
};

export default AppSidebar;
