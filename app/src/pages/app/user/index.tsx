import React from 'react';
import ProfilePill from "@/ui/components/user/ProfilePill.tsx";
import Page from "@/ui/page/Page.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {
    MoonIcon,
    BellIcon,
    ShieldIcon,
    LockIcon,
    HelpCircleIcon,
    InfoIcon,
    FileTextIcon, LogOutIcon, ShieldCheckIcon, UserPenIcon, HomeIcon
} from "lucide-react";
import {Switch} from "@/cn/components/ui/switch.tsx";
import {useTheme} from "@/cn/components/theme/theme-provider.tsx";
import SettingsItem from "@/ui/components/user/SettingsItem.tsx";
import {R} from "@/app/routes.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useNavigate} from "react-router-dom";

const UserIndex: React.FC = () => {
    const {resolvedTheme, setTheme} = useTheme();
    const {logout} = useAppStore();
    const navigate = useNavigate();

    return (
        <Page>
            <div className={"mt-6 flex flex-col gap-y-2 items-center"}>
                <ProfilePill className={"w-full"}>
                    <div className={"grow flex justify-end"}>
                        <Button onClick={logout} className={"rounded-full size-12"} variant={"outline"}>
                            <LogOutIcon className={"text-destructive"} />
                        </Button>
                    </div>
                </ProfilePill>
                <Button
                    onClick={() => navigate(R.app.deposit)}
                    variant={"outline"}
                    className={"w-4/5 py-5 rounded-full"}
                >
                    Deposit
                </Button>
            </div>

            <PageContent className={"mt-8"}>
                <div className={"flex items-center justify-between p-4"}>
                    <div className="flex items-center gap-4">
                        <MoonIcon strokeWidth={1.5} className="size-6" />
                        <span className="text-sm font-medium">Dark Mode</span>
                    </div>
                    <Switch
                        checked={resolvedTheme() === "dark"}
                        onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                    />
                </div>

                <div className="space-y-1">
                    <SettingsItem
                        href={R.app.notifications}
                        Icon={BellIcon}
                        label="Notifications"
                    />

                    <PageSubHeading className={"px-4"}>
                        User Space
                    </PageSubHeading>
                    <SettingsItem
                        href={R.app.user.profile}
                        Icon={UserPenIcon}
                        label="Profile"
                    />
                    <SettingsItem
                        href={R.app.user.settings.general}
                        Icon={HomeIcon}
                        label="General"
                    />
                    <SettingsItem
                        href={R.app.user.settings.security}
                        Icon={ShieldIcon}
                        label="Security"
                    />
                    <SettingsItem
                        href={R.app.user.activate}
                        Icon={ShieldCheckIcon}
                        label="Activation & Verification"
                    />

                    <PageSubHeading className={"px-4"}>
                        Legal & Info
                    </PageSubHeading>
                    <SettingsItem
                        href={R.terms}
                        Icon={LockIcon}
                        label="Terms & Privacy"
                    />
                    <SettingsItem
                        href={R.help}
                        Icon={HelpCircleIcon}
                        label="Help"
                    />
                    <SettingsItem
                        href={R.about}
                        Icon={InfoIcon}
                        label="About"
                    />
                    <SettingsItem
                        href={R.faq}
                        Icon={FileTextIcon}
                        label="FAQ"
                    />
                </div>
            </PageContent>
        </Page>
    );
};

export default UserIndex;

