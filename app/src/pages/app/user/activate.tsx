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

const UserActivate: React.FC = () => {
    const {fetchClaims, claims, commonSettings, wallet} = useAppStore()
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
        await ClUser.activateAccount().catch((err) => {
            toast.error("Activation Failed", {
                description: err.message
            });
        });
        await fetchClaims();
        setLoading(false);
    }

    async function verifyEmail() {
        setLoading2(true);
        await ClUser.verifyEmail().catch((err) => {
            toast.error("Email Activation Failed", {
                description: err.message
            });
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
                            className={"w-full md:w-lg"}
                            Icon={PackageCheckIcon}
                            title={"Activated"}
                            cta={{label: "Activated"}}
                        >
                            You are now activated to use all of wondamart services.
                        </ActivationCard>
                    ) : (
                        <ActivationCard
                            className={"w-full md:w-lg"}
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

