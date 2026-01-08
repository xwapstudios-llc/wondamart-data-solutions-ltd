import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {BookOpenTextIcon, CompassIcon, PackageIcon, PackageXIcon} from "lucide-react";
import TextIconInStock from "@/ui/components/typography/TextIconInStock.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import PageContent from "@/ui/page/PageContent.tsx";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";



const PurchaseIndex: React.FC = () => {
    const {commonSettings, claims} = useAppStore();
    const navigate = useNavigate();
    const dataBundles = commonSettings.dataBundles;
    const resultCheckers = commonSettings.resultChecker;

    return (
        <Page>
            <PageHeading>Purchases</PageHeading>
            <PageSubHeading>Multiple products for you to choose from.</PageSubHeading>
            {
                !claims?.isActivated ? (
                    <ActivationCard
                        className={"w-full md:w-lg"}
                        Icon={PackageXIcon}
                        title={"Account Activation"}
                        cta={{label: "Go to Activation", action: () => navigate(R.app.user.activate)}}
                    >
                        You are not activated to use wondamart services.
                    </ActivationCard>
                ) : (
                    <PageContent className={"md:grid md:grid-cols-2 md:gap-4"}>
                        <div className={"mt-8"}>
                            <div
                                onClick={() => navigate(R.app.purchase.dataBundle.index)}
                                className={"p-4 flex flex-row-reverse gap-2 rounded-md bg-linear-0 to-primary space-y-1"}
                            >
                                <PackageIcon strokeWidth={1.5} className="size-24"/>
                                <div className="flex flex-col justify-center gap-3 grow">
                                    <span className="text-xl font-bold">Buy Data Bundles</span>
                                    <span className="text-xs opacity-90 dark:opacity-60">Get top tear data bundles for all networks.</span>
                                </div>
                            </div>
                            <div className={"flex gap-1 mt-2 items-center justify-evenly bg-primary/15 rounded-md"}>
                                <TextIconInStock inStock={dataBundles.enabled && dataBundles.mtn.enabled}>MTN</TextIconInStock>
                                <TextIconInStock inStock={dataBundles.enabled && dataBundles.telecel.enabled}>Telecel</TextIconInStock>
                                <TextIconInStock inStock={dataBundles.enabled && dataBundles.airteltigo.enabled}>AirtelTigo</TextIconInStock>
                            </div>
                        </div>

                        <div className={"mt-8"}>
                            <div
                                onClick={() => navigate(R.app.purchase.resultChecker)}
                                className={"p-4 flex flex-row-reverse gap-2 rounded-md bg-linear-0 to-primary space-y-1"}
                            >
                                <BookOpenTextIcon strokeWidth={1.5} className="size-24"/>
                                <div className="flex flex-col justify-center gap-3 grow">
                                    <span className="text-xl font-bold">Buy Result Checkers</span>
                                    <span className="text-xs opacity-90 dark:opacity-60">Instant result checkers for WASSCE and BECE available at your finger tips.</span>
                                </div>
                            </div>
                            <div className={"flex gap-1 mt-2 items-center justify-evenly bg-primary/15 rounded-md"}>
                                <TextIconInStock inStock={resultCheckers.enabled}>BECE</TextIconInStock>
                                <TextIconInStock inStock={resultCheckers.enabled}>WASSCE</TextIconInStock>
                            </div>
                        </div>


                        <div className={"mt-8"}>
                            <div
                                onClick={() => navigate(R.app.purchase.afaBundle)}
                                className={"p-4 flex flex-row-reverse gap-2 rounded-md bg-linear-0 to-primary space-y-1"}
                            >
                                <CompassIcon strokeWidth={1.5} className="size-24"/>
                                <div className="flex flex-col justify-center gap-3 grow">
                                    <span className="text-xl font-bold">Buy AFA Bundle</span>
                                    <span className="text-xs opacity-90 dark:opacity-60">Get subscribed at the most competitive price. No time to waste.</span>
                                </div>
                            </div>
                            <div className={"flex gap-1 mt-2 items-center justify-evenly bg-primary/15 rounded-md"}>
                                <TextIconInStock inStock={commonSettings.afa.enabled}>AFA</TextIconInStock>
                            </div>
                        </div>
                    </PageContent>
                )
            }
        </Page>
    );
};

export default PurchaseIndex;

