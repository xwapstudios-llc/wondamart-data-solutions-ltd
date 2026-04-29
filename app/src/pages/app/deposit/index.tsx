import React from 'react';
import Page from "@/ui/page/Page.tsx";
import { useAppStore } from "@/lib/useAppStore.ts";
import { WalletIcon } from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";
import PageContent from "@/ui/page/PageContent.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/cn/components/ui/tabs.tsx";
import PaystackDeposit from "./PaystackDeposit.tsx";
import ManualTopup from "./ManualTopup.tsx";

const Deposit: React.FC = () => {
    const { wallet } = useAppStore();

    return (
        <Page>
            <PageContent className="max-w-4xl mx-auto space-y-4">

                {/* Balance card */}
                <div className="rounded-xl bg-linear-to-br from-wondamart to-primary p-5 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex size-9 items-center justify-center rounded-md bg-white/20">
                            <WalletIcon className="size-5" />
                        </div>
                        <span className="text-sm font-medium opacity-90">Current Balance</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {toCurrency(wallet?.balance ?? 0)}
                    </p>
                    <p className="text-xs opacity-70 mt-1">Funds available in your wallet</p>
                </div>

                <Tabs defaultValue="paystack" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger className={"data-[state=active]:text-primary-foreground!"} value="paystack">Instant Deposit</TabsTrigger>
                        <TabsTrigger className={"data-[state=active]:text-primary-foreground!"} value="manual">Manual Topup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paystack">
                        <PaystackDeposit />
                    </TabsContent>
                    <TabsContent value="manual">
                        <ManualTopup />
                    </TabsContent>
                </Tabs>
            </PageContent>
        </Page>
    );
};

export default Deposit;
