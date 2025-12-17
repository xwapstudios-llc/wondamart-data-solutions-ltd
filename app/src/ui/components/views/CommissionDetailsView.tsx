import React from "react";
import type {CommissionDoc, CommissionObj} from "@common/types/commissions.ts";
import {cn} from "@/cn/lib/utils.ts";
import {
    Calendar1Icon,
    CheckCircle2Icon,
    HandCoinsIcon,
    HashIcon,
    TimerResetIcon,
    XCircle
} from "lucide-react";
import {Badge} from "@/cn/components/ui/badge.tsx";
import {Separator} from "@/cn/components/ui/separator.tsx";
import CommissionObjCard from "@/ui/components/cards/commission/CommissionObjCard.tsx";
import CommissionStats from "@/ui/components/cards/commission/CommissionStats.tsx";


function groupCommissionByDate(items: CommissionObj[]) {
    const sorted = [...items].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

    return sorted.reduce((acc: Record<string, CommissionObj[]>, item) => {
        const key = item.date.toDate().toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}


interface CommissionDetailsViewProps extends React.HTMLAttributes<HTMLDivElement> {
    com: CommissionDoc
}

const CommissionDetailsView: React.FC<CommissionDetailsViewProps> = ({com, className, ...props}) => {

    // Group commissions by date
    const grouped = groupCommissionByDate(com.commissions ?? []);

    const monthName = new Date(com.year, com.monthIndex).toLocaleString("default", {
        month: "long",
    });
    const total = com.commissions?.reduce((sum, current) => sum + current.commission, 0) || 0;

    return (
        <div className={cn("space-y-4 mt-2", className)} {...props}>

            {/* Header */}
            <div className={"flex items-center gap-4"}>
                <h1 className="text-xl font-semibold">
                    {monthName} {com.year}
                </h1>
                {
                    com.payed ? (
                        <Badge variant={"default"}>
                            <CheckCircle2Icon className="size-4"/> Paid
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <XCircle className="size-4"/> Unpaid
                        </Badge>
                    )
                }
            </div>

            {/* Status */}
            <div className={"grid grid-cols-2 items-center gap-2 overflow-x-auto"}>
                <CommissionStats
                    className={"bg-primary dark:bg-primary"}
                    Icon={HandCoinsIcon}
                    display={`₵ ${total.toFixed(2)}`}
                    sub={"Total Commission"}
                />
                <CommissionStats
                    className={"bg-primary dark:bg-primary"}
                    Icon={HashIcon}
                    display={com.commissions?.length || 0}
                    sub={"Total Transactions"}
                />
                <CommissionStats
                    className={"bg-primary dark:bg-primary col-span-2"}
                    Icon={Calendar1Icon}
                    display={new Date(com.endOfMonth.seconds * 1000).toLocaleDateString()}
                    sub={"End of Month"}
                />
            </div>


            <Separator />
            <div className="flex items-center gap-2 text-sm">
                <TimerResetIcon className="size-6"/>
                <span>Last Update:{" "}
                    <span className="font-semibold opacity-90">
                            {com.updatedAt.toDate().toLocaleDateString()}
                        </span>
                    </span>
            </div>
            <Separator />

            {/* Grouped Commissions */}
            <div className="space-y-8">
                {Object.keys(grouped).map((dayKey) => {
                    const list = grouped[dayKey];
                    const sumTotal = list.reduce((sum, current) => sum + current.commission, 0)

                    const date = new Date(dayKey);
                    const formatted = date.toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                    });

                    return (
                        <div key={dayKey} className="space-y-3">
                            {/* Day Title */}
                            <h2 className="text-lg font-bold">{formatted}</h2>
                            <div className={"flex items-center gap-2"}>
                                <CommissionStats
                                    className={"bg-linear-60 from-primary/75 border-0 to-transparent"}
                                    Icon={HandCoinsIcon}
                                    display={`₵ ${sumTotal.toFixed(2)}`}
                                    sub={"Sum Total"}
                                />
                                <CommissionStats
                                    className={"bg-linear-60 from-primary/75 border-0 to-transparent"}
                                    Icon={HashIcon}
                                    display={list.length}
                                    sub={"Total Transactions"}
                                />
                            </div>

                            {/* Transactions */}
                            <div className="grid gap-2 md:grid-cols-2">
                                {list.map((c) => (
                                    <CommissionObjCard className={""} obj={c} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default CommissionDetailsView;




