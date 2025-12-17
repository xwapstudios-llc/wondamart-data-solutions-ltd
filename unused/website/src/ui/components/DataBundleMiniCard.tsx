import React, {useEffect, useState} from "react";
import {getProviderById} from "@/lib/providers";
import {ArrowUpRightFromCircle, CheckIcon, XIcon} from "lucide-react";
import {numToMoney} from "@/lib/formatters";
import {DataBundle, TxDataBundle} from "@common/types/data-bundle";
import {DataBundles} from "@common/client-api/db-data-bundle";

interface DataBundleMiniCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tx: TxDataBundle
}

const DataBundleMiniCard: React.FC<DataBundleMiniCardProps> = ({tx, className, ...props}) => {
    const [bundle, setBundle] = useState<DataBundle | null>(null)
    useEffect(() => {
        DataBundles.readOne(tx.data.bundleId).then((value) => {
            if (value) setBundle(value);
        });
    });

    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center bg-muted/25 ${className}`} {...props}>
            {
                tx.status === "pending" ? <ArrowUpRightFromCircle className={"text-primary"} />
                    : tx.status === "completed" ? <CheckIcon className={"text-green-500"} />
                        : tx.status === "failed" ? <XIcon className={"text-red-500"} />
                            : null
            }
            <div className={"grow space-y-1"}>
                <p className={"flex gap-4 items-center justify-between"}>
                    <span>{tx.data.phoneNumber}</span>
                    <span>{`GHC ${bundle ? numToMoney(bundle?.price): "N/A"}`}</span>
                </p>
                <p className={"text-xs text-muted-foreground flex gap-1 justify-between"}>
                    <span>
                        Bundle ● {getProviderById(tx.data.network)?.name}
                    </span>
                    <span>
                        {tx.id}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default DataBundleMiniCard;