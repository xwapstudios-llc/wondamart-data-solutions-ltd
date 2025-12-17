import React, {useEffect, useState} from 'react';
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/cn/components/ui/tabs.tsx";
import PaystackDepositView from "@/ui/components/views/deposit/PaystackDepositView.tsx";
import SendDepositView from "@/ui/components/views/deposit/SendDepositView.tsx";
import MoMoDepositView from "@/ui/components/views/deposit/MoMoDepositView.tsx";
import type {CommonPaymentMethods} from '@common/types/common-settings';
import {ClCommonSettings} from '@common/client-api/db-common-settings';

const Deposit: React.FC = () => {
    const [settings, setSettings] = useState<CommonPaymentMethods | null>(null);

    useEffect(() => {
        const run = async () => {
            return await ClCommonSettings.read_paymentMethods();
        }
        run().then(r => setSettings(r));
    });

    return (
        <Page>
            <PageHeading>Deposit</PageHeading>
            <PageSubHeading>Deposit funds into your account.</PageSubHeading>

            <Tabs defaultValue={"paystack"} className={"mt-4 space-y-2"}>
                <TabsList className={"w-full sticky top-16"}>
                    <TabsTrigger className={"dark:data-[state=active]:text-primary-foreground"}
                                 value={"paystack"}>Paystack</TabsTrigger>
                    <TabsTrigger className={"dark:data-[state=active]:text-primary-foreground"} value={"send"}>Send
                        (new)</TabsTrigger>
                    <TabsTrigger className={"dark:data-[state=active]:text-primary-foreground"} value={"momo"}>MoMo
                        (new)</TabsTrigger>
                </TabsList>
                <TabsContent value={"paystack"}>
                    <PaystackDepositView disabled={settings ? !settings?.paystack.enabled : true}/>
                </TabsContent>
                <TabsContent value={"send"}>
                    <SendDepositView disabled={settings ? !settings?.send.enabled : true}/>
                </TabsContent>
                <TabsContent value={"momo"}>
                    <MoMoDepositView disabled={settings ? !settings?.momo.enabled : true}/>
                </TabsContent>
            </Tabs>
        </Page>
    );
};

export default Deposit;

