import React from "react";
import Page from "@/ui/page/Page.tsx";
import {OTPForm} from "@/cn/components/otp-form.tsx";
import PageContent from "@/ui/page/PageContent.tsx";

const OTPPage: React.FC = () => {
    return (
        <Page>
            <PageContent className={"min-h-[80svh] flex items-center justify-center"}>
                <OTPForm />
            </PageContent>
        </Page>
    )
}

export default OTPPage;