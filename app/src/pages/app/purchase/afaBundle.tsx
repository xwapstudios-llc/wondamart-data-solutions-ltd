import React from "react";
import Page from "@/ui/page/Page";
import PageContent from "@/ui/page/PageContent";
import PageHeader from "@/ui/page/PageHeader.tsx";
import AfaBundleForm from "@/ui/forms/afa-bundle-form";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";
import {toCurrency} from "@/lib/icons.ts";
import {ClockIcon, CoinsIcon, ShieldCheckIcon, WalletIcon} from "lucide-react";
import {cn} from "@/cn/lib/utils.ts";
import {Loader2Icon} from "lucide-react";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";

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

const AfaBundlePurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.afa;

    return (
        <Page>
            <PageHeader title={"AFA Bundle"} subtitle={"Register a new AFA subscriber."} />

            <PageContent className={"space-y-6"}>
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
                        icon={<ClockIcon className={"size-4"}/>}
                        label={"Delivery"}
                        value={"~24 hrs"}
                    />
                </div>

                {/* Notice strip */}
                <div className={"flex items-start gap-3 rounded-xl border border-border bg-card p-4"}>
                    <ShieldCheckIcon className={"mt-0.5 size-4 shrink-0 text-primary"}/>
                    <p className={"text-sm text-muted-foreground"}>
                        Registration takes up to 24 hours to complete. Ensure all details match the subscriber's Ghana Card exactly.
                    </p>
                </div>

                {settings && settings.enabled ? (
                    <DashboardSection title={"Registration Details"} className={"max-w-2xl"}>
                        <AfaBundleForm/>
                    </DashboardSection>
                ) : (
                    <DisabledNotice className={"mt-4"} title={"AFA Bundle Unavailable"}>
                        AFA Bundle purchase is currently unavailable. Please come back later or contact support.
                    </DisabledNotice>
                )}
            </PageContent>
        </Page>
    );
};

export default AfaBundlePurchase;
