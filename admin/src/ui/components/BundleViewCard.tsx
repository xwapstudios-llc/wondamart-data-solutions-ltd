import React from "react";
import type {DataBundle, NetworkId} from "@common/types/data-bundle.ts";
import {ArrowUpDownIcon, MailIcon, PhoneCallIcon} from "lucide-react";
import {useNavigate, useLocation} from "react-router-dom";
import R from "@/routes.ts";

interface DataPackageViewProps extends React.HTMLAttributes<HTMLDivElement> {
    bundle: DataBundle;
}

const BundleViewCard: React.FC<DataPackageViewProps> = ({className, bundle, ...props}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getBundleColor = (network: NetworkId) => {
        switch (network) {
            case "mtn":
                return "bg-yellow-500/15 text-yellow-500";
            case "telecel":
                return "bg-red-500/15 text-red-500";
            case "airteltigo":
                return "bg-blue-500/15 text-blue-500";
        }
    }

    return (
        <div
            className={`cursor-pointer border rounded-lg p-2 shadow-lg ${bundle.enabled ? "border-primary" : "border-muted"} ${className}`}
            onClick={(e) => {
                if (location.pathname == R.bundle(bundle.id)) return; // Avoid navigating if already on the same page

                navigate(R.bundle(bundle.id));
                e.stopPropagation();
            }}  {...props}>
            <div className={"flex gap-2 justify-between w-full"}>
                <div>
                    {bundle.name && <p className={"font-medium"}>{bundle.name}</p>}
                    <p className={"text-sm text-muted-foreground"}>{bundle.id}</p>
                </div>
                <span className={`h-fit w-fit text-sm px-1 py-0.5 rounded-sm ${getBundleColor(bundle.network)}`}>
                    {bundle.network}
                </span>
            </div>
            <div className={"flex gap-2 justify-between items-center"}>
                <div className={""}>
                    Validity Period: {bundle.validityPeriod}
                </div>
                <div>
                    <div className={"text-lg font-medium"}>
                        GHS {bundle.price.toFixed(2)}
                    </div>
                    <div className={"text-xs font-medium text-muted-foreground text-right"}>
                        GHS {bundle.commission ? bundle.commission?.toFixed(2) : "0.00"}
                    </div>
                </div>
            </div>
            <div className={"text-sm grid grid-cols-3 gap-2"}>
                <div className={"flex gap-1 items-center p-1 rounded-md border shadow-sm"}>
                    <ArrowUpDownIcon className={"p-1 rounded-sm bg-primary/10 text-primary/50"}/>
                    <span>{bundle.dataPackage.data} GB</span>
                </div>
                {
                    bundle.dataPackage.minutes &&
                    <div className={"flex gap-1 items-center p-1 rounded-md border shadow-sm"}>
                        <PhoneCallIcon className={"p-1 rounded-sm bg-primary/10 text-primary/50"}/>
                        <span>{bundle.dataPackage.minutes} min</span>
                    </div>
                }
                {
                    bundle.dataPackage.sms &&
                    <div className={"flex gap-1 items-center p-1 rounded-md border shadow-sm"}>
                        <MailIcon className={"p-1 rounded-sm bg-primary/10 text-primary/50"}/>
                        <span>{bundle.dataPackage.sms}</span>
                    </div>
                }
            </div>
            <div
                className={`h-8 mt-2 rounded-sm flex items-center justify-center ${bundle.enabled ? "text-green-600/75 bg-green-500/5" : "text-red-600/75 bg-red-500/5"} font-medium`}>
                {bundle.enabled ? "Active" : "Disabled"}
            </div>
        </div>
    )
}

export default BundleViewCard;