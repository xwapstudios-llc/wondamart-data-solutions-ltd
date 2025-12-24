import React, {useState} from "react";
import type {DataBundle} from "@common/types/data-bundle.ts";
import LoadingView from "@/ui/components/views/LoadingView.tsx";
import DataPackageCard from "@/ui/components/cards/purchase/DataPackageCard.tsx";
import {cn} from "@/cn/lib/utils.ts";
import NoItems from "@/ui/components/cards/NoItems.tsx";

interface BundlesViewProps extends React.HTMLAttributes<HTMLDivElement> {
    loading: boolean;
    bundles: DataBundle[];
}

const BundlesView: React.FC<BundlesViewProps> = ({loading, bundles, className, children, ...props}) => {
    const [activeID, setActiveID] = useState("");
    return (
        <>
            {
                loading ? (
                    <div className={cn("bundles-grid", className)} {...props}>
                        <LoadingView className={cn("h-36", className)}/>
                        <LoadingView className={cn("h-36", className)}/>
                        <LoadingView className={cn("h-36", className)}/>
                        <LoadingView className={cn("h-36", className)}/>
                    </div>
                ) : bundles.length == 0 ? (
                    <NoItems className={cn("h-full w-full grow md:h-[45svh]", className)}>No Data Bundles</NoItems>
                ) : (
                    <div className={cn("bundles-grid", className)} {...props}>
                        {
                            bundles.sort((a, b) => {
                                if (a.validityPeriod !== b.validityPeriod) {
                                    return a.validityPeriod - b.validityPeriod;
                                }
                                return a.dataPackage.data - b.dataPackage.data;
                            }).map((dataPackage, i) => (
                                <DataPackageCard activeID={activeID} onActivate={() => {
                                    setActiveID(dataPackage.id === activeID ? "" : dataPackage.id);
                                }} dataPackage={dataPackage} key={i + dataPackage.id}/>
                            ))
                        }
                        {children}
                    </div>
                )
            }
        </>
    )
}

export default BundlesView;