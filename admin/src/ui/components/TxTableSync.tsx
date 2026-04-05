import React, { useEffect, useState } from "react";
import { ClTx } from "@common/client-api/tx.ts";
import type { Tx } from "@common/tx.ts";
import TxTable from "@/ui/components/TxTable.tsx";
import { Skeleton } from "@/cn/components/ui/skeleton.tsx";

interface TxTableSyncProps {
    txIds: string[];
}

const TxTableSync: React.FC<TxTableSyncProps> = ({ txIds }) => {
    const [transactions, setTransactions] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!txIds.length) { setLoading(false); return; }
        setLoading(true);
        Promise.all(txIds.map(id => ClTx.readOne(id)))
            .then(results => setTransactions(results.filter(Boolean) as Tx[]))
            .finally(() => setLoading(false));
    }, [txIds.join(",")]);

    if (loading) return <Skeleton className="h-24 w-full rounded-md" />;
    return <TxTable transactions={transactions} />;
};

export default TxTableSync;
