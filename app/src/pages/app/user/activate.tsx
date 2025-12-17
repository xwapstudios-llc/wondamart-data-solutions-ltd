import React, {useState} from 'react';
import {ClUser} from "@common/client-api/user.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Loader2Icon, MailCheckIcon, MailXIcon, PackageCheckIcon, PackageXIcon} from "lucide-react";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import Code from "@/ui/components/typography/Code.tsx";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";

const UserActivate: React.FC = () => {
    const {fetchClaims, claims, commonSettings} = useAppStore()
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    async function activate() {
        setLoading(true);
        await ClUser.activateAccount().catch((err) => {
            console.error(err);
        });
        await fetchClaims();
        setLoading(false);
    }

    async function verifyEmail() {
        setLoading2(true);
        await ClUser.verifyEmail().catch((err) => {
            console.error(err);
        });
        await fetchClaims();
        setLoading2(false);
    }

    return (
        <Page>
            <PageHeading className="mt-4 text-4xl">User Activation</PageHeading>
            <div className={"mt-8 md:p-4 flex flex-wrap gap-8"}>
                {
                    claims?.isActivated ? (
                        <ActivationCard
                            className={"w-full md:w-[32rem]"}
                            Icon={PackageCheckIcon}
                            title={"Activated"}
                            cta={{label: "Activated"}}
                        >
                            You are now activated to use all of wondamart services.
                        </ActivationCard>
                    ) : (
                        <ActivationCard
                            className={"w-full md:w-[32rem]"}
                            Icon={PackageXIcon}
                            title={"Not Activated"}
                            cta={{
                                label: loading ? <>
                                    <Loader2Icon className={"animate-spin"}/> Loading...
                                </> : "Activate Now",
                                action: activate
                            }}
                        >
                            <span className={"text-lg"}>
                                Account activation is
                                <Code>₵ {commonSettings.userRegistration.unitPrice.toFixed(2)}</Code>
                            </span>
                            <br/>
                            <span className={"text-sm"}>Click the button below to activate your account.</span>
                        </ActivationCard>
                    )
                }
                {
                    claims?.email_verified ? (
                        <ActivationCard
                            Icon={MailCheckIcon}
                            title={"Email Verified"}
                            cta={{label: "Verified"}}
                        >
                            Your email address is verified.
                        </ActivationCard>
                    ) : (
                        <ActivationCard
                            Icon={MailXIcon}
                            title={"Email Not Verified"}
                            cta={{
                                label: loading2 ? <><Loader2Icon
                                    className={"animate-spin"}/> Loading...</> : "Verify Now",
                                action: verifyEmail
                            }}
                        >
                            <span className={"text-sm"}>Click the button below to verify your email address.</span>
                        </ActivationCard>
                    )
                }
            </div>
        </Page>
    );
};

export default UserActivate;

