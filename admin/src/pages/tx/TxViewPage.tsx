import React, {useEffect, useState} from "react";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {useParams} from "react-router-dom";
import {AdminTx} from "@common/admin-api/tx.ts";
import {Tx} from "@common/types/tx.ts";
import {Loader2Icon} from "lucide-react";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import TxViewCard from "@/ui/components/TxViewCard.tsx";
import TxDataRenderer from "@/ui/components/tx-data";

const TxViewPage: React.FC = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tx, setTx] = useState<Tx | undefined>();


    useEffect(() => {
        const fetchTx = () => {
            if (!id) return;

            setLoading(true);
            AdminTx.readOne(id)
                .then(tx => {
                    setTx(tx);
                })
                .catch(err => {
                    console.error(err);
                    setError(String(err));
                }).finally(() => setLoading(false));
        }

        fetchTx();
    }, [id]);

    return (
        <Page>
            <PageHeader title={"Transaction view"}>
                {
                    id && <p className={"text-center font-medium p-2 bg-muted text-muted-foreground"}>
                        {id}
                    </p>
                }
            </PageHeader>
            <PageContent className={"space-y-4"}>
                {
                    tx && !loading ? (
                        <TxViewCard tx={tx} className={"border-none border-0 shadow-lg mt-2"}/>
                    ) : (
                        <Skeleton className={"w-full h-64 rounded-lg mt-2 flex items-center justify-center"}>
                            <Loader2Icon className={"animate-spin"} size={44}/>
                        </Skeleton>
                    )
                }
                {
                    error && <p className={"text-destructive p-8"}>
                        {error}
                    </p>
                }
                <div className={"space-y-4"}>
                    {
                        tx ? (
                            <div>
                                <div className={"text-sm font-medium mb-2"}>Details</div>
                                <TxDataRenderer tx={tx}/>
                            </div>
                        ) : null
                    }
                </div>
            </PageContent>
        </Page>
    )
}

export default TxViewPage;