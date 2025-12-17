"use client";

import React, {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/cn/components/ui/dropdown-menu";
import {LayoutGridIcon, MenuIcon, MoreHorizontalIcon, UserIcon, XIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useAppStore} from "@/lib/useAppStore";
import { Skeleton } from "@/cn/components/ui/skeleton";
import { numToMoney } from "@/lib/formatters";

interface NavMenuProps {
    className?: string;
    showUserMenu?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({className, showUserMenu}) => {
    const router = useRouter();
    const {logout, profile, wallet} = useAppStore()

    const links = [
        // {label: "Pricing", href: "/pricing"},
        { label: "Tutorials", href: "/tutorials" },
        {label: "Terms", href: "/terms"},
        {label: "Privacy Policy", href: "/terms"},
        // {label: "Contact", href: "/contact"},
    ];

    const userQuickMenu = [
        {
            label: "Data Bundles",
            href: "/user/buy/data-bundle",
        },
        {
            label: "Register AFA",
            href: "/user/buy/afa",
        },
        {
            label: "Result Checker",
            href: "/user/buy/result-checker",
        },
        {
            label: "Register New Agent",
            href: "/user/register-new-agent",
        }
    ]
    const userContext = [
        {
            label: "Dashboard",
            href: "/user",
        },
        {
            label: "History",
            href: "/user/history",
        },
        {
            label: "Commissions",
            href: "/user/commissions",
        },
        {
            label: "Notifications",
            href: "/user/notifications",
        },
        {
            label: "Settings",
            href: "/user/settings",
        }
    ]

    const handleLogout = () => {
        logout().then(() => {
            router.push("/");
        })
    };

    const [opened, setOpened] = useState(false)

    return (
        <DropdownMenu onOpenChange={setOpened} open={opened}>
            <DropdownMenuTrigger className={`${className} outline-0`}>
                {
                    opened ? <XIcon size={32}/> : <MenuIcon size={32}/>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"rounded-none bg-background/75 backdrop-blur-2xl max-w-sx w-80 mt-2 h-[calc(100vh-4rem)] overflow-y-auto flex flex-col"}>
                
                {
                    showUserMenu ? <>
                            <div className="p-1">
                            <DropdownMenuItem className="rounded-md border flex gap-2 items-center">
                                <Skeleton className="rounded-full grow-0 shrink-0 basis-10 w-10 h-10 border-2 border-primary"/>
                                <div className="grow">
                                    <p className="text-sm">{profile?.firstName} {profile?.lastName}</p>
                                    <div className="text-muted-foreground text-sm flex items-center gap-2 justify-between">
                                        <span>Balance: {numToMoney(wallet?.balance ?? 0)}</span>
                                        {/* <span>{profile?.recentTransactions?.length || "No "} orders today</span> */}
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel className={"text-sm font-semibold flex items-center gap-1"}><LayoutGridIcon className="w-4 h-4" />Quick</DropdownMenuLabel>
                        {
                            userQuickMenu.map((link, i) => (
                                <DropdownMenuItem key={i} onClick={() => router.push(link.href)}
                                                  className={"p-2"}>
                                    {link.label}
                                </DropdownMenuItem>
                            ))
                        }
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel className={"text-sm font-semibold flex items-center gap-1"}><UserIcon className="w-4 h-4" />Context</DropdownMenuLabel>
                        {
                            userContext.map((link, i) => (
                                <DropdownMenuItem key={i} onClick={() => router.push(link.href)} className={"p-2"}>
                                    {link.label}
                                </DropdownMenuItem>
                            ))
                        }
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout} className={"p-2"}>
                            Logout
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                    </> : <>
                        <p>Login to continue</p>
                        <DropdownMenuSeparator/>
                    </>
                }

                <DropdownMenuLabel className={"text-sm font-semibold flex items-center gap-1"}><MoreHorizontalIcon className="w-4 h-4" />Menu</DropdownMenuLabel>
                        {
                            links.map((link, i) => (
                                <DropdownMenuItem key={i} onClick={() => router.push(link.href)} className={"p-2"}>
                                    {link.label}
                                </DropdownMenuItem>
                            ))
                        }
                <DropdownMenuSeparator/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavMenu;
