import React, {useEffect, useRef, useState} from "react";
import {useAppStore} from "@/lib/useAppStore.ts";
import type {Tx, TxQuery, TxType} from "@common/tx.ts";
import {ClTx} from "@common/client-api/tx.ts";
import Page from "@/ui/page/Page.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {cn} from "@/cn/lib/utils.ts";
import {
    ArrowUpDownIcon,
    CompassIcon,
    DollarSignIcon,
    Package2Icon,
    BookOpenIcon,
    ShoppingBagIcon,
} from "lucide-react";
import TxTableCard from "@/ui/components/TxTableCard.tsx";
import {getTxIcon} from "@/lib/icons.ts";

// ─── Filter config ────────────────────────────────────────────────────────────

type FilterType = TxType | "purchase";

const FILTERS: {label: string; value: FilterType; icon: React.ReactNode; color: string; active: string}[] = [
    {
        label: "All Purchases", value: "purchase",
        icon: <ShoppingBagIcon className="size-3.5" />,
        color: "border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10",
        active: "bg-violet-500 text-white border-violet-500",
    },
    {
        label: "Data Bundles", value: "bundle-purchase",
        icon: <Package2Icon className="size-3.5" />,
        color: "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10",
        active: "bg-sky-500 text-white border-sky-500",
    },
    {
        label: "AFA Bundles", value: "afa-purchase",
        icon: <CompassIcon className="size-3.5" />,
        color: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
        active: "bg-emerald-500 text-white border-emerald-500",
    },
    {
        label: "Result Checkers", value: "checker-purchase",
        icon: <BookOpenIcon className="size-3.5" />,
        color: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
        active: "bg-amber-500 text-white border-amber-500",
    },
    {
        label: "Deposits", value: "paystack-deposit",
        icon: <DollarSignIcon className="size-3.5" />,
        color: "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10",
        active: "bg-rose-500 text-white border-rose-500",
    },
];

const PAGE_SIZE = 20;

// ─── Page ─────────────────────────────────────────────────────────────────────

const HistoryIndex: React.FC = () => {
    const {user} = useAppStore();
    const [txes, setTxes]               = useState<Tx[]>([]);
    const [loading, setLoading]         = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore]         = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const cursorRef = useRef<any>(undefined);

    const activeType = (searchParams.get("type") ?? "purchase") as FilterType;

    const fetchPage = async (append = false) => {
        if (!user) return;
        const isPurchase = activeType === "purchase";

        append ? setLoadingMore(true) : setLoading(true);

        try {
            let finalItems: Tx[] = [];
            let exhausted = false;

            if (isPurchase) {
                let collected: Tx[] = [];
                let localCursor = append ? cursorRef.current : undefined;

                while (collected.length < PAGE_SIZE && !exhausted) {
                    const res = await ClTx.read({
                        agentId: user.uid,
                        limit: PAGE_SIZE,
                        startAfter: localCursor,
                    } as any);

                    if (!res?.length) { exhausted = true; break; }

                    collected.push(...res.filter(
                        tx => tx.type !== "paystack-deposit" && tx.type !== "manual-deposit"
                    ));
                    localCursor = res[res.length - 1].time;
                    if (res.length < PAGE_SIZE) exhausted = true;
                }

                finalItems = collected.slice(0, PAGE_SIZE);
                cursorRef.current = localCursor;
                setHasMore(!exhausted || collected.length > PAGE_SIZE);
            } else {
                const query: TxQuery = {
                    agentId: user.uid,
                    limit: PAGE_SIZE,
                    startAfter: append ? cursorRef.current : undefined,
                    type: activeType as TxType,
                } as any;

                const res = await ClTx.read(query);
                finalItems = res ?? [];
                cursorRef.current = finalItems.at(-1)?.time;
                setHasMore(finalItems.length === PAGE_SIZE);
            }

            setTxes(prev => append ? [...prev, ...finalItems] : finalItems);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!searchParams.has("type")) {
            setSearchParams({type: "purchase"}, {replace: true});
            return;
        }
        cursorRef.current = undefined;
        fetchPage(false);
    }, [user?.uid, activeType]);

    const activeFilter = FILTERS.find(f => f.value === activeType) ?? FILTERS[0];

    return (
        <Page className="pb-8">
            <div className="max-w-4xl mx-auto space-y-4 pt-4">

                {/* Page header */}
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-wondamart text-white shrink-0">
                        <ArrowUpDownIcon className="size-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">History</h1>
                        <p className="text-xs text-muted-foreground">Your transaction records</p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto hidden-scroll-bar pb-0.5">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => navigate(`${R.app.history.index}?type=${f.value}`, {replace: true})}
                            className={cn(
                                "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                                activeType === f.value ? f.active : f.color
                            )}
                        >
                            {f.icon}
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Table card Section */}
                <TxTableCard
                    title={activeFilter.label}
                    icon={activeFilter.icon}
                    iconColor={
                        activeType === "purchase"         ? "bg-violet-500" :
                        activeType === "bundle-purchase"  ? "bg-sky-500"    :
                        activeType === "afa-purchase"     ? "bg-emerald-500":
                        activeType === "checker-purchase" ? "bg-amber-500"  :
                        "bg-rose-500"
                    }
                    transactions={txes}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={() => fetchPage(true)}
                    loadingMore={loadingMore}
                    recordCount={txes.length}
                    noItemsMessage="No transactions"
                    noItemsIcon={getTxIcon["tx"]}
                />

            </div>
        </Page>
    );
};

export default HistoryIndex;
