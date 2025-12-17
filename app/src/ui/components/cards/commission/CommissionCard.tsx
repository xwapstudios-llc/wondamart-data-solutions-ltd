import React from "react";
import {cn} from "@/cn/lib/utils";
import type {CommissionDoc, CommissionObj} from "@common/types/commissions.ts";
import {CalendarIcon, CheckCircle2Icon, HandCoinsIcon, HashIcon, TimerResetIcon, XCircle} from "lucide-react";
import {Badge} from "@/cn/components/ui/badge.tsx";
import {buttonVariants} from "@/cn/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {R} from "@/app/routes.ts";
import CommissionObjCard from "@/ui/components/cards/commission/CommissionObjCard.tsx";
import CommissionStats from "@/ui/components/cards/commission/CommissionStats.tsx";


const calculateTotalCommission = (commissions: CommissionObj[] | undefined): number => {
    return commissions?.reduce((sum, current) => sum + current.commission, 0) || 0;
};

interface MyCommissionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    com: CommissionDoc;
}

const CommissionCard: React.FC<MyCommissionCardProps> = ({
                                                               com,
                                                               className,
                                                               children,
                                                               ...props
                                                           }) => {
    const date = new Date(com.year, com.monthIndex);
    const monthName = date.toLocaleString("default", {month: "long"});
    // @ts-expect-error The last index might not exist; Check before use.
    const lastCommission = com.commissions.at(-1);

    return (
        <div
            className={cn(
                ` w-full max-w-md p-4 rounded-lg bg-primary dark:bg-primary/75 text text-primary-foreground`,
                `border border-foreground/10 space-y-4`,
                className
            )}
            {...props}
        >
            {/* Header */}
            <div className={"flex items-start justify-between gap-4"}>
                <div className={"flex items-center gap-2 text-xl font-medium"}>
                    <CalendarIcon className={"size-5 opacity-80"}/>
                    <span>{monthName} {com.year}</span>
                </div>
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

            {/* Stats */}
            <div className={"grid grid-cols-2 gap-2"}>
                <CommissionStats
                    Icon={HandCoinsIcon}
                    display={`₵ ${calculateTotalCommission(com.commissions).toFixed(2)}`}
                    sub={"Total Earned"}
                />

                {/* Total Transactions */}
                <CommissionStats
                    Icon={HashIcon}
                    display={com.commissions?.length ?? 0}
                    sub={"Total Transactions"}
                />

                {
                    com.commissions && lastCommission && (
                        <CommissionObjCard variant={"sm"} className={"col-span-2"} obj={lastCommission} />
                    )
                }
            </div>

            {/* Metadata */}
            <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2 text-xs opacity-70">
                    <TimerResetIcon className="size-4"/>
                    <span>Last Update:{" "}
                        <span className="font-semibold opacity-90">
                            {com.updatedAt.toDate().toLocaleDateString()}
                        </span>
                    </span>
                </div>
                <Link to={R.app.commissions.id(com.id)} className={cn(buttonVariants({variant: "outline", size: "sm"}))}>Show all</Link>
            </div>
            {children}
        </div>
    );
};

export default CommissionCard;