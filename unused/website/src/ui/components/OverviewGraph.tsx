import React, {useEffect, useState} from "react";

import {Clock} from "lucide-react"

import FilterButton from "@/ui/components/FilterButton";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/cn/components/ui/chart";

import {Skeleton} from "@/cn/components/ui/skeleton";
import {ClTxDataBundle} from "@common/client-api/tx-data-bundle";
import {ClTxAFABundle} from "@common/client-api/tx-afa-bundle";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker";
import {TxQuery} from "@common/types/tx";
import {Timestamp} from "firebase/firestore";
import {useAppStore} from "@/lib/useAppStore";


// Change of exec.
// We now fetch based on the selected value
// 24 hours(1) means we fetch date from: and to today
// 7 days(7) means we fetch from now to now - 7 and then split them into 7 days
// ...
// The chart labels and plots will be the length of the data we'll set
// if length = 1 then we keep it
// if length <= 14 we use the days of the week
// else we use the nth day of the month from now to now - selected
type OverviewData = {
    transactions: number;
    total: number;
};
type OverviewProps = React.HTMLAttributes<HTMLDivElement>
const OverviewGraph = ({ className, ...props }: OverviewProps) => {
    const {profile} = useAppStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OverviewData[]>([]);
    const period = [
        {label: "All time", value: "0"},
        {label: "24 hours", value: "1"},
        {label: "3 days", value: "3"},
        {label: "7 days", value: "7"},
        {label: "14 days", value: "14"},
        {label: "31 days", value: "31"},
    ];
    const [selectedPeriod, setSelectedPeriod] = useState<string>(period[1].value);
    const [numOfTx, setNumOfTx] = useState(0);


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

            const values: Omit<TxQuery, "type"> = {
                userId: profile.id,
                status: "completed",
                ...(from && {
                    date: { from: Timestamp.fromDate(from), to: Timestamp.fromDate(now) },
                }),
            };

            const [dataBundles, afaBundles, resultChecker] = await Promise.all([
                ClTxDataBundle.read({ type: "data-bundle", ...values }),
                ClTxAFABundle.read({ type: "afa-bundle", ...values }),
                ClTxResultChecker.read({ type: "result-checker", ...values }),
            ]);

            const tx = [...dataBundles, ...afaBundles, ...resultChecker];
            setNumOfTx(tx.length);

            // --------------------------
            // Create fixed buckets
            // --------------------------
            let result: OverviewData[];

            if (periodNum === 1) {
                // 24h → hours
                const hours = Array.from({ length: 24 }, (_, i) => i); // 0..23
                const map = new Map(hours.map(h => [h, { transactions: 0, total: 0 }]));

                for (const t of tx) {
                    const h = t.date.toDate().getHours();
                    const entry = map.get(h)!;
                    entry.transactions += 1;
                    entry.total += t.data.amount ?? 0; // adapt to your schema
                }

                result = hours.map(h => map.get(h)!);

            } else if (periodNum > 1 && periodNum <= 14) {
                // ≤14 days → weekdays
                const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                const map = new Map(days.map(d => [d, { transactions: 0, total: 0 }]));

                for (const t of tx) {
                    const d = days[t.date.toDate().getDay()];
                    const entry = map.get(d)!;
                    entry.transactions += 1;
                    entry.total += t.data.amount ?? 0;
                }

                result = days.map(d => map.get(d)!);

            } else if (periodNum > 14) {
                // >14 days → N days back
                const map = new Map<number, OverviewData>();

                for (let i = 0; i < periodNum; i++) {
                    map.set(i, { transactions: 0, total: 0 });
                }

                for (const t of tx) {
                    const diff = Math.floor((now.getTime() - t.date.toDate().getTime()) / (1000 * 60 * 60 * 24));
                    if (map.has(diff)) {
                        const entry = map.get(diff)!;
                        entry.transactions += 1;
                        entry.total += t.data.amount ?? 0;
                    }
                }

                // reverse so it's chronological: oldest → today
                result = Array.from(map.entries())
                    .sort((a, b) => b[0] - a[0])
                    //  @typescript-eslint/no-unused-vars | discard the index
                    .map(([_, v]) => v);

            } else {
                // "All time" fallback
                const summary = { transactions: tx.length, total: tx.reduce((s, t) => s + (t.data.amount ?? 0), 0) };
                result = [summary];
            }

            setData(result);
        };

        fetchData().then(() => {
            setLoading(false);
        });
        console.log("Fetching overview data...");
    }, [profile, selectedPeriod]);



    const chartConfig = {
        transactions: {
            label: "Transactions",
            color: "var(--chart-1)",
        },
        total: {
            label: "Total",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

    if (!profile) return (
        <Skeleton className={`h-32 w-full ${className}`} {...props} />
    )

    return (
        <div className={`space-y-2 ${className}`} {...props}>
            <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <p className={"font-semibold"}>Overview</p>
                </div>
                <div className={"flex items-center gap-2"}>
                    <p className={"bg-secondary/25 text-sm text-center text-muted-foreground p-2 rounded-md"}>
                        {numOfTx == 0 ? "No " : numOfTx} orders
                    </p>
                    <FilterButton values={period} defaultIndex={1} onValueChange={setSelectedPeriod} />
                </div>
            </div>
            {
                loading ? <Skeleton className={"h-32 w-full rounded-md"} /> :
                <div className={`h-32 w-full`}>
                    <ChartContainer config={chartConfig} className={"w-full h-full"}>
                        <LineChart data={data} margin={{left: -25, right: 5}}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted"/>
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis className="text-xs"/>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel/>}
                            />
                            <Line
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--primary)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                                type="monotone"
                                dataKey="total"
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            }
        </div>
    );
}

export default OverviewGraph;