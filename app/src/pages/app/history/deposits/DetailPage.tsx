import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ClTx} from '@common/client-api/tx';
import type {Tx, TxData} from '@common/types/tx';
import {getTxIcon, getTxName, toCurrency} from '@/lib/icons';
import LoadingView from '@/ui/components/views/LoadingView';
import StatusBadge from "@/ui/components/typography/StatusBadge.tsx";

const HistoryDepositDetail: React.FC = () => {
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
        load().then();
    }, [id]);

    if (loading) return <LoadingView />;
    if (error) return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Deposit Detail</h1>
            <p className="text-sm text-red-500">{error}</p>
        </div>
    );
    if (!tx) return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Deposit Detail</h1>
            <p className="text-sm text-muted-foreground">No transaction found for id {id}</p>
        </div>
    );

    const Icon = getTxIcon['deposit'] ?? getTxIcon['tx'];

    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-center">
                <div className={"flex items-center justify-center md:flex-row flex-col gap-4"}>
                    <div className="p-8 w-fit rounded-full bg-primary/50 flex items-center justify-center">
                        <Icon strokeWidth={1.5} className="size-32" />
                    </div>
                    <div>
                        <StatusBadge size={"lg"} status={tx.status} />
                        <p className="text-2xl font-semibold self-center">{getTxName[tx.type]}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="text-xs text-muted-foreground">Transaction ID</div>
                        <div className="font-medium">{tx.id}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-medium">{toCurrency(tx.amount)}</div>
                    </div>
                </div>
            </div>

            <div className="bg-card/50 p-4 rounded-md">
                <h2 className="text-lg font-medium mb-2">Deposit Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(tx.data as TxData).map(([k, v]) => (
                        <div key={k} className="p-2">
                            <div className="text-xs text-muted-foreground">{k}</div>
                            <div className="font-medium">{String(v)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryDepositDetail;
