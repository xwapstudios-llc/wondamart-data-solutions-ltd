import React from "react";
import Page from "@/ui/page/Page.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useParams} from "react-router-dom";
import OopsView from "@/ui/components/views/OopsView.tsx";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import {MailCheckIcon} from "lucide-react";

const VerifyEmailPage: React.FC = () => {
    const {claims} = useAppStore();
    const {email} = useParams();

    return (
        <Page className={"flex p-8 items-center justify-center h-svh"}>
            {
                claims?.email_verified ? (
                    <ActivationCard
                        className={"w-full md:w-[28rem] h-[28rem]"}
                        Icon={MailCheckIcon}
                        title={"Email Verified"}
                        cta={{label: "Verified"}}
                    >
                        <p className={"text-xl font-semibold"}>{email}</p>
                        <p>Your email address is verified.</p>
                    </ActivationCard>
                ) : (
                    <OopsView />
                )
            }
        </Page>
    )
}

export default VerifyEmailPage;