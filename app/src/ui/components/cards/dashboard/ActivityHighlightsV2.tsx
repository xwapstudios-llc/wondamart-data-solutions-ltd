import React, {useCallback, useEffect, useState} from "react";
import {cn} from "@/cn/lib/utils";
import {getTxIcon, toCurrency} from "@/lib/icons.ts";
import {
    CheckCircleIcon,
    ClockIcon,
    CoinsIcon,
    Package2Icon,
    RefreshCwIcon,
    TrendingUpIcon,
} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore.ts";
import type {Tx, TxQuery} from "@common/tx.ts";
import {Timestamp} from "firebase/firestore";
import {ClTxDataBundle} from "@common/client-api/tx-data-bundle.ts";
import {ClTxAFABundle} from "@common/client-api/tx-afa-bundle.ts";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker.ts";
import FilterButton from "@/ui/components/FilterButton.tsx";
import type {TxDataBundleData} from "@common/types/data-bundle.ts";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";

type ActivityHighlightsProps = React.HTMLAttributes<HTMLDivElement>;

// ─── Stat tile ────────────────────────────────────────────────────────────────

interface StatTileProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    sub?: string;
    loading?: boolean;
}

export
const StatTile: React.FC<StatTileProps> = ({label, value, icon, iconBg, sub, loading}) => (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-md text-white", iconBg)}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            {loading
                ? <Skeleton className="h-5 w-16 mt-0.5" />
                : <p className="font-semibold text-sm leading-tight truncate">{value}{sub && <span className="text-xs text-muted-foreground ml-1">{sub}</span>}</p>
            }
        </div>
    </div>
);

// ─── Network row ──────────────────────────────────────────────────────────────

interface NetworkRowProps {
    dotClass: string;
    label: string;
    value: string;
    loading?: boolean;
}

