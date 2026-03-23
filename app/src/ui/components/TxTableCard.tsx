import React from "react";
import TxTable from "@/ui/components/TxTable.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import NoItems from "@/ui/components/cards/NoItems.tsx";
import {getTxIcon} from "@/lib/icons.ts";
import type {Tx} from "@common/tx.ts";
import type {LucideIcon} from "lucide-react";

interface TxTableCardProps {
    title: string;
    icon: React.ReactNode;
    iconColor: string;
    transactions: Tx[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    loadingMore: boolean;
    recordCount?: number;
    noItemsMessage?: string;
    noItemsIcon?: LucideIcon;
}

const TxTableCard: React.FC<TxTableCardProps> = ({
    title,
    icon,
    iconColor,
    transactions,
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
    recordCount,
    noItemsMessage = "No transactions",
    noItemsIcon = getTxIcon["tx"],
}) => {
    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            {/* Card header */}
            {title && (
                <div className={cn("flex items-center gap-2 px-4 py-3 border-b")}>
                    <div className={cn("flex size-7 items-center justify-center rounded-md text-white text-xs", iconColor)}>
                        {icon}
                    </div>
                    <p className="text-sm font-semibold">{title}</p>
                    {!loading && recordCount !== undefined && (
                        <span className="ml-auto text-xs text-muted-foreground">
                            {recordCount} record{recordCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="px-4 py-3">
                {loading ? (
                    <div className="space-y-3 py-2">
                        {Array.from({length: 5}).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-md" />
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <NoItems Icon={noItemsIcon}>{noItemsMessage}</NoItems>
                ) : (
                    <TxTable transactions={transactions} />
                )}
            </div>

            {/* Load more footer */}
            {!loading && transactions.length > 0 && (
                <div className="flex justify-center border-t px-4 py-3">
                    {hasMore ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Loading…" : "Load more"}
                        </Button>
                    ) : (
                        <p className="text-xs text-muted-foreground">All records loaded</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TxTableCard;
