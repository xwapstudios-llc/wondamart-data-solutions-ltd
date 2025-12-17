import React from "react";
import {BookOpen, CheckSquare, XIcon} from "lucide-react";
import {numToMoney} from "@/lib/formatters";
import {TxResultChecker} from "@common/types/result-checker";

interface ResultCheckerMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: TxResultChecker
}

const ResultCheckerMiniCard: React.FC<ResultCheckerMiniCardProps> = ({tx, className, ...props}) => {
    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center ${className}`} {...props}>
            {
                tx.status === "pending" ? <BookOpen className={"text-primary"} />
                    : tx.status === "completed" ? <CheckSquare className={"text-green-500"} />
                        : tx.status === "failed" ? <XIcon className={"text-red-500"} />
                            : null
            }
            <div className={"grow space-y-1"}>
                <div className={"flex gap-4 items-center justify-between"}>
                    <span>{tx.data.checkerType} Checker</span>
                    <span>{`GHC ${numToMoney(tx.data.amount || 0)}`}</span>
                </div>
                <p className={"text-xs text-muted-foreground flex gap-1 justify-between"}>
                    <span>{tx.data.units} unit{tx.data.units > 1 ? 's' : ''}</span>
                    <span>{tx.id}</span>
                </p>
            </div>
        </div>
    )
}

export default ResultCheckerMiniCard;

