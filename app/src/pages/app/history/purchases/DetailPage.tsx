import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ClTx} from '@common/client-api/tx';
import {DataBundles} from '@common/client-api/db-data-bundle';
import type {Tx, TxData} from '@common/types/tx';
import {getTxIcon, getTxName, toCurrency} from '@/lib/icons';
import LoadingView from '@/ui/components/views/LoadingView';
import StatusBadge from "@/ui/components/typography/StatusBadge.tsx";
import type {DataBundle} from "@common/types/data-bundle.ts";

const HistoryPurchaseDetail: React.FC = () => {
    const {id} = useParams();
    const [tx, setTx] = useState<Tx | null>(null);
    const [bundle, setBundle] = useState<DataBundle | null>(null);
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

                // If it's a data-bundle purchase, try to load the bundle details
                if (fetched.type === 'data-bundle') {
                    const data = fetched.data as any;
                    if (data?.bundleId) {
                        try {
                            const b = await DataBundles.readOne(data.bundleId);
                            setBundle(b ?? null);
                        } catch (e) {
                            console.warn('Failed to load bundle details', e);
                            setBundle(null);
                        }
                    }
                }
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
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Purchase Detail</h1>
            <p className="text-sm text-muted-foreground">No transaction found for id {id}</p>
        </div>
    );

    const Icon = getTxIcon[tx.type === 'deposit' ? 'deposit' : 'tx'] ?? getTxIcon['tx'];

    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
                <div className={"flex items-center justify-center mx-auto flex-col gap-2"}>
                    <div className="p-8 w-fit rounded-full bg-primary/50 flex items-center justify-center">
                        <Icon strokeWidth={1.5} className="size-32" />
                    </div>
                    <StatusBadge size={"lg"} status={tx.status} />
                    <p className="text-2xl font-semibold self-center">{getTxName[tx.type]}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <div className="text-xs text-muted-foreground">Transaction ID</div>
                        <div className="font-medium">{tx.id}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-medium">{toCurrency(tx.amount)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Commission</div>
                        <div className="font-medium">{toCurrency(tx.commission)}</div>
                    </div>
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

            {tx.type === 'data-bundle' && (
                <div className="bg-card/50 p-4 rounded-md">
                    <h2 className="text-lg font-medium mb-2">Bundle Details</h2>
                    {bundle ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">Name</div>
                                <div className="font-medium">{bundle.name ?? bundle.id}</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">Network</div>
                                <div className="font-medium">{bundle.network}</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">Price</div>
                                <div className="font-medium">{bundle.price}</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">Data</div>
                                <div className="font-medium">{bundle.dataPackage?.data ?? ''} GB</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">Minutes</div>
                                <div className="font-medium">{bundle.dataPackage?.minutes ?? ''} min</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground">SMS</div>
                                <div className="font-medium">{bundle.dataPackage?.sms ?? ''} units</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Bundle details not available.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoryPurchaseDetail;
