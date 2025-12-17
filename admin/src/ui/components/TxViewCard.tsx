import React from "react";
import type {Tx} from "@common/types/tx.ts";
import {cn} from "@/cn/lib/utils.ts";
import {Label} from "@/cn/components/ui/label.tsx";
import {useNavigate, useLocation} from "react-router-dom";
import R from "@/routes.ts";
import type { Timestamp } from "firebase/firestore";
import {
    Smartphone,
    Package as PackageIcon,
    FileText,
    CreditCard,
    DollarSign
} from "lucide-react";

interface TxViewCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: Tx;
    detailed?: boolean;
}

const typeIcon = (t: Tx['type']) => {
    const baseClass = "w-6 h-6 p-1 rounded-sm bg-primary/10 text-primary/50";
    switch (t) {
        case "data-bundle":
            return <Smartphone className={baseClass}/>;
        case "afa-bundle":
            return <PackageIcon className={baseClass}/>;
        case "result-checker":
            return <FileText className={baseClass}/>;
        case "deposit":
            return <CreditCard className={baseClass}/>;
        case "commission-deposit":
            return <DollarSign className={baseClass}/>;
        default:
            return <FileText className={baseClass}/>;
    }
}

const statusColor = (s: Tx['status']) => {
    switch (s) {
        case "completed":
            return "text-green-700/90 bg-green-500/5";
        case "failed":
            return "text-red-700/90 bg-red-500/5";
        case "processing":
            return "text-yellow-700/90 bg-yellow-500/5";
        case "pending":
        default:
            return "text-muted-foreground bg-muted/5";
    }
}

const formatTs = (ts?: Timestamp) => {
    if (!ts) return "N/A";
    try {
        return ts.toDate().toLocaleString();
    } catch {
        try {
            return ts.toDate().toLocaleString();
        } catch {
            return String(ts);
        }
    }
}

const TxViewCard: React.FC<TxViewCardProps> = ({className, tx, detailed = false, ...props}) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            className={cn("cursor-pointer border rounded-lg p-3 shadow-sm bg-card", className)}
            onClick={(e) => {
                if (location.pathname === R.tx(tx.id)) return;
                navigate(R.tx(tx.id));
                e.stopPropagation();
            }}
            {...props}
        >
            <div className={"flex items-center justify-between gap-3"}>
                <div className={"flex items-center gap-3"}>
                    <div>
                        {typeIcon(tx.type)}
                    </div>
                    <div>
                        <div className={"font-medium"}>{tx.type.replace("-", " ")}</div>
                        <div className={"text-sm text-muted-foreground break-words"}>{tx.id}</div>
                    </div>
                </div>
                <div className={"flex flex-col items-end gap-1"}>
                    <div className={`text-xs px-2 py-0.5 rounded-sm font-medium ${statusColor(tx.status)}`}>
                        {tx.status}
                    </div>
                    <div className={"text-xs text-muted-foreground"}>{formatTs(tx.date)}</div>
                </div>
            </div>

            <div className={"mt-3 text-sm grid grid-cols-2 gap-2"}>
                <div className={"break-words"}>
                    <Label>User</Label>
                    <div className={"text-foreground/90"}>{tx.userId}</div>
                </div>

                {detailed && (
                    <div>
                        <Label>Updated</Label>
                        <div className={"text-foreground/90"}>{formatTs(tx.updatedAt)}</div>
                    </div>
                )}

                {detailed && (
                    <div>
                        <Label>Finished</Label>
                        <div className={"text-foreground/90"}>{formatTs(tx.finishedAt)}</div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default TxViewCard;
