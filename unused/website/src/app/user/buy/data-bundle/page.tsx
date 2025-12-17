"use client"

import React, {useState} from "react";
import BuyBundleForm from "@/ui/forms/buy-bundle-form";
import {getAllProviders} from "@/lib/providers";
import {Button} from "@/cn/components/ui/button";

type BuyBundlePageProps = React.HTMLAttributes<HTMLDivElement>;

const BuyBundlePage: React.FC<BuyBundlePageProps> = ({}) => {
    const [tab, setTab] = useState(getAllProviders()[0].id);
    const [showTabs, setShowTabs] = useState(true);

    return (
        <div className={"h-full flex flex-col gap-4"}>
            <h2 className={"text-xl"}>Buy Data Bundles</h2>
            {
                showTabs && <div className={"grid grid-cols-3 max-w-md gap-2"}>
                    {
                        getAllProviders().map((provider) => (
                            <Button variant={tab == provider.id ? "default" : "secondary"} key={provider.id} onClick={() => setTab(provider.id)}>{provider.name}</Button>
                        ))
                    }
                </div>
            }
            <div className={"grow overflow-y-auto"}>
                {
                    getAllProviders().map((provider) => (
                        <div className={`w-full h-full ${provider.id == tab ? "block" : "hidden"}`} key={provider.id}>
                            <BuyBundleForm key={provider.id} networkId={provider.id} onStateChanged={(state) => {setShowTabs(state == 1)}} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default BuyBundlePage;