import React, {useState} from "react";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Switch} from "@/cn/components/ui/switch.tsx";
import {MailIcon, MessageSquareIcon} from "lucide-react";

const UserSettingsGeneral: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [SMSNotifications, setSMSNotifications] = useState(true);

    return (
        <Page className="pb-8">
            <PageHeading className="mt-4">General</PageHeading>
            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">Notifications</p>
                    <div className="divide-y divide-border">
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <MailIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-muted-foreground">Get notified of transaction success or failed via email</p>
                                </div>
                            </div>
                            <Switch
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-md bg-green-500 text-white">
                                    <MessageSquareIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">SMS Notifications</p>
                                    <p className="text-xs text-muted-foreground">Get notified of transaction success or failed via sms</p>
                                </div>
                            </div>
                            <Switch
                                checked={SMSNotifications}
                                onCheckedChange={setSMSNotifications}
                            />
                        </div>
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}

export default UserSettingsGeneral;