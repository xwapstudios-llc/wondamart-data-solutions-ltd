import React from "react";
import {TxDataBundleData} from "@common/types/data-bundle";
import {Smartphone} from "lucide-react";
import {Label} from "@/cn/components/ui/label.tsx";

interface Props { data: TxDataBundleData }

const DataBundleData: React.FC<Props> = ({data}) => {
    return (
        <div className={"p-3 rounded-md bg-muted/5 border"}>
            <div className={"flex items-center gap-2 mb-2"}>
                <Smartphone className={"w-5 h-5 text-primary/80"} />
                <div className={"font-medium"}>Data Bundle</div>
            </div>
            <div className={"grid grid-cols-2 gap-2 text-sm"}>
                <div>
                    <Label>Network</Label>
                    <div className={"text-foreground/90"}>{data.network}</div>
                </div>
                <div>
                    <Label>Bundle ID</Label>
                    <div className={"text-foreground/90 break-words"}>{data.bundleId}</div>
                </div>
                <div>
                    <Label>Phone</Label>
                    <div className={"text-foreground/90"}>{data.phoneNumber}</div>
                </div>
                <div>
                    <Label>Amount</Label>
                    <div className={"text-foreground/90"}>{data.amount}</div>
                </div>
            </div>
        </div>
    )
}

export default DataBundleData;

