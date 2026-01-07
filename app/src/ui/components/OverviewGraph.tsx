import React from "react";

import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/cn/components/ui/chart";

import {Skeleton} from "@/cn/components/ui/skeleton";
import {useAppStore} from "@/lib/useAppStore";


interface TxData {
    periodName?: string;
    mtn: number,
    telecel: number,
    airteltigo: number,
}
interface OverviewProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: TxData[];
    loading?: boolean;
}
const OverviewGraph = ({ className, loading = false, data = [], ...props }: OverviewProps) => {
    const {profile} = useAppStore();
    const chartConfig = {
        mtn: {
            label: "MTN",
            color: "var(--mtn)",
        },
        telecel: {
            label: "Telecel",
            color: "var(--telecel)",
        },
        airtelTigo: {
            label: "AirtelTigo",
            color: "var(--airteltigo)",
        },
    } satisfies ChartConfig

    if (!profile) return (
        <Skeleton className={`h-32 w-full ${className}`} {...props} />
    )

    return (
        <div className={`space-y-2 ${className}`} {...props}>
            {
                loading ? <Skeleton className={"h-32 w-full rounded-md"} /> :
                <div className={`h-32 w-full`}>
                    <ChartContainer config={chartConfig} className={"w-full h-full"}>
                        <LineChart data={data} margin={{left: -45, right: 0}}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted"/>
                            <XAxis
                                dataKey="periodName"
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                                tickMargin={8}
                                // tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis className="text-xs"/>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel/>}
                            />
                            <Line
                                dataKey="mtn"
                                stroke="var(--color-mtn)"
                                strokeWidth={2}
                                dot={false}
                                type="monotone"
                                isAnimationActive={false}
                            />
                            <Line
                                dataKey="telecel"
                                stroke="var(--color-telecel)"
                                strokeWidth={2}
                                dot={false}
                                type="monotone"
                                isAnimationActive={false}
                            />
                            <Line
                                dataKey="airteltigo"
                                stroke="var(--color-airteltigo)"
                                strokeWidth={2}
                                dot={false}
                                type="monotone"
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