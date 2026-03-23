import * as React from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import type { Network } from "@common/data-bundle";
import { cn } from "@/cn/lib/utils";
import { useAgentStore } from "@/lib/useAgentStore.ts";
import { useEffect } from "react";
import { R } from "@/app/routes";
import { Timestamp } from "firebase/firestore";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {StoreIcon, ClockIcon, MessageCircleMore, SearchIcon, SignalHighIcon} from "lucide-react";
import {buttonVariants} from "@/cn/components/ui/button.tsx";

function toDate(ts: Timestamp): Date {
    return Timestamp.fromMillis(ts.seconds * 1000 + ts.nanoseconds / 1e6).toDate();
}

const networkClassName: Record<Network, string> = {
    mtn: "border-mtn bg-mtn/10",
    telecel: "border-telecel bg-telecel/10",
    at: "border-airteltigo bg-airteltigo/10",
};

const networkName: Record<Network, string> = {
    mtn: "MTN",
    telecel: "Telecel",
    at: "AirtelTigo",
};

interface BigNetworkCardProps extends React.HTMLAttributes<HTMLDivElement> {
    network: Network;
}
const BigNetworkCard: React.FC<BigNetworkCardProps> = ({ network, className, ...props }) => (
    <div className={cn(
        networkClassName[network],
        "max-w-96 h-48 rounded-xl border-2 shadow-2xl cursor-pointer",
        "text-2xl font-semibold flex flex-col gap-4 items-center justify-center",
        className
    )} {...props}>
        <SignalHighIcon className="size-12" />
        {networkName[network]}
    </div>
);

const AgentStorePage: React.FC = () => {
    const { storeId = "wondamart" } = useParams();
    const navigate = useNavigate();
    const { agentStore, fetchAgentStore } = useAgentStore();

    useEffect(() => {
        fetchAgentStore(storeId).then();
    }, [fetchAgentStore, storeId]);

    if (!agentStore) {
        return "No agent store found";
    }

    const handleNetworkClick = (network: Network) => {
        navigate(R.client.bundles(storeId ?? "", network));
    };

    return (
        <Page className="pb-8 bg-violet-500">
            <PageContent className="max-w-4xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl p-6 bg-wondamart text-primary-foreground">
                    <div className={"flex items-start justify-between"}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-9 items-center justify-center rounded-md bg-violet-500 text-white">
                                <StoreIcon className="size-4" />
                            </div>
                            <div>
                                <p className="font-semibold">{agentStore.storeName}</p>
                                <p className="text-sm text-primary-foreground">{agentStore.email}</p>
                            </div>
                        </div>
                        {
                            storeId == "wondamart" ? (
                                // Todo: want to change number at backend
                                <a className="flex size-9 md:w-auto md:px-2 md:gap-2 items-center justify-center rounded-md bg-green-500 text-white" href={R.utils.admin}>
                                    <MessageCircleMore className="size-4" />
                                    <span className={"hidden md:inline-block"}>WhatsApp Support</span>
                                </a>
                            ) : (
                                <p className="text-lg">{agentStore.phoneNumber}</p>
                            )
                        }
                    </div>
                    {/*<div className="flex items-center justify-center flex-col">*/}
                    {/*    {*/}
                    {/*        storeId != "wondamart" && (*/}
                    {/*            <img src={agentStore.logoUrl} alt={`${agentStore.storeName} logo`} className="w-24 h-24 rounded-full object-cover mb-4" />*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*</div>*/}
                    <div className="flex gap-4 items-center justify-center mt-4">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-4" />
                            <p>Open at: {toDate(agentStore.openingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-4" />
                            <p>Close at: {toDate(agentStore.closingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                    </div>
                </div>

                <Link to={R.client.track} className={cn(
                    buttonVariants({size: "lg", variant: "outline"}),
                    "max-w-md mx-auto border border-green-600 bg-card",
                    "flex items-center justify-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                )}>
                    <SearchIcon className="mr-2 size-4" />
                    Track order
                </Link>

                <div className="rounded-xl border bg-card p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-semibold">Data Bundles</h2>
                        <p className="text-muted-foreground">Select a network to view available bundles</p>
                    </div>
                    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(8rem,24rem))] place-content-center">
                        <BigNetworkCard network="mtn" onClick={() => handleNetworkClick("mtn")} />
                        <BigNetworkCard network="telecel" onClick={() => handleNetworkClick("telecel")} />
                        <BigNetworkCard network="at" onClick={() => handleNetworkClick("at")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to={R.login}
                            className="underline underline-offset-4"
                        >
                            Login
                        </Link>
                    </p>
                    <p className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            to={R.signup}
                            className="underline underline-offset-4"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </PageContent>
        </Page>
    );
};

export default AgentStorePage;
