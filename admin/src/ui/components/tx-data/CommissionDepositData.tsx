import React from "react";
import {TxCommissionDepositData} from "@common/types/commission-deposit";
import {DollarSign} from "lucide-react";
import {Label} from "@/cn/components/ui/label.tsx";

interface Props { data: TxCommissionDepositData }

const CommissionDepositData: React.FC<Props> = ({data}) => {
    return (
        <div className={"p-3 rounded-md bg-muted/5 border"}>
            <div className={"flex items-center gap-2 mb-2"}>
                <DollarSign className={"w-5 h-5 text-primary/80"} />
                <div className={"font-medium"}>Commission Deposit</div>
            </div>
            <div className={"grid grid-cols-2 gap-2 text-sm"}>
                <div>
                    <Label>Amount</Label>
                    <div className={"text-foreground/90"}>{data.amount}</div>
                </div>
            </div>
        </div>
    )
}

export default CommissionDepositData;

