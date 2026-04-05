import React, {useCallback, useEffect, useState} from "react";
import {cn} from "@/cn/lib/utils";
import {getTxIcon, toCurrency} from "@/lib/icons.ts";
import {
    CheckCircleIcon,
    ClockIcon,
    Package2Icon,
    RefreshCwIcon,
    TrendingUpIcon,
    type LucideIcon, WalletIcon, DollarSignIcon, User2Icon, UsersIcon, PaperclipIcon, MailsIcon, WebhookIcon,
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


// ─── Big Dash card ────────────────────────────────────────────────────────────────

interface DashCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string,
    value: string | number,
    Icon: LucideIcon,
    description?: string,
}
const DashCard: React.FC<DashCardProps> = ({className, title, value, Icon, description, ...props}) => {
    return (
        <div className={cn(
            className,
            "rounded-xl bg-linear-to-br from-wondamart/80 to-wondamart p-5 text-white",
        )} {...props}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-white/20">
                        <Icon className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs opacity-75">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                    </div>
                </div>
            </div>
            {
                description && (<p className="text-xs opacity-70 mt-1">{description}</p>)
            }
        </div>
    )
}
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

    // const commission = [...bundleTx, ...afaTx, ...rcTx]
    //     .reduce((s, tx) => s + (tx.commission ?? 0), 0);

    const byNetwork = (net: string) =>
        bundleTx.filter((tx) => (tx.txData as TxDataBundleData).network === net);

    const gbOf = (txs: Tx[]) =>
        txs.reduce((s, tx) => s + ((tx.txData as TxDataBundleData).dataPackage?.data ?? 0), 0);

    const amountOf = (txs: Tx[]) => txs.reduce((s, tx) => s + tx.amount, 0);

    const mtn = byNetwork("mtn");
    const telecel = byNetwork("telecel");
    const airteltigo = byNetwork("airteltigo");

    const totalSales = amountOf(bundleTx) + amountOf(afaTx) + amountOf(rcTx);

    const delivered = [...bundleTx, ...afaTx, ...rcTx].filter(tx => tx.status === "success").length;
    // const pending   = [...bundleTx, ...afaTx, ...rcTx].filter(tx => tx.status === "pending" || tx.status === "processing").length;

    const pendingMtn = mtn.filter(tx => tx.status === "pending" || tx.status === "processing").length;
    const pendingTelecel = telecel.filter(tx => tx.status === "pending" || tx.status === "processing").length;
    const pendingAirteltigo = airteltigo.filter(tx => tx.status === "pending" || tx.status === "processing").length;

    return (
        <div className={cn("space-y-3", className)} {...props}>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-wondamart text-white">
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <h4 className="font-semibold text-sm">Overview</h4>
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

            {/* Balance card */}
            <div className={"grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4"}>
                <DashCard
                    title={"Agents Balance"}
                    Icon={WalletIcon}
                    value={toCurrency(0)}
                    description={"Total balance of all agents"}
                />
                <DashCard
                    title={"Orders"}
                    Icon={WalletIcon}
                    value={toCurrency(0)}
                    description={"Sum of all placed orders"}
                />
                <DashCard
                    title={"Manual Funding"}
                    Icon={DollarSignIcon}
                    value={toCurrency(0)}
                    description={"Sum of all manually requested deposits by agents"}
                />
                <DashCard
                    title={"Paystack Funds"}
                    Icon={DollarSignIcon}
                    value={toCurrency(0)}
                    description={"Sum of all paystack funds. Both orders and deposits. This include paystack charges"}
                />

                {/*-------------*/}
                <DashCard
                    title={"Agents"}
                    Icon={UsersIcon}
                    value={0}
                    description={"The total number of agents. This includes all agents regardless of their status"}
                />
                <DashCard
                    title={"Administrators"}
                    Icon={User2Icon}
                    value={0}
                    description={"All administrators of Wondamart"}
                />

                <DashCard
                    title={"Manual Funding Requests"}
                    Icon={PaperclipIcon}
                    value={0}
                    description={"The total number of unattended manual funding requests from agents"}
                />
                <DashCard
                    title={"Unread Messages"}
                    Icon={MailsIcon}
                    value={0}
                    description={"The total number of unattended messages from agents"}
                />
            </div>

            {/* Pending by network stat tiles — 3-col grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
                <StatTile
                    label="Pending MTN"
                    value={pendingMtn}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-mtn"
                    loading={loading}
                />
                <StatTile
                    label="Pending Telecel"
                    value={pendingTelecel}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-telecel"
                    loading={loading}
                />
                <StatTile
                    label="Pending AirtelTigo"
                    value={pendingAirteltigo}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-airteltigo"
                    loading={loading}
                />

                {/*-------------*/}
                <StatTile
                    label="Pending AFA"
                    value={pendingAirteltigo}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-violet-500"
                    loading={loading}
                />
                <StatTile
                    label="Pending Checker"
                    value={pendingAirteltigo}
                    icon={<ClockIcon className="size-4" />}
                    iconBg="bg-orange-500"
                    loading={loading}
                />
                {/*-------------*/}

                <StatTile
                    label="Total Orders"
                    value={totalTx}
                    icon={React.createElement(getTxIcon["tx"], {className: "size-4"})}
                    iconBg="bg-violet-500"
                    loading={loading}
                />
                {/*<StatTile*/}
                {/*    label="Commission"*/}
                {/*    value={toCurrency(commission)}*/}
                {/*    icon={<CoinsIcon className="size-4" />}*/}
                {/*    iconBg="bg-amber-500"*/}
                {/*    loading={loading}*/}
                {/*/>*/}
                <StatTile
                    label="Delivered"
                    value={delivered}
                    icon={<CheckCircleIcon className="size-4" />}
                    iconBg="bg-emerald-500"
                    loading={loading}
                />
                {/*<StatTile*/}
                {/*    label="Pending"*/}
                {/*    value={pending}*/}
                {/*    icon={<ClockIcon className="size-4" />}*/}
                {/*    iconBg="bg-orange-500"*/}
                {/*    loading={loading}*/}
                {/*/>*/}
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
                    <NetworkRow dotClass="bg-mtn"       label="MTN"       value={`${gbOf(mtn)} GB · ${toCurrency(amountOf(mtn))}`}       loading={loading} />
                    <NetworkRow dotClass="bg-telecel"   label="Telecel"   value={`${gbOf(telecel)} GB · ${toCurrency(amountOf(telecel))}`} loading={loading} />
                    <NetworkRow dotClass="bg-airteltigo" label="AirtelTigo" value={`${gbOf(airteltigo)} GB · ${toCurrency(amountOf(airteltigo))}`} loading={loading} />
                    <NetworkRow dotClass="bg-green-500" label="AFA Bundles"    value={`${afaTx.length} orders · ${toCurrency(amountOf(afaTx))}`}  loading={loading} />
                    <NetworkRow dotClass="bg-purple-500" label="Result Checkers" value={`${rcTx.length} units · ${toCurrency(amountOf(rcTx))}`}   loading={loading} />
                </div>
            </div>

            {/* API Payments tiles — scrollable row */}
            <h3 className={"font-semibold"}>API Cost</h3>
            <div className="flex gap-2 overflow-x-auto hidden-scroll-bar pb-0.5">
                {[
                    {label: "HendyLinks",        value: toCurrency(0),        Icon: WebhookIcon, bg: "bg-yellow-500"},
                    {label: "Skynet",        value: toCurrency(0),        Icon: WebhookIcon, bg: "bg-gray-500"},
                    {label: "Datamart",        value: toCurrency(0),        Icon: WebhookIcon, bg: "bg-blue-700"},
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
