import React from "react";
import {cn} from "@/cn/lib/utils";
import type {Tx} from "@common/types/tx.ts";
import {getTxIcon, getTxName, toCurrency} from "@/lib/icons.ts";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";

interface TxMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: Tx;
}

const TxMiniCard: React.FC<TxMiniCardProps> = ({tx, className, ...props}) => {
    const navigate = useNavigate();
    const href = tx.type == "deposit" ? R.app.history.deposits.id(tx.id) : R.app.history.purchases.id(tx.id);
    const Icon = getTxIcon[tx.type];

    return (
        <div className={cn(
            "w-full rounded-full bg-secondary/50 p-2 shadow-sm active:scale-[0.99] transition-transform",
            className
        )}
             onClick={() => {navigate(href)}}
             {...props}
        >
            {/* Type + Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={"text-primary-foreground p-1.5 rounded-full bg-primary size-9"} strokeWidth={1.5} />
                    <div className={"flex flex-col "}>
                        <span className={"font-semibold"}>{getTxName[tx.type]}</span>
                        <span className={"text-[9px]"}>{tx.id}</span>
                    </div>
                </div>
                <div className={"font-semibold text-right"}>
                    {toCurrency(tx.amount)}
                </div>
            </div>
        </div>
    )
}

export default TxMiniCard;