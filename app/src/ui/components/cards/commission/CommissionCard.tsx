import React from "react";
import {cn} from "@/cn/lib/utils";
import type {CommissionDoc, CommissionObj} from "@common/types/commissions.ts";
import {CalendarIcon, CheckCircle2Icon, CoinsIcon, HashIcon, TimerResetIcon, XCircleIcon} from "lucide-react";
import {Badge} from "@/cn/components/ui/badge.tsx";
import {buttonVariants} from "@/cn/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {R} from "@/app/routes.ts";
import CommissionObjCard from "@/ui/components/cards/commission/CommissionObjCard.tsx";
import {Timestamp} from "firebase/firestore";
import {toCurrency} from "@/lib/icons.ts";

const calculateTotalCommission = (commissions: CommissionObj[] | undefined): number =>
    commissions?.reduce((sum, c) => sum + c.commission, 0) ?? 0;

interface MyCommissionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    com: CommissionDoc;
}

const CommissionCard: React.FC<MyCommissionCardProps> = ({com, className, children, ...props}) => {
    const date = new Date(com.year, com.monthIndex);
    const monthName = date.toLocaleString("default", {month: "long"});
    // @ts-expect-error The last index might not exist; Check before use.
    const lastCommission = com.commissions?.at(-1);
    const total = calculateTotalCommission(com.commissions);

    return (
        <div className={cn("w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm", className)} {...props}>

            {/* Gradient header */}
            <div className={"bg-linear-to-br from-wondamart/80 to-wondamart p-4 text-white"}>
                <div className={"flex items-center justify-between"}>
                    <div className={"flex items-center gap-2"}>
                        <div className={"flex size-9 items-center justify-center rounded-lg bg-white/20"}>
                            <CalendarIcon className={"size-4"}/>
                        </div>
                        <div>
                            <p className={"text-xs opacity-75"}>Commission Period</p>
                            <p className={"text-lg font-bold"}>{monthName} {com.year}</p>
                        </div>
                    </div>
                    {com.payed ? (
                        <Badge variant={"success"} className={"gap-1"}>
                            <CheckCircle2Icon className={"size-3"}/> Paid
                        </Badge>
                    ) : (
                        <Badge variant={"destructive"} className={"gap-1"}>
                            <XCircleIcon className={"size-3"}/> Unpaid
                        </Badge>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className={"space-y-3 p-4"}>

                {/* Stats row */}
                <div className={"grid grid-cols-2 gap-3"}>
                    <div className={"rounded-lg bg-secondary/50 p-3 space-y-1"}>
                        <div className={"flex items-center gap-2 text-muted-foreground"}>
                            <CoinsIcon className={"size-3.5"}/>
                            <span className={"text-xs"}>Total Earned</span>
                        </div>
                        <p className={"text-xl font-bold text-primary"}>{toCurrency(total)}</p>
                    </div>
                    <div className={"rounded-lg bg-secondary/50 p-3 space-y-1"}>
                        <div className={"flex items-center gap-2 text-muted-foreground"}>
                            <HashIcon className={"size-3.5"}/>
                            <span className={"text-xs"}>Transactions</span>
                        </div>
                        <p className={"text-xl font-bold"}>{com.commissions?.length ?? 0}</p>
                    </div>
                </div>

                {/* Latest commission entry */}
                <CommissionObjCard
                    variant={"sm"}
                    obj={lastCommission ?? {txID: "", commission: 0, date: Timestamp.now()}}
                />

                {/* Footer */}
                <div className={"flex items-center justify-between pt-1"}>
                    <div className={"flex items-center gap-1.5 text-xs text-muted-foreground"}>
                        <TimerResetIcon className={"size-3.5"}/>
                        <span>Updated <span className={"font-medium text-foreground"}>{com.updatedAt.toDate().toLocaleDateString()}</span></span>
                    </div>
                    <Link to={R.app.commissions.id(com.id)} className={cn(buttonVariants({variant: "outline", size: "sm"}))}>
                        View all
                    </Link>
                </div>
            </div>

            {children}
        </div>
    );
};

export default CommissionCard;
