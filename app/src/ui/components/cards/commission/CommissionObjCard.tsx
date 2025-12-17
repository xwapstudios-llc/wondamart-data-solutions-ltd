import React from "react";
import {cn} from "@/cn/lib/utils";
import type {CommissionObj} from "@common/types/commissions.ts";
import {Link} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {getTxIcon, getTxName} from "@/lib/icons.ts";
import {getTxTypeFromTxID} from "@common/types/tx.ts";

interface CommissionObjCardProps extends React.HTMLAttributes<HTMLDivElement> {
    obj: CommissionObj;
    variant?: "sm" | "lg";
}

const CommissionObjCard: React.FC<CommissionObjCardProps> = ({obj, variant = "lg", className, children, ...props}) => {
    const txType = getTxTypeFromTxID(obj.txID);
    const txName = getTxName[txType];
    const Icon = getTxIcon[txType];

    return (
        <div className={cn(
            "flex gap-2 items-center px-4 py-2 rounded-md bg-secondary/15 dark:bg-secondary/30 border",
            className
        )}
             {...props}
        >
            <Icon className={"dark:text-primary "} strokeWidth={1.5} />
            <div className={"grow gap-y-0.5 flex flex-col justify-end"}>
                <span className={"font-semibold self-start"}>{txName}</span>
                {
                    variant === "lg" && (
                        <Link to={R.app.history.purchases.id(obj.txID)} className={"dark:opacity-60 opacity-90 text-xs self-start"}>
                            {obj.txID}
                        </Link>
                    )
                }
            </div>
            <div className={"gap-y-0.5 flex flex-col justify-end"}>
                <span className={"font-semibold self-end"}>₵ {obj.commission.toFixed(2)}</span>
                {
                    variant === "lg" && (
                        <span className={"dark:opacity-60 opacity-90 text-xs self-end"}>
                            {obj.date.toDate().toLocaleTimeString()}
                        </span>
                    )
                }
            </div>
            {children}
        </div>
    )
}

export default CommissionObjCard;