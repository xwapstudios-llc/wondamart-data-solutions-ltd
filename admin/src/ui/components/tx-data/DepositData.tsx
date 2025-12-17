import React from "react";
import {TxAccountDepositData} from "@common/types/account-deposit";
import {CreditCard} from "lucide-react";
import {Label} from "@/cn/components/ui/label.tsx";

interface Props { data: TxAccountDepositData }

const DepositData: React.FC<Props> = ({data}) => {
    return (
        <div className={"p-3 rounded-md bg-muted/5 border"}>
            <div className={"flex items-center gap-2 mb-2"}>
                <CreditCard className={"w-5 h-5 text-primary/80"} />
                <div className={"font-medium"}>Account Deposit</div>
            </div>
            <div className={"grid grid-cols-2 gap-2 text-sm"}>
                <div>
                    <Label>Phone</Label>
                    <div className={"text-foreground/90"}>{data.phoneNumber}</div>
                </div>
                <div>
                    <Label>Network</Label>
                    <div className={"text-foreground/90"}>{data.network}</div>
                </div>
                <div>
                    <Label>Amount</Label>
                    <div className={"text-foreground/90"}>{data.amount}</div>
                </div>
            </div>
        </div>
    )
}

export default DepositData;

