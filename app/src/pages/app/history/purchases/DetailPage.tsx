import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ClTx} from '@common/client-api/tx';
import type {Tx, TxData} from '@common/types/tx';
import {getTxIcon, getTxName, getTxReportText, toCurrency} from '@/lib/icons';
import LoadingView from '@/ui/components/views/LoadingView';
import StatusBadge from "@/ui/components/typography/StatusBadge.tsx";
import {toast} from "sonner";
import {Button} from "@/cn/components/ui/button.tsx";
import {ClockCheckIcon, ClockPlusIcon, CoinsIcon, DollarSignIcon, type LucideIcon, PencilIcon} from "lucide-react";
import {Timestamp} from "firebase/firestore";
import OopsView from "@/ui/components/views/OopsView.tsx";
import { cn } from "@/cn/lib/utils";


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

interface IconTitleTextProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon: LucideIcon;
    title: string;
    text: string;
}

const IconTitleText: React.FC<IconTitleTextProps> = ({Icon, title, text, className, ...props}) => {
    return (
        <div className={cn(
            "space-y-2",
            className
        )}
             {...props}
        >
            <span className="text-sm text-muted-foreground">{title}</span>
            <div className={"flex items-center gap-2"}>
                <Icon strokeWidth={1.5} className={"size-4"} />
                <p className="font-medium">{text}</p>
            </div>
        </div>
    );
}

const HistoryPurchaseDetail: React.FC = () => {
    const {id} = useParams();
    const [tx, setTx] = useState<Tx | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetched = await ClTx.readOne(id);
                if (!fetched) {
                    setError('Transaction not found');
                    setTx(null);
                    return;
                }
                setTx(fetched as Tx);
            } catch (e: any) {
                console.error(e);
                setError(e?.message ?? String(e));
                setTx(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <LoadingView />;
    if (error) return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Purchase Detail</h1>
            <p className="text-sm text-red-500">{error}</p>
        </div>
    );
    if (!tx) return (
        <OopsView>
            No transaction found for id {id}
        </OopsView>
    );

    const Icon = getTxIcon[tx.type]

    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-center">
                <div className={"flex items-center justify-center flex-row gap-4"}>
                    <div className="p-6 w-fit rounded-full bg-primary/50 flex items-center justify-center">
                        <Icon strokeWidth={1.5} className="size-24" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold self-center mb-2">{getTxName[tx.type]}</p>
                        <StatusBadge size={"lg"} status={tx.status} />
                    </div>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <IconTitleText Icon={PencilIcon} title={"Transaction Id"} text={tx.id} />
                    <IconTitleText Icon={DollarSignIcon} title={"Amount"} text={toCurrency(tx.amount)} />
                    <IconTitleText Icon={CoinsIcon} title={"Commission"} text={toCurrency(tx.commission)} />
                    <IconTitleText Icon={ClockPlusIcon} title={"Date"} text={formatDate(tx.date)} />
                    <IconTitleText Icon={ClockCheckIcon} title={"Finished"} text={tx.finishedAt ? formatDate(tx.finishedAt) : "N/A"} />
                </div>
            </div>

            <div className="bg-card/50 p-4 rounded-md">
                <h2 className="text-lg font-medium mb-2">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(tx.data as TxData).map(([k, v]) => (
                        <div key={k} className="p-2">
                            <div className="text-xs text-muted-foreground">{k}</div>
                            <div className="font-medium">{String(v)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/*{tx.type === 'data-bundle' && (*/}
            {/*    <div className="bg-card/50 p-4 rounded-md">*/}
            {/*        <h2 className="text-lg font-medium mb-2">Bundle Details</h2>*/}
            {/*        {bundle ? (*/}
            {/*            <div className="grid grid-cols-2 gap-2">*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">Name</div>*/}
            {/*                    <div className="font-medium">{bundle.name ?? bundle.id}</div>*/}
            {/*                </div>*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">Network</div>*/}
            {/*                    <div className="font-medium">{bundle.network}</div>*/}
            {/*                </div>*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">Price</div>*/}
            {/*                    <div className="font-medium">{bundle.price}</div>*/}
            {/*                </div>*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">Data</div>*/}
            {/*                    <div className="font-medium">{bundle.dataPackage?.data ?? ''} GB</div>*/}
            {/*                </div>*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">Minutes</div>*/}
            {/*                    <div className="font-medium">{bundle.dataPackage?.minutes ?? ''} min</div>*/}
            {/*                </div>*/}
            {/*                <div className="p-2">*/}
            {/*                    <div className="text-xs text-muted-foreground">SMS</div>*/}
            {/*                    <div className="font-medium">{bundle.dataPackage?.sms ?? ''} units</div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ) : (*/}
            {/*            <div className="text-sm text-muted-foreground">Bundle details not available.</div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default HistoryPurchaseDetail;
