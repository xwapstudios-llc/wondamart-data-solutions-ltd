import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/cn/components/ui/tabs.tsx";
import PaystackDepositView from "@/ui/components/views/deposit/PaystackDepositView.tsx";
import SendDepositView from "@/ui/components/views/deposit/SendDepositView.tsx";
import MoMoDepositView from "@/ui/components/views/deposit/MoMoDepositView.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";

const Deposit: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.paymentMethods;

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
                    <PaystackDepositView disabled={!settings.paystack.enabled}/>
                </TabsContent>
                <TabsContent value={"send"}>
                    <SendDepositView disabled={!settings.send.enabled}/>
                </TabsContent>
                <TabsContent value={"momo"}>
                    <MoMoDepositView disabled={!settings.momo.enabled}/>
                </TabsContent>
            </Tabs>
        </Page>
    );
};

export default Deposit;

