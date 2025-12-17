"use client"

import React, {useEffect} from "react";
import {useAppStore} from "@/lib/useAppStore";

type UserLayoutProps  = React.HTMLAttributes<HTMLDivElement>;

const UserLayout: React.FC<UserLayoutProps> = ({children}) => {
    const { subscribeProfile, subscribeWallet, user } = useAppStore();

    useEffect(() => {
        let unsub: (() => void) | undefined;
        let unsubWallet: (() => void) | undefined;
        if (user) {
            unsub = subscribeProfile();
            unsubWallet = subscribeWallet();
        }
        console.log("use")
        return () => {
            if (unsub) unsub();
            if (unsubWallet) unsubWallet();
        };
    }, [subscribeProfile, subscribeWallet, user]);

    return (
        <div className={"max-w-2xl mx-auto min-h-[calc(100vh-5rem)]"}>
            {children}
        </div>
    )
}

export default UserLayout;