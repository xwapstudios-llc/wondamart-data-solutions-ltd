"use client";

import React, {useState} from "react";
import {Button, buttonVariants} from "@/cn/components/ui/button"
import {
    CreditCard,
    LayoutGridIcon,
    ApertureIcon,
    ArrowDownSquareIcon,
    AwardIcon,
    UserPlus2Icon, LucideIcon, FileTextIcon, CoinsIcon, HeadphonesIcon,
    SettingsIcon, FrownIcon
} from "lucide-react"
import Section from "@/ui/layout/Section";
import HistoryCard from "@/ui/components/HistoryCard";
import Link from "next/link";
import {numToMoney} from "@/lib/formatters";
import {useAppStore} from "@/lib/useAppStore";
import DrawerDialog from "@/ui/layout/DrawerDialog";
import DepositForm from "@/ui/forms/deposit-form";
import OverviewGraph from "@/ui/components/OverviewGraph";


interface QuickIconProps {label: string, href: string, Icon: LucideIcon}
const QuickIcon: React.FC<QuickIconProps> = ({label, href, Icon}) => {
    return (
        <Link
            href={href}
            className={"flex items-center justify-center flex-col p-1 md:p-2 gap-2 rounded-lg text-foreground border-2 border-primary bg-primary/50"}
        >
            <Icon size={36} strokeWidth={1.25} className={"text-foreground"} />
            <span className={"text-wrap text-center text-xs sm:text-sm"}>{label}</span>
        </Link>
    )
}

const UserPage: React.FC = () => {
    const {profile, wallet} = useAppStore();
    const [depositOpened, setDepositOpened] = useState(false);

    const quick_menu: QuickIconProps[] = [
        {label: "Buy Data", href: "/user/buy/data-bundle", Icon: ArrowDownSquareIcon},
        {label: "Registrater AFA", href: "/user/buy/afa", Icon: ApertureIcon},
        {label: "Result Checker", href: "/user/buy/result-checker", Icon: AwardIcon},
        {label: "Register Agent", href: "/user/register-new-agent", Icon: UserPlus2Icon},
    ];
    const support_menu = [
        {label: "History", href: "/user/history", Icon: FileTextIcon},
        {label: "Commissions", href: "/user/commissions", Icon: CoinsIcon},
        // {label: "Notifications", href: "/user/notifications", Icon: BellIcon},
        {label: "Settings", href: "/user/settings", Icon: SettingsIcon},
        {label: "Support", href: "https://wa.me/+233539971202?text=Hi%20Wondamart%20Data%20Solutions.", Icon: HeadphonesIcon},
    ];

    return (
        <>
            <Section className={"flex flex-col gap-y-6 !mt-2"}>
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {profile?.firstName} 👋</h1>
                    <p className="text-muted-foreground">Here’s your account overview.</p>
                </div>

                {/* Balance */}
                <div className={"max-w-md space-y-2 relative"}>
                    <div className="flex items-center space-x-2">
                        <CreditCard className={"w-10 h-10 text-primary"} strokeWidth={1.5} />
                        <p className="text-3xl font-semibold">GHC {numToMoney(wallet?.balance ?? 0)}</p>
                    </div>
                    <div>
                        <p className="mt-2 text-sm text-muted-foreground"><b>Commission</b>: GHC {numToMoney(wallet?.commission ?? 0)}</p>
                        <DrawerDialog open={depositOpened} onOpenChange={setDepositOpened} trigger={<Button className="w-full md:w-72 mt-4">Deposit</Button>} title={"Account Deposit"}>
                            <DepositForm onComplete={() => setDepositOpened(false)} />
                        </DrawerDialog>
                    </div>
                </div>

                {/* Overview */}
                <div className={"space-y-2"}>
                    <OverviewGraph />
                </div>

                {/* Quick Actions */}
                <div className={"space-y-2"}>
                    <div className="flex items-center space-x-2">
                        <LayoutGridIcon className="w-5 h-5" />
                        <p className={"font-semibold"}>Quick Menu</p>
                    </div>
                    <div className={"grid grid-cols-3 md:grid-cols-4 gap-2"}>
                        {
                            quick_menu.map((item, i) => (
                                <QuickIcon key={i} {...item} />
                            ))
                        }
                        {
                            support_menu.map((item, i) => (
                                <QuickIcon key={i} {...item} />
                            ))
                        }
                    </div>
                </div>

                {/* Support Menu */}
                {/* <div className={"grid md:grid-cols-3 grid-cols-2 gap-2"}>
                    {
                        support_menu.map(({label, href, Icon}, i) => (
                            <Link
                                key={i}
                                href={href}
                                className={"bg-secondary rounded-md flex gap-2 items-center w-full text-wrap p-2"}
                            >
                                <Icon />
                                {label}
                            </Link>
                        ))
                    }
                </div> */}
            </Section>

            {/* Recent Purchases */}
            <Section className={"space-y-4 mb-4"}>
                <div className={"flex gap-4 justify-between"}>
                    <h2 className="text-xl font-semibold mb-2">Recent Purchases</h2>
                    <Link href={"/user/history"} className={buttonVariants({variant: "ghost"})}>View All</Link>
                </div>
                {
                    profile?.recentTx && profile?.recentTx.length > 0 ? profile?.recentTx.reverse().slice(0, 5).map((a, i) => (
                        <HistoryCard key={i} txID={a} />
                    )) : (
                        <div className={"w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted rounded-md"}>
                            <FrownIcon size={64} className={"text-muted-foreground"} />
                            <p>No Recent Transaction</p>
                        </div>
                    )
                }
            </Section>
        </>
    );
}

export default UserPage;

