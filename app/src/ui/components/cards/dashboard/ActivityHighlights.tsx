import React, {useEffect, useState} from "react";
import {cn} from "@/cn/lib/utils";
import ActivityHighlightCard from "@/ui/components/cards/dashboard/ActivityHighlightCard.tsx";
import {getTxIcon, toCurrency} from "@/lib/icons.ts";
import {CheckCircle, HandCoinsIcon, HistoryIcon, TrendingUpIcon} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore.ts";
import type {Tx, TxQuery} from "@common/tx.ts";
import {Timestamp} from "firebase/firestore";
import {ClTxDataBundle} from "@common/client-api/tx-data-bundle.ts";
import {ClTxAFABundle} from "@common/client-api/tx-afa-bundle.ts";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker.ts";
import FilterButton from "@/ui/components/FilterButton.tsx";
import type {TxDataBundleData} from "@common/types/data-bundle.ts";

interface GraphData {
    periodName?: string;
    mtn: number,
    telecel: number,
    airteltigo: number,
}
type ActivityHighlightsProps = React.HTMLAttributes<HTMLDivElement>

const ActivityHighlights: React.FC<ActivityHighlightsProps> = ({className, ...props}) => {
    const {profile} = useAppStore();
    const [loading, setLoading] = useState(true);
    const period = [
        {label: "Today", value: "1"},
        {label: "3 days", value: "3"},
        {label: "7 days", value: "7"},
        {label: "14 days", value: "14"},
        {label: "31 days", value: "31"},
    ];
    const [selectedPeriod, setSelectedPeriod] = useState<string>(period[0].value);

    const [bundleTx, setBundleTx] = useState<Tx[]>([]);
    const [afaTx, setAfaTx] = useState<Tx[]>([]);
    const [rcTx, setRcTx] = useState<Tx[]>([]);

    useEffect(() => {
        if (!profile) return;

        const fetchData = async () => {
            setLoading(true);

            const now = new Date();
            const periodNum = Number(selectedPeriod);

            // All time → fetch everything, no date constraint
            let from: Date | null = null;
            if (periodNum > 0) {
                from = new Date(now);
                from.setDate(now.getDate() - periodNum);
            }

            const values: TxQuery = {
                agentId: profile.id,
                ...(from && {
                    time: { from: Timestamp.fromDate(from), to: Timestamp.fromDate(now) },
                }),
            };

            const [dataBundles, afaBundles, resultChecker] = await Promise.all([
                ClTxDataBundle.read({ ...values }),
                ClTxAFABundle.read({ ...values }),
                ClTxResultChecker.read({ ...values }),
            ]);
            setBundleTx(dataBundles);
            setAfaTx(afaBundles);
            setRcTx(resultChecker);

            console.log("Finish fetching transactions.");
            console.log("Data bundles:", dataBundles);
            console.log("AFA bundles:", afaBundles);
            console.log("Result checker:", resultChecker);
        };

        fetchData().then(() => {
            setLoading(false);
        });
    }, [profile, selectedPeriod]);

    const [commission, setCommission] = useState(0);
    const [transactions, setTransactions] = useState(0);
    const [graphData, setGraphData] = useState<GraphData[]>([]);
    const [mtnBundleGB, setMtnBundleGB] = useState(0);
    const [telecelBundleGB, setTelecelBundleGB] = useState(0);
    const [airteltigoBundleGB, setAirteltigoBundleGB] = useState(0);
    useEffect(() => {
        function calculateCommission() {
            let total = 0;
            bundleTx.forEach((tx) => { total += tx.commission ?? 0; });
            afaTx.forEach((tx) => { total += tx.commission ?? 0; });
            rcTx.forEach((tx) => { total += tx.commission ?? 0; });
            setCommission(total);
        }
        function calculateTransactions() {
            const total = rcTx.length + bundleTx.length + afaTx.length;
            setTransactions(total);
        }
        function calculateGraphData() {
            const data: GraphData[] = [];
            const mtn = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "mtn";
            })
            const telecel = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "telecel";
            })
            const airteltigo = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "airteltigo";
            })
            const getTotal = (transactions: Tx[]) => {
                let total = 0;
                transactions.forEach((tx) => {
                    total += tx.amount;
                });
                return total;
            }

            const periods = Number(selectedPeriod);
            const now = new Date();
            
            // Determine interval based on period
            let intervalHours: number;
            let totalIntervals: number;
            
            if (periods === 1) {
                // 24 hours: 2-hour intervals
                intervalHours = 2;
                totalIntervals = 12;
            } else if (periods === 3) {
                // 3 days: 6-hour intervals
                intervalHours = 6;
                totalIntervals = 12; // 3 days * 4 intervals per day
            } else {
                // 7+ days: 1-day intervals
                intervalHours = 24;
                totalIntervals = periods;
            }

            for (let i = totalIntervals - 1; i >= 0; i--) {
                const intervalStart = new Date(now);
                intervalStart.setHours(now.getHours() - (i + 1) * intervalHours, 0, 0, 0);
                
                const intervalEnd = new Date(now);
                intervalEnd.setHours(now.getHours() - i * intervalHours, 0, 0, 0);

                let periodName: string;
                if (intervalHours === 2) {
                    periodName = `${intervalStart.getHours()}:00`;
                } else if (intervalHours === 6) {
                    periodName = `${intervalStart.getDate()}/${intervalStart.getMonth() + 1} ${intervalStart.getHours()}:00`;
                } else {
                    periodName = `${intervalStart.getDate()}/${intervalStart.getMonth() + 1}`;
                }

                const filterTxInInterval = (txs: Tx[]) => txs.filter((tx) => {
                    const date = tx.time.toDate();
                    return date >= intervalStart && date < intervalEnd;
                });

                const mtnTotal = getTotal(filterTxInInterval(mtn));
                const telecelTotal = getTotal(filterTxInInterval(telecel));
                const airteltigoTotal = getTotal(filterTxInInterval(airteltigo));

                data.push({
                    periodName,
                    mtn: mtnTotal,
                    telecel: telecelTotal,
                    airteltigo: airteltigoTotal,
                });
            }

            setGraphData(data);
            console.log("Graph data: ", data);
        }
        function calculateBundleGB() {
            const mtn = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "mtn";
            })
            const telecel = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "telecel";
            })
            const airteltigo = bundleTx.filter((tx) => {
                const d = tx.txData as TxDataBundleData;
                return d.network && d.network === "airteltigo";
            })
            const getTotal = (transactions: Tx[]) => {
                let total = 0;
                transactions.forEach((tx) => {
                    const d = tx.txData as TxDataBundleData;
                    total += d.dataPackage.data || 0;
                });
                return total;
            }
            setMtnBundleGB(getTotal(mtn));
            setTelecelBundleGB(getTotal(telecel));
            setAirteltigoBundleGB(getTotal(airteltigo));
        }
        calculateBundleGB();
        calculateGraphData();
        calculateTransactions();
        calculateCommission();
    }, [bundleTx, afaTx, rcTx]);

    return (
        <div className={cn("grid gap-y-2", className)} {...props}>
            <div className={"flex justify-between"}>
                <div className={"flex gap-2 items-center"}>
                    <div className={"p-2 rounded-full bg-primary"}>
                        <TrendingUpIcon strokeWidth={1.5} className={cn("size-6")}/>
                    </div>
                    <h4 className={"font-semibold"}>Overview</h4>
                </div>
                <FilterButton values={period} defaultIndex={2} onValueChange={setSelectedPeriod} />
            </div>
            {/*<OverviewGraph data={graphData} loading={loading} className={"mt-1"} />*/}
            <div className={"w-full bg-wondamart text-primary-foreground rounded-md flex items-start gap-8 p-4"}>
                <div className={"grid gap-8"}>
                    <div className={"flex flex-col items-center gap-1"}>
                        <div className={"bg-green-500 rounded-sm text-white p-2 flex items-center w-fit h-fit"}>
                            <CheckCircle size={16} />
                        </div>
                        <p className={"p-0 m-0"}>0</p>
                        <p className={"p-2 leading-0 text-wrap text-sm"}>Delivered orders</p>
                    </div>

                    <div className={"flex flex-col items-center gap-1"}>
                        <div className={"bg-orange-500 rounded-sm text-white p-2 flex items-center w-fit h-fit"}>
                            <HistoryIcon size={16} />
                        </div>
                        <p className={"p-0 m-0"}>0</p>
                        <p className={"p-2 leading-0 text-wrap text-sm"}>Pending orders</p>
                    </div>
                </div>
                <div className={"space-y-2"}>
                    <div className={"grid grid-cols-3 gap-8"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            <div className={"size-4 bg-mtn rounded-xs"}/>
                            <span>MTN</span>
                        </div>
                        <p>{toCurrency(0)}</p>
                    </div>

                    <div className={"grid grid-cols-3 gap-8"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            <div className={"size-4 bg-telecel rounded-xs"}/>
                            <span>Telecel</span>
                        </div>
                        <p>{toCurrency(0)}</p>
                    </div>

                    <div className={"grid grid-cols-3 gap-8"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            <div className={"size-4 bg-airteltigo rounded-xs"}/>
                            <span>AirtelTigo</span>
                        </div>
                        <p>{toCurrency(0)}</p>
                    </div>

                    <div className={"grid grid-cols-3 gap-8"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            <div className={"size-4 bg-green-500 rounded-xs"}/>
                            <span>AFA</span>
                        </div>
                        <p>{toCurrency(0)}</p>
                    </div>

                    <div className={"grid grid-cols-3 gap-8"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            <div className={"size-4 bg-purple-500 rounded-xs"}/>
                            <span>Checker</span>
                        </div>
                        <p>{toCurrency(0)}</p>
                    </div>


                    <div className={"flex justify-between gap-8 text-2xl"}>
                        <div className={"flex items-center col-span-2 gap-2"}>
                            {/*<div className={"size-50 bg-white rounded-xs"}/>*/}
                            <span className={""}>Total</span>
                        </div>
                        <p>{toCurrency(9290.3)}</p>
                    </div>
                </div>
            </div>

            <div className={"flex gap-2 overflow-x-auto hidden-scroll-bar"}>
                <ActivityHighlightCard
                    Icon={getTxIcon["tx"]}
                    subTitle={"Orders made"}
                    childrenClassName={"text-xl"}
                >
                    {transactions}
                </ActivityHighlightCard>
                <ActivityHighlightCard
                    Icon={HandCoinsIcon}
                    subTitle={"Commissions Earned"}
                    childrenClassName={"text-xl"}
                >
                    {toCurrency(commission)}
                </ActivityHighlightCard>

                <ActivityHighlightCard
                    Icon={getTxIcon["bundle-purchase"]}
                    iconClassName={"bg-mtn"}
                    subTitle={"MTN"}
                    childrenClassName={"text-xl text-mtn"}
                >
                    {mtnBundleGB} GB
                </ActivityHighlightCard>
                <ActivityHighlightCard
                    Icon={getTxIcon["bundle-purchase"]}
                    iconClassName={"bg-telecel"}
                    subTitle={"Telecel"}
                    childrenClassName={"text-xl text-telecel"}
                >
                    {telecelBundleGB} GB
                </ActivityHighlightCard>
                <ActivityHighlightCard
                    Icon={getTxIcon["bundle-purchase"]}
                    iconClassName={"bg-airteltigo"}
                    subTitle={"AirtelTigo"}
                    childrenClassName={"text-xl text-airteltigo"}
                >
                    {airteltigoBundleGB} GB
                </ActivityHighlightCard>

                <ActivityHighlightCard
                    Icon={getTxIcon["afa-purchase"]}
                    subTitle={"AFA Bundle"}
                    childrenClassName={"text-xl text-primary"}
                >
                    {afaTx.length}
                </ActivityHighlightCard>
                <ActivityHighlightCard
                    Icon={getTxIcon["checker-purchase"]}
                    subTitle={"Result Checker"}
                    childrenClassName={"text-xl text-primary"}
                >
                    {rcTx.length} Units
                </ActivityHighlightCard>
            </div>

        </div>
    )
}

export default ActivityHighlights;