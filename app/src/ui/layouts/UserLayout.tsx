import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useAppStore} from "@/lib/useAppStore.ts";
import {R} from "@/app/routes.ts";
import NavHeader from "@/ui/layouts/NavHeader.tsx";
import MobileBottomNav from "@/ui/layouts/MobileBottomNav.tsx";
import AppSidebarNew from "@/ui/layouts/AppSidebarNew.tsx";
import {SidebarProvider, useSidebar} from "@/cn/components/ui/sidebar.tsx";
import { ThemeProvider } from "@/cn/components/theme/theme-provider";
import {cn} from "@/cn/lib/utils.ts";

const UserLayout: React.FC = () => {
    const {
        subscribeProfile,
        subscribeWallet,
        subscribeCommonSettings,
        user,
    } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate(R.login);
    }, [user, navigate]);

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
        <ThemeProvider defaultTheme="system" storageKey="wondamart-app-ui-theme">
            <SidebarProvider>
                <LayoutContent />
            </SidebarProvider>
        </ThemeProvider>
    );
};

const LayoutContent = () => {
    const {isMobile} = useSidebar();
    return (
        <div className="flex h-screen overflow-hidden w-full">
            <AppSidebarNew />

            <div className={cn(
                "flex flex-1 flex-col overflow-hidden",
                isMobile ? "mb-16" : "mb-0"
            )}>
                <NavHeader className="sticky top-0 bg-background/75 backdrop-blur-xl z-30" />
                <main className="flex-1 overflow-y-auto">
                    <Outlet/>
                </main>
            </div>

            { isMobile && <MobileBottomNav/> }
        </div>
    )
}

export default UserLayout;
