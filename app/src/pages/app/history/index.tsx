import React, {useEffect, useState} from "react";
import {useAppStore} from "@/lib/useAppStore.ts";
import LoadingView from "@/ui/components/views/LoadingView.tsx";
import type {Tx, TxQuery, TxType} from "@common/types/tx.ts";
import {ClTx} from "@common/client-api/tx.ts";
import NoItems from "@/ui/components/cards/NoItems.tsx";
import {getTxIcon} from "@/lib/icons.ts";
import TxCard from "@/ui/components/cards/tx/TxCard.tsx";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import {useSearchParams} from "react-router-dom";
import PageContent from "@/ui/page/PageContent.tsx";
import {Button} from "@/cn/components/ui/button.tsx";

type FilterObject = Omit<TxQuery, "uid">;

const HistoryIndex: React.FC = () => {
    const {user} = useAppStore();
    const [txes, setTxes] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to update the `type` search param (or clear it)
    const setTypeFilter = (type?: TxType) => {
        const next = new URLSearchParams(searchParams.toString());
        if (type) {
            next.set("type", type as string);
        } else {
            next.delete("type");
        }
        setSearchParams(next);
    };

    // Build filter object from current search params
    const buildFilterFromSearchParams = (): FilterObject => {
        const next: FilterObject = {};
        const t = searchParams.get("type");
        if (t) next.type = t as TxType;
        return next;
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const filterObject = buildFilterFromSearchParams();
                const txes = await ClTx.read({uid: user?.uid ?? "", ...filterObject});
                console.log(txes);
                setTxes(txes.sort((a, b) => b.date.seconds - a.date.seconds));
            } catch (e) {
                console.error(e);
                setTxes([]);
            } finally {
                setLoading(false);
            }
        }
        // only fetch when we have a user
        if (user) fetch().then();
    }, [user, searchParams]);

    const activeType = (searchParams.get("type") ?? null) as TxType | null;

    const TX_TYPES: {label: string; value: TxType}[] = [
        {label: "Deposit", value: "deposit" as TxType},
        {label: "Purchase", value: "purchase" as TxType},
        {label: "AFA Bundle", value: "afa-bundle" as TxType},
        {label: "Data Bundle", value: "data-bundle" as TxType},
        {label: "Result Checker", value: "result-checker" as TxType},
    ];

    return (
        <Page>
            <PageHeading>History</PageHeading>
            {/*List of query buttons to deposit, purchase, afa-bundles, data-bundles, result checker and filter*/}
            {/*Filter buttons*/}
            <div className={"flex gap-2 overflow-x-auto my-2"}>
                <Button size={"sm"} variant={activeType === null ? "default" : "outline"} onClick={() => setTypeFilter(undefined)}>
                    All
                </Button>
                {TX_TYPES.map((t) => (
                    <Button
                        key={t.value}
                        size={"sm"}
                        variant={activeType === t.value ? "default" : "outline"}
                        onClick={() => setTypeFilter(t.value)}
                    >
                        {t.label}
                    </Button>
                ))}
            </div>
            <PageContent className={"grid md:grid-cols-2 gap-4 mt-4"}>
                {
                    loading ? (<LoadingView className={"md:col-span-2"} />)
                        : txes.length === 0
                            ? (
                                <NoItems className={"md:col-span-2"} Icon={getTxIcon["tx"]}>No transactions yet.</NoItems>
                            )
                            : (
                                txes.map((tx, index) => (<TxCard key={index} tx={tx} />))
                            )
                }
            </PageContent>
        </Page>
    );
};

export default HistoryIndex;
