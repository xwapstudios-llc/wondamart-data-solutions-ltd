import React, { useEffect, useState } from "react";
import { ClTx } from "@common/client-api/tx.ts";
import type { Tx } from "@common/tx.ts";
import TxTableCard from "@/ui/components/TxTableCard.tsx";
import type { LucideIcon } from "lucide-react";

interface TxTableCardSyncProps {
    txIds: string[];
    title?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    noItemsMessage?: string;
    noItemsIcon?: LucideIcon;
}

const TxTableCardSync: React.FC<TxTableCardSyncProps> = ({
    txIds,
    title,
    icon,
    iconColor,
    noItemsMessage = "No transactions",
    noItemsIcon,
}) => {
    const [transactions, setTransactions] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!txIds.length) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all(txIds.map(id => ClTx.readOne(id)))
            .then(results => setTransactions(results.filter(Boolean) as Tx[]))
            .finally(() => setLoading(false));
    }, [txIds.join(",")]);

    return (
        <TxTableCard
            title={title || ""}
            icon={icon || <div />}
            iconColor={iconColor || ""}
            transactions={transactions}
            loading={loading}
            hasMore={false}
            onLoadMore={() => {}}
            loadingMore={false}
            recordCount={transactions.length}
            noItemsMessage={noItemsMessage}
            noItemsIcon={noItemsIcon}
        />
    );
};

export default TxTableCardSync;
