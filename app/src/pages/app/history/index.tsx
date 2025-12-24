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
    const {user} = useAppStore();
    const [txes, setTxes] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // cursor stores the last seen date.seconds for pagination
    const cursorRef = useRef<number | undefined>(undefined);

    // Helper to update the `type` search param (or clear it)
    const setTypeFilter = (type?: FilterType) => {
        const next = new URLSearchParams(searchParams.toString());
        if (type) {
            next.set("type", type as string);
        } else {
            // clear -> show all
            next.delete("type");
        }
        // reset cursor when changing filter
        cursorRef.current = undefined;
        setTxes([]);
        setSearchParams(next);
    };

    // Build filter object from current search params
    const buildFilterFromSearchParams = (): FilterObject => {
        const next: FilterObject = {};
        const t = searchParams.get("type");
        // when t === "purchase" we don't set a server type filter - it's client-side
        if (t && t !== "purchase") next.type = t as TxType;
        return next;
    };

    // Ensure default is "purchase" if no type param is present
    useEffect(() => {
        if (!searchParams.has("type")) {
            const next = new URLSearchParams(searchParams.toString());
            next.set("type", "purchase");
            setSearchParams(next, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Core fetch page logic. If `append` is false we reset list, otherwise append to existing.
    const fetchPage = async (append: boolean = false) => {
        if (!user) return;
        const tParam = searchParams.get("type") as FilterType | null;
        const isPurchaseView = tParam === "purchase" || (tParam === null && true); // default handled earlier

        if (!append) {
            setLoading(true);
            cursorRef.current = undefined;
            setTxes([]);
        } else {
            setLoadingMore(true);
        }

        try {
            const pageSize = PAGE_SIZE;

            if (isPurchaseView) {
                // We must fetch server pages and filter out deposits until we collect `pageSize` purchases or server exhausted
                let collected: Tx[] = append ? [...txes] : [];
                let localCursor = cursorRef.current; // seconds
                let exhausted = false;

                while (collected.length < pageSize && !exhausted) {
                    const serverLimit = pageSize; // fetch in batches of pageSize
                    const query: TxQuery = { uid: user?.uid ?? "", limit: serverLimit } as any;
                    if (localCursor) query.startAfter = localCursor;
                    // Note: buildFilterFromSearchParams returns empty for 'purchase'
                    Object.assign(query, buildFilterFromSearchParams());

                    const res = await ClTx.read(query);
                    if (!res || res.length === 0) {
                        exhausted = true;
                        break;
                    }

                    // Append non-deposit items
                    for (const tx of res) {
                        if (tx.type !== "deposit") collected.push(tx);
                    }

                    // update localCursor to last item's date.seconds from server response
                    const last = res[res.length - 1];
                    localCursor = last?.date?.seconds ?? undefined;

                    // if server returned fewer than requested then it's exhausted
                    if (res.length < serverLimit) exhausted = true;
                }

                // Trim to pageSize
                const pageItems = collected.slice(0, pageSize);
                // update cursorRef to last server cursor if we fetched anything
                cursorRef.current = localCursor;

                // determine hasMore: if we collected less than requested and exhausted then no more; else yes
                setHasMore(collected.length > pageItems.length || !exhausted);

                if (append) setTxes(page => [...page, ...pageItems]);
                else setTxes(pageItems);
            } else {
                // Specific server-side filter (including deposit or other tx types)
                const query: TxQuery = { uid: user?.uid ?? "", limit: PAGE_SIZE } as any;
                Object.assign(query, buildFilterFromSearchParams());
                if (cursorRef.current) query.startAfter = cursorRef.current;

                const res = await ClTx.read(query);
                if (!res) {
                    setHasMore(false);
                    if (append) setTxes(page => page);
                    else setTxes([]);
                } else {
                    // update cursor
                    const last = res[res.length - 1];
                    cursorRef.current = last?.date?.seconds ?? undefined;
                    setHasMore(res.length >= PAGE_SIZE);

                    if (append) setTxes(page => [...page, ...res]);
                    else setTxes(res);
                }
            }
        } catch (e) {
            console.error(e);
            if (!append) setTxes([]);
        } finally {
            if (!append) setLoading(false);
            else setLoadingMore(false);
        }
    };

    useEffect(() => {
        // reset cursor when filter changes
        cursorRef.current = undefined;
        fetchPage(false).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, searchParams]);

    const activeType = (searchParams.get("type") ?? null) as FilterType | null;

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
            {/*List of query buttons to deposit, purchase, afa-bundles, data-bundles, result checker and filter*/}
            {/*Filter buttons*/}
            <div className={"flex gap-2 overflow-x-auto my-2 hidden-scroll-bar"}>
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
