import React, {useEffect, useState} from "react";
import {cn} from "@/cn/lib/utils";
import type {Tx} from "@common/types/tx.ts";
import {ClTx} from "@common/client-api/tx.ts";
import TxMiniCard from "@/ui/components/cards/tx/TxMiniCard.tsx";
import {FrownIcon, Loader2Icon} from "lucide-react";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";

interface TxMiniCardSyncProps extends React.HTMLAttributes<HTMLDivElement> {
    txID: string;
}

const TxMiniCardSync: React.FC<TxMiniCardSyncProps> = ({txID, className, ...props}) => {
    const [tx, setTx] = useState<undefined | Tx>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function run() {
            ClTx.readOne(txID).then((tx) => {
                setTx(tx);
                setLoading(false);
            });
        }
        run().then(() => {});
    }, [txID]);

    if (loading) return (
        <Skeleton className={cn(
            "w-full rounded-full p-2 flex gap-4 items-center",
            "bg-secondary/50",
            className
        )}
             {...props}
        >
            <Loader2Icon className={"animate-spin p-1.5 rounded-full bg-primary size-9"} />
            <span>Loading...</span>
        </Skeleton>
    )
    if (!tx) return (
        <div className={cn(
            "w-full rounded-full p-2 flex gap-4 items-center",
            "bg-secondary/50",
            className
        )}
                  {...props}
        >
            <FrownIcon className={"p-1.5 rounded-full bg-destructive size-9"} />
            <span>Loading failed</span>
        </div>
    )
    return (
        <TxMiniCard tx={tx} {...props} />
    )
}

export default TxMiniCardSync;