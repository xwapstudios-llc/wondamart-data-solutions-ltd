import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ClTx} from '@common/client-api/tx';
import type {Tx} from '@common/types/tx';
import type {TxDepositData} from '@common/types/account-deposit';
import {getTxIcon} from '@/lib/icons';
import LoadingView from '@/ui/components/views/LoadingView';

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
    const data = tx.data as TxDepositData;

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">Deposit {tx.id}</h1>
                    <p className="text-sm text-muted-foreground">Status: {tx.status}</p>
                    <p className="text-sm text-muted-foreground">Amount: {tx.amount} — Commission: {tx.commission}</p>
                </div>
            </div>

            <div className="bg-card p-4 rounded-md">
                <h2 className="text-lg font-medium mb-2">Deposit Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(tx.data as Record<string, any>).map(([k, v]) => (
                        <div key={k} className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">{k}</div>
                            <div className="font-medium">{String(v)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-card p-4 rounded-md">
                <h2 className="text-lg font-medium mb-2">Deposit Details</h2>
                {data?.type === 'paystack' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">Phone</div>
                            <div className="font-medium">{(data as any).phoneNumber}</div>
                        </div>
                        <div className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">Email</div>
                            <div className="font-medium">{(data as any).email}</div>
                        </div>
                        <div className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">Network</div>
                            <div className="font-medium">{(data as any).network}</div>
                        </div>
                    </div>
                )}
                {data?.type === 'send' && (
                    <div className="p-2 border rounded">
                        <div className="text-xs text-muted-foreground">Transaction ID</div>
                        <div className="font-medium">{(data as any).transactionID}</div>
                    </div>
                )}
                {data?.type === 'momo' && (
                    <div className="p-2 border rounded">
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="font-medium">{(data as any).phoneNumber}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryDepositDetail;
