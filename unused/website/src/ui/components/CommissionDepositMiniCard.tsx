import React from "react";
import {CheckIcon} from "lucide-react";
import {numToMoney} from "@/lib/formatters";
import {TxCommissionDeposit} from "@common/types/commission-deposit";

interface CommissionMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: TxCommissionDeposit
}

const CommissionMiniCard: React.FC<CommissionMiniCardProps> = ({tx, className, ...props}) => {
    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center ${className}`} {...props}>
            <CheckIcon className={"text-green-500"}/>
            <div className={"grow space-y-1 flex items-center justify-between gap-4"}>
                <div className={"flex flex-col items-center justify-between"}>
                    <span>Commission Deposit</span>
                </div>
                <p className={"flex flex-col justify-end"}>
                    <span className={"text-right"}>{`GHC ${numToMoney(tx ? tx?.data.amount : 0)}`}</span>
                    <span className={"text-xs text-muted-foreground"}>{tx.id}</span>
                </p>
            </div>
        </div>
    )
}

export default CommissionMiniCard;