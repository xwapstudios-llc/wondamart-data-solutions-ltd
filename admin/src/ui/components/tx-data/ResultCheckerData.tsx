import React from "react";
import {TxResultCheckerData} from "@common/types/result-checker";
import {FileText} from "lucide-react";
import {Label} from "@/cn/components/ui/label.tsx";

interface Props { data: TxResultCheckerData }

const ResultCheckerData: React.FC<Props> = ({data}) => {
    return (
        <div className={"p-3 rounded-md bg-muted/5 border"}>
            <div className={"flex items-center gap-2 mb-2"}>
                <FileText className={"w-5 h-5 text-primary/80"} />
                <div className={"font-medium"}>Result Checker</div>
            </div>
            <div className={"grid grid-cols-2 gap-2 text-sm"}>
                <div>
                    <Label>Type</Label>
                    <div className={"text-foreground/90"}>{data.checkerType}</div>
                </div>
                <div>
                    <Label>Units</Label>
                    <div className={"text-foreground/90"}>{data.units}</div>
                </div>
                <div>
                    <Label>Amount</Label>
                    <div className={"text-foreground/90"}>{data.amount}</div>
                </div>
            </div>
        </div>
    )
}

export default ResultCheckerData;

