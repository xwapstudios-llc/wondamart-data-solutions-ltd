import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {
    MoonIcon,
    BellIcon,
    ShieldIcon,
    LockIcon,
    HelpCircleIcon,
    InfoIcon,
    FileTextIcon,
    LogOutIcon,
    ShieldCheckIcon,
    UserPenIcon,
    HomeIcon,
    WalletIcon,
    PlusCircleIcon,
} from "lucide-react";
import {Switch} from "@/cn/components/ui/switch.tsx";
import {useTheme} from "@/cn/components/theme/theme-provider.tsx";
import SettingsItem from "@/ui/components/user/SettingsItem.tsx";
import {R} from "@/app/routes.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/cn/components/ui/avatar.tsx";
import {toCurrency} from "@/lib/icons.ts";

const UserIndex: React.FC = () => {
    const {resolvedTheme, setTheme} = useTheme();
    const {logout, user, profile, wallet} = useAppStore();
    const navigate = useNavigate();

    const initials = profile?.firstName
        ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    return (
        <Page >
            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">

                {/* Profile header */}
                <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
                    <Avatar className="size-16 rounded-xl">
                        <AvatarImage src={user?.photoURL ?? ""} />
                        <AvatarFallback className="rounded-xl text-lg font-semibold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{profile?.firstName} {profile?.lastName}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Button onClick={logout} size="icon" variant="outline" className="rounded-full shrink-0">
                        <LogOutIcon className="size-4 text-destructive" />
                    </Button>
                </div>

                {/* Wallet balance card */}
                <div className="rounded-xl bg-gradient-to-br from-wondamart/80 to-wondamart p-5 text-white">
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
                </div>

                {/* Settings list */}
                <div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">

                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-slate-600 text-white">
                                <MoonIcon className="size-4" />
                            </div>
                            <p className="text-sm font-medium">Dark Mode</p>
                        </div>
                        <Switch
                            checked={resolvedTheme() === "dark"}
                            onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                        />
                    </div>

                    <SettingsItem href={R.app.notifications} Icon={BellIcon} color="bg-rose-500"
                        label="Notifications" description="Alerts & push notifications" />
                </div>

                {/* User space */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">User Space</p>
                    <div className="divide-y divide-border">
                        <SettingsItem href={R.app.user.profile} Icon={UserPenIcon} color="bg-violet-500"
                            label="Profile" description="Edit your personal info" />
                        <SettingsItem href={R.app.user.settings.general} Icon={HomeIcon} color="bg-sky-500"
                            label="General" description="App preferences" />
                        <SettingsItem href={R.app.user.settings.security} Icon={ShieldIcon} color="bg-amber-500"
                            label="Security" description="Password & 2FA" />
                        <SettingsItem href={R.app.user.activate} Icon={ShieldCheckIcon} color="bg-emerald-500"
                            label="Activation & Verification" description="Account & email status" />
                    </div>
                </div>

                {/* Legal & Info */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">Legal & Info</p>
                    <div className="divide-y divide-border">
                        <SettingsItem href={R.app.termsAndConditions} Icon={LockIcon} color="bg-indigo-500"
                            label="Terms & Conditions" />
                        <SettingsItem href={R.app.help} Icon={HelpCircleIcon} color="bg-orange-500"
                            label="Help" />
                        <SettingsItem href={R.app.about} Icon={InfoIcon} color="bg-blue-500"
                            label="About" />
                        <SettingsItem href={R.app.faq} Icon={FileTextIcon} color="bg-pink-500"
                            label="FAQ" />
                    </div>
                </div>

            </PageContent>
        </Page>
    );
};

export default UserIndex;
