import React from "react";
import {TxAfaBundleData} from "@common/types/afa-bundle";
import {Package as PackageIcon} from "lucide-react";
import {Label} from "@/cn/components/ui/label.tsx";

interface Props { data: TxAfaBundleData }

const AfaBundleData: React.FC<Props> = ({data}) => {
    return (
        <div className={"p-3 rounded-md bg-muted/5 border"}>
            <div className={"flex items-center gap-2 mb-2"}>
                <PackageIcon className={"w-5 h-5 text-primary/80"} />
                <div className={"font-medium"}>AFA Bundle</div>
            </div>
            <div className={"grid grid-cols-2 gap-2 text-sm"}>
                <div>
                    <Label>Full Name</Label>
                    <div className={"text-foreground/90 wrap-break-word"}>{data.fullName}</div>
                </div>
                <div>
                    <Label>Phone</Label>
                    <div className={"text-foreground/90"}>{data.phoneNumber}</div>
                </div>
                <div>
                    <Label>ID Number</Label>
                    <div className={"text-foreground/90"}>{data.idNumber}</div>
                </div>
                <div>
                    <Label>DOB</Label>
                    <div className={"text-foreground/90"}>{new Date(data.date_of_birth).toLocaleDateString()}</div>
                </div>
                <div>
                    <Label>Amount</Label>
                    <div className={"text-foreground/90"}>{data.amount}</div>
                </div>
            </div>
        </div>
    )
}

export default AfaBundleData;

