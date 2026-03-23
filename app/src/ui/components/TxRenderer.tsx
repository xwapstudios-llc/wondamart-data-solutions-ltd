import React from "react";
import type {Tx} from "@common/tx.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/cn/components/ui/card.tsx";
import {Badge} from "@/cn/components/ui/badge.tsx";
import {Separator} from "@/cn/components/ui/separator.tsx";
import {cn} from "@/cn/lib/utils.ts";
import type {Timestamp} from "firebase/firestore";

interface TxDataRendererProps {
    tx: Tx;
    className?: string;
}

const formatTimestamp = (ts?: Timestamp): string => {
    if (!ts) return "N/A";
    try {
        return ts.toDate().toLocaleString();
    } catch {
        return String(ts);
    }
};

const formatCurrency = (amount: number): string => {
    return `₵${amount.toLocaleString()}`;
};

const getStatusColor = (status: Tx['status']): string => {
    switch (status) {
        case "success":
            return "bg-green-100 text-green-800 border-green-200";
        case "failed":
            return "bg-red-100 text-red-800 border-red-200";
        case "processing":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "pending":
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getTypeColor = (type: Tx['type']): string => {
    switch (type) {
        case "paystack-deposit":
        case "manual-deposit":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "bundle-purchase":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "afa-purchase":
            return "bg-indigo-100 text-indigo-800 border-indigo-200";
        case "checker-purchase":
            return "bg-cyan-100 text-cyan-800 border-cyan-200";
        case "admin-debit":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "admin-credit":
            return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "refund":
            return "bg-teal-100 text-teal-800 border-teal-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const TxDataRenderer: React.FC<TxDataRendererProps> = ({tx, className}) => {
    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Transaction Details</span>
                    <div className="flex gap-2">
                        <Badge className={getTypeColor(tx.type)}>
                            {tx.type.replace("-", " ")}
                        </Badge>
                        <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                        <p className="font-mono text-sm break-all">{tx.txId}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Agent ID</label>
                        <p className="font-mono text-sm break-all">{tx.agentId}</p>
                    </div>
                </div>

                <Separator />

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Amount</label>
                        <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(tx.amount)}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Balance After</label>
                        <p className="text-lg font-semibold">
                            {formatCurrency(tx.balance)}
                        </p>
                    </div>
                    {tx.commission !== undefined && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Commission</label>
                            <p className="text-lg font-semibold text-blue-600">
                                {formatCurrency(tx.commission)}
                            </p>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Timing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Created At</label>
                        <p className="text-sm">{formatTimestamp(tx.time)}</p>
                    </div>
                    {tx.timeCompleted && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Completed At</label>
                            <p className="text-sm">{formatTimestamp(tx.timeCompleted)}</p>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Transaction Data */}
                {tx.txData && Object.keys(tx.txData).length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Additional Data
                        </label>
                        <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(tx.txData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="text-sm space-y-1">
                        <p><span className="font-medium">Type:</span> {tx.type.replace("-", " ")}</p>
                        <p><span className="font-medium">Status:</span> {tx.status}</p>
                        <p><span className="font-medium">Amount:</span> {formatCurrency(tx.amount)}</p>
                        {tx.commission !== undefined && (
                            <p><span className="font-medium">Commission:</span> {formatCurrency(tx.commission)}</p>
                        )}
                        <p><span className="font-medium">Final Balance:</span> {formatCurrency(tx.balance)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TxDataRenderer;
