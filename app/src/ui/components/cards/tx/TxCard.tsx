import React from "react";
import {cn} from "@/cn/lib/utils.ts";

import { Timestamp } from "firebase/firestore";
import type {Tx} from "@common/types/tx.ts";
import {getTxIcon, getTxName, getTxReportText, toCurrency} from "@/lib/icons.ts";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {ClockCheckIcon, ClockPlusIcon} from "lucide-react";
import StatusBadge from "@/ui/components/typography/StatusBadge.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {toast} from "sonner";

const formatDate = (ts: Timestamp) => {
    if (!ts) return "---";
    const d = ts.toDate();
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

interface TxCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: Tx;
}

const TxCard: React.FC<TxCardProps> = ({tx, className, ...props}) => {
    const navigate = useNavigate();
    const href = tx.type == "deposit" ? R.app.history.deposits.id(tx.id) : R.app.history.purchases.id(tx.id);
    const Icon = getTxIcon[tx.type];

    return (
        <div className={cn(
            "w-full rounded-lg bg-linear-60 from-primary/50 to-transparent dark:text-primary-foreground p-4 shadow-sm active:scale-[0.99] transition-transform",
            className
        )}
             onClick={() => {navigate(href)}}
             {...props}
        >
                {/* Type + Status */}
                <div className="flex items-center justify-between">
                    <div className="font-semibold flex items-center gap-2">
                        <Icon className={"size-8 text-primary"} strokeWidth={1.5} />
                        <span>{getTxName[tx.type]}</span>
                    </div>

                    <StatusBadge status={tx.status} />
                </div>

            <div className={"flex items-center gap-4 justify-between"}>
                <div className="mt-3 text-xs space-y-1">
                    <div className={"flex gap-2 items-center"}>
                        <ClockPlusIcon className={"text-muted-foreground size-5"} strokeWidth={1.5} /> {formatDate(tx.date)}
                    </div>
                    {
                        tx.finishedAt && <div className={"flex gap-2 items-center"}>
                            <ClockCheckIcon className={"text-green-600 size-5"} strokeWidth={1.5} />
                            {formatDate(tx.finishedAt)}
                        </div>
                    }
                </div>

                {/* Amount */}
                <div className="mt-2">
                    <div className="text-xl font-bold text-right">
                        {toCurrency(tx.amount)}
                    </div>
                    {
                        tx.type != "deposit" && (
                            <div className="text-xs text-right">
                                Commission: {toCurrency(tx.commission)}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="mt-2 text-xs">Ref: {tx.id}</div>
            {
                tx.type != "deposit" && (
                    <Button
                        className={"mt-1.5 w-full"}
                        variant={"outline"}
                        onClick={() => {
                            navigator.clipboard.writeText(getTxReportText(tx)).then(() => {
                                toast.success("Transaction details copied to clipboard", {duration: 3000});
                            })
                        }}
                    >
                        Copy details
                    </Button>
                )
            }
        </div>
    )
}

export default TxCard;

