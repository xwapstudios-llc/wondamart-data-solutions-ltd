import React, {useState} from 'react';
import {ClUser} from "@common/client-api/user.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Loader2Icon, MailCheckIcon, MailXIcon, PackageCheckIcon, PackageXIcon} from "lucide-react";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import Code from "@/ui/components/typography/Code.tsx";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import {toast} from "sonner";
import {R} from "@/app/routes.ts";
import {useNavigate} from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import {wondamart_api_client} from "@common/lib/api-wondamart.ts";
import PageContent from "@/ui/page/PageContent.tsx";

const UserActivate: React.FC = () => {
    const {fetchClaims, claims, commonSettings, wallet, user} = useAppStore()
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const navigate = useNavigate();

    async function activate() {
        setLoading(true);
        if (!wallet) {
            toast.error("Wallet not found");
            setLoading(false);
            return;
        }
        if (wallet.balance < commonSettings.userRegistration.unitPrice) {
            toast.error("Insufficient Funds", {
                description: "Please top up your wallet to proceed activation.",
                action: {
                    label: "Top Up",
                    onClick: () => {
                        navigate(R.app.deposit)
                    }
                }
            });
            setLoading(false);
            return;
        }
        try {
            await ClUser.activateAccount();
            toast.success("Activation Successful", {
                description: "You are now activated to use all of wondamart services."
            });
            await fetchClaims();
        } catch (e) {
            toast.error("Activation Failed", {
                description: "Please try again later."
            });
        }
        setLoading(false);
    }

    async function verifyEmail() {
        setLoading2(true);
        if (!user) {
            toast.error("User not found");
            setLoading2(false);
            return;
        }
        try {
            await wondamart_api_client("/user/auth/start-email-verification");
            await sendEmailVerification(user);
            toast.success("Email Verification Sent", {
                description: "Please check your email for verification link"
            });
        } catch (e) {
            toast.error("Email Verification Failed", {
                description: "Please try again later."
            });
        }
        setLoading2(false);
    }

    return (
        <Page className="pb-8">
            <PageHeading className="mt-4">Activation & Verification</PageHeading>
            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                {
                    claims?.isActivated ? (
                        <ActivationCard
                            className={"w-full"}
                            Icon={PackageCheckIcon}
                            title={"Activated"}
                            cta={{label: "Activated"}}
                        >
                            You are now activated to use all of wondamart services.
                        </ActivationCard>
                    ) : (
                        <ActivationCard
                            className={"w-full"}
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
            </PageContent>
        </Page>
    );
};

export default UserActivate;

