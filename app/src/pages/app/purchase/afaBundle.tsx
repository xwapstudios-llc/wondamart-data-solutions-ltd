import React from "react";
import Page from "@/ui/page/Page";
import PageHeading from "@/ui/page/PageHeading";
import AfaBundleForm from "@/ui/forms/afa-bundle-form";
import {Notice, NoticeContent, NoticeHeading, NoticeItem,} from "@/ui/components/typography/Notice";
import Code from "@/ui/components/typography/Code";
import {Loader2Icon} from "lucide-react";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";

const AfaBundlePurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.afa


    return (
        <Page>
            <PageHeading>AFA Bundle</PageHeading>
            <Notice variant={"default"} className={"mt-4"}>
                <NoticeHeading>Notice</NoticeHeading>
                <NoticeContent>
                    <NoticeItem title={"Amount"}>
                        AFA const{" "}
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
                        AFA attracts a commission of{" "}
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
                        Delivery is near instant but sometimes you need to wait
                        for about 10 minutes to receive the AFA bundle.
                    </NoticeItem>
                </NoticeContent>
            </Notice>

            {settings && settings.enabled ? (
                <div className={"mt-4 max-w-2xl mx-auto"}>
                    <AfaBundleForm/>
                </div>
            ) : (
                <DisabledNotice className="mt-4" title={"AFA Bundle Purchase Not Unavailable"}>
                    AFA Bundle purchase is currently unavailable. Please come
                    back later or contact support for more information.
                </DisabledNotice>
            )}
        </Page>
    );
};

export default AfaBundlePurchase;
