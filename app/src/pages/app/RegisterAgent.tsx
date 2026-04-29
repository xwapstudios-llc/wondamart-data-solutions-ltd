import React from "react";
import Page from "@/ui/page/Page";
import PageContent from "@/ui/page/PageContent";
import PageHeader from "@/ui/page/PageHeader.tsx";
import RegisterForm, {type RegisterValues} from "@/ui/forms/register-form";
import {ClUser as ClientUserAPI} from "@common/client-api/user";
import {useAppStore} from "@/lib/useAppStore";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";
import {toCurrency} from "@/lib/icons.ts";
import {CoinsIcon, ShieldCheckIcon, UserCheckIcon, WalletIcon} from "lucide-react";
import {cn} from "@/cn/lib/utils.ts";
import {Loader2Icon} from "lucide-react";
import type {HTTPResponse} from "@common/types/request.ts";

interface InfoTileProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
}

const InfoTile: React.FC<InfoTileProps> = ({icon, label, value, className}) => (
    <div className={cn("flex flex-col gap-2 rounded-xl bg-card shadow p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4", className)}>
        <div className={"flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"}>
            {icon}
        </div>
        <div className={"min-w-0"}>
            <p className={"text-xs text-muted-foreground"}>{label}</p>
            <p className={"truncate font-semibold text-sm"}>{value}</p>
        </div>
    </div>
);

const RegisterAgent: React.FC = () => {
    const {setError, setHTTPResponse, commonSettings} = useAppStore();
    const settings = commonSettings.userRegistration;

    const onSubmit = async (values: RegisterValues) => {
        try {
            const response = await ClientUserAPI.registerAgent({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                referredBy: values.referredBy,
            });
            setHTTPResponse(response);
        } catch (err) {
            if (typeof err === "string") {
                setError(err);
            } else if (typeof err === "object") {
                setHTTPResponse(err as HTTPResponse);
            } else {
                setError({title: "Error", description: JSON.stringify(err)});
            }
        }
    };

    return (
        <Page className={"space-y-4"}>
            <PageHeader title={"Register Agent"} subtitle={"Earn more commission by registering new agents."} className={"mt-4"}/>
            <PageContent className={"space-y-6 mb-12"}>

                {/* Info strip */}
                <div className={"grid grid-cols-3 gap-3"}>
                    <InfoTile
                        icon={<WalletIcon className={"size-4"}/>}
                        label={"Cost"}
                        value={settings?.unitPrice != null
                            ? toCurrency(settings.unitPrice)
                            : <Loader2Icon className={"size-4 animate-spin"}/>}
                    />
                    <InfoTile
                        icon={<CoinsIcon className={"size-4"}/>}
                        label={"Commission"}
                        value={settings?.commission != null
                            ? toCurrency(settings.commission)
                            : <Loader2Icon className={"size-4 animate-spin"}/>}
                    />
                    <InfoTile
                        icon={<UserCheckIcon className={"size-4"}/>}
                        label={"Activation"}
                        value={"Instant"}
                    />
                </div>

                {/* Notice strip */}
                <div className={"flex items-start gap-3 rounded-xl border border-border bg-card p-4"}>
                    <ShieldCheckIcon className={"mt-0.5 size-4 shrink-0 text-primary"}/>
                    <p className={"text-sm text-muted-foreground"}>
                        The new agent's account is activated immediately upon registration. No separate activation step is required.
                    </p>
                </div>

                {settings && settings.enabled ? (
                    <DashboardSection title={"Agent Details"} className={"max-w-xl"}>
                        <RegisterForm onSubmit={onSubmit}/>
                    </DashboardSection>
                ) : (
                    <DisabledNotice className={"mt-4"} title={"Agent Registration Unavailable"}>
                        Agent registration is currently unavailable. Please come back later or contact support.
                    </DisabledNotice>
                )}
            </PageContent>
        </Page>
    );
};

export default RegisterAgent;
