import React from "react";
import {User2, CheckSquare, XIcon} from "lucide-react";
import {numToMoney} from "@/lib/formatters";
import {TxAfaBundle} from "@common/types/afa-bundle";

interface AfaBundleMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: TxAfaBundle
}

const AfaBundleMiniCard: React.FC<AfaBundleMiniCardProps> = ({tx, className, ...props}) => {
    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center ${className}`} {...props}>
            {
                tx.status === "pending" ? <User2 className={"text-primary"} />
                    : tx.status === "completed" ? <CheckSquare className={"text-green-500"} />
                        : tx.status === "failed" ? <XIcon className={"text-red-500"} />
                            : null
            }
            <div className={"grow space-y-1"}>
                <div className={"flex gap-4 items-center justify-between"}>
                    <span>{tx.data.fullName}</span>
                    <span>{`GHC ${numToMoney(tx.data.amount || 0)}`}</span>
                </div>
                <p className={"text-xs text-muted-foreground flex gap-1 justify-between"}>
                    <span>{tx.data.phoneNumber} • {tx.data.idNumber}</span>
                    <span>{tx.id}</span>
                </p>
            </div>
        </div>
    )
}

export default AfaBundleMiniCard;

