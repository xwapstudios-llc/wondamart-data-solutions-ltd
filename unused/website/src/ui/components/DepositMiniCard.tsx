import React from "react";
import {ArrowUpRightFromCircle, CheckIcon, XIcon} from "lucide-react";
import {numToMoney} from "@/lib/formatters";
import {TxAccountDeposit} from "@common/types/account-deposit";

interface DepositMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: TxAccountDeposit
}

const DepositMiniCard: React.FC<DepositMiniCardProps> = ({tx, className, ...props}) => {
    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center ${className}`} {...props}>
            {
                tx.status === "pending" ? <ArrowUpRightFromCircle className={"text-primary"} />
                    : tx.status === "completed" ? <CheckIcon className={"text-green-500"} />
                        : tx.status === "failed" ? <XIcon className={"text-red-500"} />
                            : null
            }
            <div className={"grow space-y-1"}>
                <div className={"flex gap-4 items-center justify-between"}>
                    <span>Deposit</span>
                    <span>{`GHC ${numToMoney(tx ? tx?.data.amount : 0)}`}</span>
                </div>
                <p className={"text-xs text-muted-foreground flex gap-1 justify-between"}>
                    <span>{tx.data.phoneNumber}</span>
                    <span>
                        {tx.id}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default DepositMiniCard;