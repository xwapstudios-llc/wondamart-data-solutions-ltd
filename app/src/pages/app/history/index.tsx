import React, {useEffect, useState} from "react";
import {useAppStore} from "@/lib/useAppStore.ts";
import LoadingView from "@/ui/components/views/LoadingView.tsx";
import type {Tx} from "@common/types/tx.ts";
import {ClTx} from "@common/client-api/tx.ts";
import NoItems from "@/ui/components/cards/NoItems.tsx";
import {getTxIcon} from "@/lib/icons.ts";
import TxCard from "@/ui/components/cards/tx/TxCard.tsx";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {useSearchParams} from "react-router-dom";

const HistoryIndex: React.FC = () => {
    const {user} = useAppStore();
    const [txes, setTxes] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams(); // TODO: allow search params

    useEffect(() => {
        const fetch = async () => {
            if (txes.length === 0) {
                setLoading(true);
                const txes = await ClTx.read({uid: user?.uid ?? ""});
                console.log(txes);
                setTxes(txes.sort((a, b) => b.date.seconds - a.date.seconds));
            }
        }
        fetch().then().catch(e => console.error(e)).finally(() => setLoading(false));
    }, [txes, user]);

    return (
        <Page>
            <PageHeading>History</PageHeading>
            <PageSubHeading>
                View your transaction and deposit history.
            </PageSubHeading>
            {
                loading ? (<LoadingView />)
                    : txes.length === 0
                        ? (
                            <NoItems Icon={getTxIcon["tx"]}>No transactions yet.</NoItems>
                        )
                    : (
                        <div className={"grid md:grid-cols-2 gap-4 mt-4"}>
                            {
                                txes.map((tx, index) => (<TxCard key={index} tx={tx} />))
                            }
                        </div>
                    )
            }
        </Page>
    );
};

export default HistoryIndex;
