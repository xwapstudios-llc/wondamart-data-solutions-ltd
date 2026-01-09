"use client";

import * as React from "react";
import {
    ArrowUpDownIcon,
    Bot,
    CoinsIcon,
    DollarSignIcon, InfoIcon, Moon,
    SquareTerminal, Sun,
    User2Icon,
    UserPlus2Icon,
} from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/cn/components/ui/dropdown-menu.tsx";
import {useTheme} from "@/cn/components/theme/theme-provider.tsx";

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
                    url: R.app.history.deposits,
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
            title: "User",
            url: R.app.user.index,
            icon: User2Icon,
            items: [
                {
                    title: "Profile",
                    url: R.app.user.profile,
                },
                {
                    title: "General",
                    url: R.app.user.settings.general,
                },
                {
                    title: "Security",
                    url: R.app.user.settings.security,
                },
                {
                    title: "Activation & Verification",
                    url: R.app.user.settings.general,
                },
            ],
        },
        {
            title: "Legal & Infos",
            url: R.app.user.index,
            icon: InfoIcon,
            items: [
                {
                    title: "Terms & Conditions",
                    url: R.app.termsAndConditions,
                },
                {
                    title: "Help",
                    url: R.app.help,
                },
                {
                    title: "About",
                    url: R.app.about,
                },
                {
                    title: "FAQ",
                    url: R.app.faq,
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
    const {setTheme} = useTheme()

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
                <NavUser />
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
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={"cursor-pointer flex gap-2 hover:bg-sidebar-accent px-1.5 py-1 rounded-md items-center"}
                    >
                        <Sun className="size-5 basis-5 shrink-0 dark:hidden"/>
                        <Moon className="size-5 basis-5 shrink-0 hidden dark:inline-block"/>
                        <span className={"truncate shrink"}>Theme</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div
                    className={"cursor-pointer flex gap-2 bg-primary hover:bg-primary/90 px-1.5 py-1 rounded-md items-center"}
                    onClick={() => navigate(R.app.deposit)}
                >
                    <DollarSignIcon className="size-5 basis-5 shrink-0"/>
                    <span className={"truncate shrink"}>Deposit</span>
                </div>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
};

export default AppSidebar;
