import React from "react";
import Page from "@/ui/page/Page";
import PageHeading from "@/ui/page/PageHeading";
import BuyResultsCheckerForm from "@/ui/forms/results-checker-form";
import {Notice, NoticeContent, NoticeHeading, NoticeItem,} from "@/ui/components/typography/Notice";
import Code from "@/ui/components/typography/Code";
import {Loader2Icon} from "lucide-react";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";

const ResultCheckerPurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.resultChecker;

    return (
        <Page>
            <PageHeading>Result Checker</PageHeading>

            <Notice variant={"default"} className={"mt-4"}>
                <NoticeHeading>Notice</NoticeHeading>
                <NoticeContent>
                    <NoticeItem title={"Amount"}>
                        Result Checkers const{" "}
                        <Code>
                            {settings?.unitPrice ? (
                                `₵ ${settings.unitPrice.toFixed(2)}`
                            ) : (
                                <Loader2Icon
                                    className={
                                        "animate-spin inline-flex size-4"
                                    }
                                />
                            )}
                        </Code>
                    </NoticeItem>
                    <NoticeItem title={"Commissions"}>
                        Result Checkers attracts a commission of{" "}
                        <Code>
                            {settings?.commission || settings?.commission == 0 ? (
                                `₵ ${settings.commission.toFixed(2)}`
                            ) : (
                                <Loader2Icon
                                    className={
                                        "animate-spin inline-flex size-4"
                                    }
                                />
                            )}
                        </Code>
                    </NoticeItem>
                    <NoticeItem title={"Delivery"}>
                        Delivery is near instant.
                    </NoticeItem>
                </NoticeContent>
            </Notice>
            {settings && settings.enabled ? (
                <div className={"max-w-2xl mx-auto mt-4"}>
                    <BuyResultsCheckerForm/>
                </div>
            ) : (
                <DisabledNotice className="mt-4" title="Result Checker Purchase Unavailable">
                    Result Checker purchases are currently unavailable. Please come
                    back later or contact administrator.
                </DisabledNotice>
            )}
        </Page>
    );
};

export default ResultCheckerPurchase;
