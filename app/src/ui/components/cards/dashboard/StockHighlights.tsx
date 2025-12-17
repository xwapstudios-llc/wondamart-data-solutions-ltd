import React from "react";
import {cn} from "@/cn/lib/utils";
import {useAppStore} from "@/lib/useAppStore.ts";
import TextIconInStock from "@/ui/components/typography/TextIconInStock.tsx";

type StockHighlightsProps = React.HTMLAttributes<HTMLDivElement>;

const StockHighlights: React.FC<StockHighlightsProps> = ({className, ...props}) => {
    const {commonSettings} = useAppStore();
    const dataBundles = commonSettings.dataBundles;
    const resultCheckers = commonSettings.resultChecker;

    return (
        <div className={cn("flex gap-4 overflow-x-auto", className)} {...props}>
            {/*Data bundles*/}
            <TextIconInStock inStock={dataBundles.enabled && dataBundles.mtn.enabled}>MTN</TextIconInStock>
            <TextIconInStock inStock={dataBundles.enabled && dataBundles.telecel.enabled}>Telecel</TextIconInStock>
            <TextIconInStock inStock={dataBundles.enabled && dataBundles.airteltigo.enabled}>AirtelTigo</TextIconInStock>

            {/*Result checkers*/}
            <TextIconInStock inStock={resultCheckers.enabled}>BECE</TextIconInStock>
            <TextIconInStock inStock={resultCheckers.enabled}>WASSCE</TextIconInStock>

            {/*AFA*/}
            <TextIconInStock inStock={commonSettings.afa.enabled}>AFA</TextIconInStock>
        </div>
    )
}

export default StockHighlights;