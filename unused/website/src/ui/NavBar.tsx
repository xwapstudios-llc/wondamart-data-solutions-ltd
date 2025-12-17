'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavMenu from "@/ui/components/NavMenu";
import {useAppStore} from "@/lib/useAppStore";
import {usePathname, useRouter} from "next/navigation"
import {BellIcon, ChevronLeft, LoaderIcon} from "lucide-react";


const NavBar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const {user, loading} = useAppStore();
    const router = useRouter();
    const pathname = usePathname();
    const showBack = !(pathname === "/" || pathname === "/user");

    useEffect(() => {
        setShowUserMenu(!!user);
    }, [user]);


    return (
        <nav className="flex items-center justify-between w-full gap-4 p-2 px-4 border-b-2 sticky top-0 z-50 bg-background">
            {
                showBack && (
                    <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={() => router.back()} >
                        <ChevronLeft size={32} /> <span className="hidden md:inline">back</span>
                    </div>
                )
            }
            <Link href={"/"} className={"flex gap-2 items-center flex-wrap"}>
                <Image
                    src={"/logo/logo_icon.png"}
                    alt={"logo"}
                    width={40}
                    height={40}
                />
                <span className={"text-lg md:text-2xl text-primary"}>
                    Wondamart
                </span>
                <span className={"text-2xl"}>|</span>
                <span>Agent</span>
            </Link>
            <div className={"gap-4 items-center flex"}>
                <div>
                    <BellIcon onClick={() => router.push("/user/notifications")} />
                </div>
                <NavMenu showUserMenu={showUserMenu} />
            </div>
            {
                loading && (
                    <div className={"fixed top-0 left-0 right-0 bottom-0 bg-background/25 backdrop-blur-xl flex items-center justify-center z-[999]"} >
                        <LoaderIcon size={64} className={"animate-spin text-primary"} />
                    </div>
                )
            }
        </nav>
    );
};

export default NavBar;
