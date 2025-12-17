import React, {useEffect} from "react";
import {SidebarInset, SidebarProvider} from "@/cn/components/ui/sidebar.tsx";
import AppSidebar from "@/cn/components/layout/app-sidebar.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import NavHeader from "@/ui/layouts/NavHeader.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {R} from "@/app/routes.ts";
import MobileBottomNav from "@/ui/layouts/MobileBottomNav.tsx";

const UserLayout: React.FC = () => {
    const {subscribeProfile, subscribeWallet, subscribeCommonSettings, user} = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate(R.login);
    }, [user, navigate])

    useEffect(() => {
        let unsub: (() => void) | undefined;
        let unsubWallet: (() => void) | undefined;
        let unsubCommonSettings: (() => void) | undefined;

        if (user) {
            unsub = subscribeProfile();
            unsubWallet = subscribeWallet();
            unsubCommonSettings = subscribeCommonSettings();
        }

        return () => {
            if (unsub) unsub();
            if (unsubWallet) unsubWallet();
            if (unsubCommonSettings) unsubCommonSettings();
        };
    }, [subscribeProfile, subscribeWallet, subscribeCommonSettings, user]);

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <NavHeader className={"sticky top-0 bg-background/75 backdrop-blur-xl z-50"}/>
                <Outlet/>
            </SidebarInset>
            <MobileBottomNav />
        </SidebarProvider>
    )
}

export default UserLayout;