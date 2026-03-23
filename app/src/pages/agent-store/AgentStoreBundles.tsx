import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Network } from "@common/data-bundle";
import type { AgentDataBundle } from "@common/agent";
import { useAgentStore } from "@/lib/useAgentStore.ts";
import { R } from "@/app/routes";
import {Button} from "@/cn/components/ui/button.tsx";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {ArrowLeftIcon, PackageIcon} from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";

const networkName: Record<Network, string> = {
    mtn: "MTN",
    telecel: "Telecel",
    at: "AirtelTigo",
};

interface BundleCardProps {
    bundle: AgentDataBundle;
    onClick: () => void;
}
const BundleCard: React.FC<BundleCardProps> = ({ bundle, onClick }) => (
    <div
        className="border border-primary rounded-xl p-6 cursor-pointer hover:bg-accent transition space-y-2 flex flex-col items-center justify-center min-h-40 shadow-lg shadow-primary/25 bg-card"
    >
        <p className="text-3xl font-bold">{bundle.dataPackage.data} MB</p>
        <p className="text-sm text-muted-foreground">{bundle.name}</p>
        <p className="text-xl font-semibold">{toCurrency(bundle.agentPrice)}</p>

        <Button onClick={onClick} className={"w-full"}>
            Buy
        </Button>
    </div>
);

const AgentStoreBundlesPage: React.FC = () => {
    const { storeId, network } = useParams<{ storeId: string; network: Network }>();
    const navigate = useNavigate();
    const { agentStore } = useAgentStore();

    if (!agentStore || !network) return null;

    const filteredBundles = agentStore.dataBundles.filter(
        b => b.network === network && b.enabled
    );

    const handleBundleClick = (bundle: AgentDataBundle) => {
        navigate(R.client.checkout(storeId ?? ""), { state: { bundle, network } });
    };

    return (
        <Page className="pb-8">
            <PageContent className="max-w-4xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-green-500 text-white">
                            <PackageIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{networkName[network]} Bundles</p>
                            <p className="text-xs text-muted-foreground">Available data packages</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:underline mb-4">
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </button>

                    {filteredBundles.length === 0 ? (
                        <p className="text-muted-foreground">No bundles available for this network.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
                            {filteredBundles.map(bundle => (
                                <BundleCard
                                    key={bundle.id}
                                    bundle={bundle}
                                    onClick={() => handleBundleClick(bundle)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </PageContent>
        </Page>
    );
};

export default AgentStoreBundlesPage;
