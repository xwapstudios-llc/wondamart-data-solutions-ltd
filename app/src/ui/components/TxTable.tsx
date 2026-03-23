import * as React from "react";
import type { Tx } from "@common/tx";
import { Timestamp } from "firebase/firestore";

const statusColors: Record<string, string> = {
    pending: "text-yellow-500",
    processing: "text-blue-500",
    success: "text-green-500",
    failed: "text-red-500",
};

function toDate(ts: Timestamp): Date {
    return Timestamp.fromMillis(ts.seconds * 1000 + ts.nanoseconds / 1e6).toDate();
}

interface TxTableProps {
    transactions: Tx[];
}

const TxTable: React.FC<TxTableProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return <p className="text-muted-foreground text-base">No transactions found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="text-base border-collapse whitespace-nowrap w-full">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="py-4 pr-6 min-w-32 font-semibold">ID</th>
                        <th className="py-4 pr-6 min-w-32 font-semibold">Type</th>
                        <th className="py-4 pr-6 min-w-32 font-semibold">Amount</th>
                        <th className="py-4 pr-6 min-w-32 font-semibold">Status</th>
                        <th className="py-4 pr-6 min-w-32 font-semibold">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.txId} className="border-b hover:bg-accent transition">
                            <td className="py-4 pr-6 font-mono min-w-32">{tx.txId}</td>
                            <td className="py-4 pr-6 capitalize min-w-32">{tx.type}</td>
                            <td className="py-4 pr-6 font-medium min-w-32">GH₵ {(tx.amount / 100).toFixed(2)}</td>
                            <td className={`py-4 pr-6 capitalize font-semibold min-w-32 ${statusColors[tx.status]}`}>{tx.status}</td>
                            <td className="py-4 pr-6 text-muted-foreground min-w-32">{toDate(tx.time).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TxTable;
