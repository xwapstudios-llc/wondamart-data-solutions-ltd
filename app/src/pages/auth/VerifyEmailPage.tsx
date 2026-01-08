import React from "react";
import Page from "@/ui/page/Page.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useParams} from "react-router-dom";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import {MailCheckIcon} from "lucide-react";

const VerifyEmailPage: React.FC = () => {
    const {claims} = useAppStore();
    const {email} = useParams();

    return (
        <Page className={"flex p-8 items-center justify-center h-svh"}>
            {
                claims?.email_verified ? (
                    <>
                        <ActivationCard
                            className={"w-full md:w-md h-112"}
                            Icon={MailCheckIcon}
                            title={"Email Verified"}
                            cta={{label: "Verified"}}
                        >
                            <p className={"text-xl font-semibold"}>{email}</p>
                            <p>Your email address is verified.</p>
                        </ActivationCard>
                        <div className={"mt-4"}>
                            <p className={"text-sm text-muted-foreground"}>You can now close this page.</p>
                        </div>
                    </>
                ): null
            }
        </Page>
    )
}

export default VerifyEmailPage;