import React from "react";
import Page from "@/ui/page/Page";
import PageContent from "@/ui/page/PageContent";
import PageHeader from "@/ui/page/PageHeader.tsx";
import AfaBundleForm from "@/ui/forms/afa-bundle-form";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";
import {toCurrency} from "@/lib/icons.ts";
import {DollarSignIcon, ShieldCheckIcon} from "lucide-react";
import DashboardSection from "@/ui/components/cards/dashboard/DashboardSection.tsx";

const AfaBundlePurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.afa;

    return (
        <Page>
            <PageHeader title={"AFA Registration"} subtitle={"Register a new AFA subscriber."} />

            <PageContent className={"space-y-6"}>
                {/* Notice strip */}
                <div className={"space-y-1 rounded-xl bg-linear-to-br from-wondamart to-primary p-4 text-white"}>
                    <div className={"flex gap-2 items-center"}>
                        <div className="flex size-9 items-center justify-center rounded-md bg-white/20">
                            <ShieldCheckIcon className="size-5" />
                        </div>
                        <p className={"text-xl"}>About AFA</p>
                    </div>
                    <div className={"space-y-1"}>
                        {
                            [
                                "Zero-rated (unlimited) Member-to-Member Calls within a renewral month",
                                "Subsidized voice, data & SMS Bundles better than Mash-up",
                                "After Registration, use *1848# to purchase package",
                                "Best for long Call lovers, can buy Multiple times"
                            ].map((item, index) => (
                                <p key={index} className={"text-sm flex gap-2"}><span>•</span> {item}</p>
                            ))
                        }
                    </div>
                </div>

                {settings && settings.enabled ? (
                    <DashboardSection title={"Registration Details"} className={"max-w-2xl bg-card p-4 rounded-xl"}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white">
                                <DollarSignIcon className="size-5" />
                            </div>
                            <div className={"grow"}>
                                <p className="font-semibold text-sm">Register a new member</p>
                                <p className="text-xs text-muted-foreground flex gap-4 justify-between">
                                    <span>Price {toCurrency(settings.unitPrice)}</span>
                                    <span>Commission {toCurrency(settings.commission)}</span>
                                </p>
                            </div>
                        </div>
                        <AfaBundleForm />
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
