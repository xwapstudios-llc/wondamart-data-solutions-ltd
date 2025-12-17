import React from "react";
import Page from "@/ui/page/Page.tsx";
import {Functions} from "@common/lib/fn.ts";
import {Button} from "@/cn/components/ui/button.tsx";

const UserSettingsAccount: React.FC = () => {
    const makeAdmin = async () => {
        await Functions.admin.requestFirstAdmin();
    }
    const initSettings = async () => {
        await Functions.commonSettings.init();
    }

    return (
        <Page>
            UserSettingsAccount
            <Button onClick={initSettings}>
                init Settings
            </Button>

            <Button onClick={makeAdmin}>
                make Admin
            </Button>
        </Page>
    )
}

export default UserSettingsAccount;