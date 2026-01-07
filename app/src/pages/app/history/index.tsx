import React, {useEffect, useState, useRef} from "react";
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

// purchases is a special filter that represents every tx type except "deposit"
type FilterType = TxType | "purchase";
type FilterObject = Omit<TxQuery, "uid">;
const PAGE_SIZE = 20;

const HistoryIndex: React.FC = () => {
    const { user } = useAppStore();
    const [txes, setTxes] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const cursorRef = useRef<any | undefined>(undefined);

    const setTypeFilter = (type?: FilterType) => {
        const next = new URLSearchParams(searchParams.toString());
        if (type) next.set("type", type);
        else next.delete("type");
        setSearchParams(next);
    };

    const buildFilterFromSearchParams = (): FilterObject => {
        const next: FilterObject = {};
        const t = searchParams.get("type");
        if (t && t !== "purchase" && t !== "all") next.type = t as TxType;
        return next;
    };

    const fetchPage = async (append: boolean = false) => {
        if (!user) return;
        const tParam = searchParams.get("type") || "purchase";
        const isPurchaseView = tParam === "purchase";

        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const pageSize = PAGE_SIZE;
            let finalItems: Tx[] = [];
            let exhausted = false;

            if (isPurchaseView) {
                let collected: Tx[] = [];
                let localCursor = append ? cursorRef.current : undefined;

                while (collected.length < pageSize && !exhausted) {
                    const query: TxQuery = {
                        uid: user.uid,
                        limit: pageSize,
                        startAfter: localCursor
                    } as any;

                    const res = await ClTx.read(query);
                    if (!res || res.length === 0) {
                        exhausted = true;
                        break;
                    }

                    const filtered = res.filter(tx => tx.type !== "deposit");
                    collected.push(...filtered);

                    localCursor = res[res.length - 1].date;
                    if (res.length < pageSize) exhausted = true;
                }

                finalItems = collected.slice(0, pageSize);
                cursorRef.current = localCursor;
                setHasMore(!exhausted || collected.length > pageSize);
            } else {
                const query: TxQuery = {
                    uid: user.uid,
                    limit: pageSize,
                    startAfter: append ? cursorRef.current : undefined
                } as any;
                Object.assign(query, buildFilterFromSearchParams());

                const res = await ClTx.read(query);
                // console.log("length of Tx Found ", res.length)
                finalItems = res || [];
                cursorRef.current = finalItems.length > 0 ? finalItems[finalItems.length - 1].date : undefined;
                setHasMore(finalItems.length === pageSize);
            }

            setTxes(prev => append ? [...prev, ...finalItems] : finalItems);
            console.log("length of Tx Found ", txes.length)
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 2. FIXED: Effect synchronization
    useEffect(() => {
        // Redirect to 'purchase' if no type is set
        if (!searchParams.has("type")) {
            setSearchParams({ type: "purchase" }, { replace: true });
            return;
        }

        // Reset cursor and fetch when params change
        cursorRef.current = undefined;
        fetchPage(false).then(() => {});
    }, [user?.uid, searchParams.get("type")]); // Only depend on the specific param

    const activeType = searchParams.get("type") as FilterType;

    const TX_TYPES: {label: string; value: FilterType}[] = [
        {label: "Deposit", value: "deposit" as FilterType},
        {label: "Purchase", value: "purchase" as FilterType},
        {label: "AFA Bundle", value: "afa-bundle" as FilterType},
        {label: "Data Bundle", value: "data-bundle" as FilterType},
        {label: "Result Checker", value: "result-checker" as FilterType},
    ];

    return (
        <Page>
            <PageHeading>History</PageHeading>
            {/*Filter buttons*/}
            <div className={"flex gap-2 overflow-x-auto my-2 hidden-scroll-bar"}>
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
                                txes.map((tx, index) => (<TxCard key={tx.id ?? index} tx={tx} />))
                            )
                }

                {/* Load more button spans full width */}
                {!loading && txes.length > 0 && (
                    <div className={"md:col-span-2 flex justify-center mt-2"}>
                        {hasMore ? (
                            <Button onClick={() => fetchPage(true)} disabled={loadingMore} size={"sm"}>
                                {loadingMore ? "Loading..." : "Load more"}
                            </Button>
                        ) : (
                            <div className={"text-sm text-muted-foreground"}>No more transactions</div>
                        )}
                    </div>
                )}
            </PageContent>
        </Page>
    );
};

export default HistoryIndex;
