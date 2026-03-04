import React, {useState} from "react";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Switch} from "@/cn/components/ui/switch.tsx";

const UserSettingsGeneral: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [SMSNotifications, setSMSNotifications] = useState(true);

    return (
        <Page className="p-8 max-w-2xl">
            <div className="mb-6">
                <PageHeading className="text-2xl font-semibold">General</PageHeading>
                <p className="text-sm text-muted-foreground">General account settings</p>
            </div>

            <PageContent className="space-y-6 mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified of transaction success or failed via email</p>
                    </div>
                    <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified of transaction success or failed via sms</p>
                    </div>
                    <Switch
                        checked={SMSNotifications}
                        onCheckedChange={setSMSNotifications}
                    />
                </div>
            </PageContent>
        </Page>
    )
}

export default UserSettingsGeneral;