const NetworkRow: React.FC<NetworkRowProps> = ({dotClass, label, value, loading}) => (
    <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
            <div className={cn("size-3 rounded-sm shrink-0", dotClass)} />
            <span className="text-sm">{label}</span>
        </div>
        {loading ? <Skeleton className="h-4 w-12" /> : <span className="text-sm font-medium">{value}</span>}
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ActivityHighlightsV2: React.FC<ActivityHighlightsProps> = ({className, ...props}) => {
    const {profile} = useAppStore();
    const [loading, setLoading] = useState(true);

    // Todo: Adjust dates and times to fit
    const period = [
        {label: "Today",   value: "1"},
        {label: "This Week",  value: "7"},
        {label: "This Month",  value: "30"},
        {label: "This Year", value: "365"},
        {label: "All Time", value: "0"},
    ];
    const [selectedPeriod, setSelectedPeriod] = useState(period[0].value);

    const [bundleTx, setBundleTx]  = useState<Tx[]>([]);
    const [afaTx,    setAfaTx]     = useState<Tx[]>([]);
    const [rcTx,     setRcTx]      = useState<Tx[]>([]);
    const [error,    setError]     = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async () => {
        if (!profile) return;
        setLoading(true);
        setError(false);
        try {
            const now  = new Date();
            const from = new Date(now);
            from.setDate(now.getDate() - Number(selectedPeriod));

            const values: TxQuery = {
                agentId: profile.id,
                time: {from: Timestamp.fromDate(from), to: Timestamp.fromDate(now)},
            };

            const [dataBundles, afaBundles, resultChecker] = await Promise.all([
                ClTxDataBundle.read({...values}),
                ClTxAFABundle.read({...values}),
                ClTxResultChecker.read({...values}),
            ]);
            setBundleTx(dataBundles ?? []);
            setAfaTx(afaBundles ?? []);
            setRcTx(resultChecker ?? []);
        } catch {
            setBundleTx([]);
            setAfaTx([]);
            setRcTx([]);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [profile, selectedPeriod]);

    useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

    // ── Derived stats ──────────────────────────────────────────────────────────

    const totalTx = bundleTx.length + afaTx.length + rcTx.length;

    const commission = [...bundleTx, ...afaTx, ...rcTx]
        .reduce((s, tx) => s + (tx.commission ?? 0), 0);

    const byNetwork = (net: string) =>
        bundleTx.filter((tx) => (tx.txData as TxDataBundleData).network === net);

    const gbOf = (txs: Tx[]) =>
        txs.reduce((s, tx) => s + ((tx.txData as TxDataBundleData).dataPackage?.data ?? 0), 0);

    const amountOf = (txs: Tx[]) => txs.reduce((s, tx) => s + tx.amount, 0);

    const mtn       = byNetwork("mtn");
    const telecel   = byNetwork("telecel");
    const airteltigo = byNetwork("airteltigo");

    const totalSales =
        amountOf(bundleTx) + amountOf(afaTx) + amountOf(rcTx);

    const delivered = [...bundleTx, ...afaTx, ...rcTx].filter(tx => tx.status === "success").length;
    const pending   = [...bundleTx, ...afaTx, ...rcTx].filter(tx => tx.status === "pending" || tx.status === "processing").length;

    return (
        <div className={cn("space-y-3", className)} {...props}>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-wondamart text-white">
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <h4 className="font-semibold text-sm">Activity Overview</h4>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setRefreshKey(k => k + 1)}
                        disabled={loading}
                        className={cn(
                            "flex size-8 items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors disabled:opacity-40",
                            error && !loading && "text-destructive hover:bg-destructive/10"
                        )}
                        title="Refresh"
                    >
                        <RefreshCwIcon className={cn("size-3.5", loading && "animate-spin")} />
                    </button>
                    <FilterButton values={period} defaultIndex={0} onValueChange={setSelectedPeriod} />
                </div>
            </div>

            {/* Top stat tiles — 2-col grid */}
            <div className="grid grid-cols-2 gap-2">
                <StatTile
                    label="Total Orders"
                    value={totalTx}
                    icon={React.createElement(getTxIcon["tx"], {className: "size-4"})}
                    iconBg="bg-violet-500"
                    loading={loading}
                />
                <StatTile
                    label="Commission"
                    value={toCurrency(commission)}
                    icon={<CoinsIcon className="size-4" />}
                    iconBg="bg-amber-500"
                    loading={loading}
                />
                <StatTile
                    label="Delivered"
                    value={delivered}
                    icon={<CheckCircleIcon className="size-4" />}
                    iconBg="bg-emerald-500"
                    loading={loading}
                />
                <StatTile
                    label="Pending"
                    value={pending}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-orange-500"
                    loading={loading}
                />
            </div>

            {/* Sales breakdown card */}
            <div className="rounded-xl border bg-card p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-sky-500 text-white">
                        <Package2Icon className="size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight">Sales Breakdown</p>
                        <p className="text-xs text-muted-foreground">By network & product</p>
                    </div>
                    {loading
                        ? <Skeleton className="h-5 w-20 ml-auto" />
                        : <p className="ml-auto text-sm font-bold">{toCurrency(totalSales)}</p>
                    }
                </div>

                <div className="divide-y divide-border">
                    <NetworkRow dotClass="bg-mtn"       label="MTN"       value={`${toCurrency(amountOf(mtn))}`}       loading={loading} />
                    <NetworkRow dotClass="bg-telecel"   label="Telecel"   value={`${toCurrency(amountOf(telecel))}`} loading={loading} />
                    <NetworkRow dotClass="bg-airteltigo" label="AirtelTigo" value={`${toCurrency(amountOf(airteltigo))}`} loading={loading} />
                    <NetworkRow dotClass="bg-green-500" label="AFA Bundles"    value={`${toCurrency(amountOf(afaTx))}`}  loading={loading} />
                    <NetworkRow dotClass="bg-purple-500" label="Result Checkers" value={`${toCurrency(amountOf(rcTx))}`}   loading={loading} />
                </div>
            </div>

            {/* Product tiles — scrollable row */}
            <div className="flex gap-2 overflow-x-auto hidden-scroll-bar pb-0.5">
                {[
                    {label: "MTN",        value: `${gbOf(mtn)} GB`,        Icon: getTxIcon["bundle-purchase"], bg: "bg-mtn"},
                    {label: "Telecel",    value: `${gbOf(telecel)} GB`,    Icon: getTxIcon["bundle-purchase"], bg: "bg-telecel"},
                    {label: "AirtelTigo", value: `${gbOf(airteltigo)} GB`, Icon: getTxIcon["bundle-purchase"], bg: "bg-airteltigo"},
                    {label: "AFA",        value: `${afaTx.length} orders`, Icon: getTxIcon["afa-purchase"],    bg: "bg-green-500"},
                    {label: "Checker",    value: `${rcTx.length} units`,   Icon: getTxIcon["checker-purchase"], bg: "bg-purple-500"},
                ].map(({label, value, Icon, bg}) => (
                    <div key={label} className="shrink-0 rounded-xl border bg-card p-3 min-w-28 space-y-2">
                        <div className={cn("flex size-8 items-center justify-center rounded-md text-white", bg)}>
                            <Icon className="size-4" />
                        </div>
                        {loading
                            ? <Skeleton className="h-4 w-14" />
                            : <p className="text-sm font-semibold">{value}</p>
                        }
                        <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ActivityHighlightsV2;
