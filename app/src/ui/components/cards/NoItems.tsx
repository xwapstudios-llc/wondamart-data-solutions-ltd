import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import {type LucideIcon, PackageSearchIcon} from "lucide-react";

interface NoBundlesProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon?: LucideIcon;
}

const NoItems: React.FC<NoBundlesProps> = ({
                                               className,
                                               children = "No Data Bundles",
                                               Icon = PackageSearchIcon,
                                               ...props
                                           }) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-8 p-8 text-primary-foreground bg-primary dark:bg-primary/75 rounded-xl text-xl",
                className
            )}
            {...props}
        >
            <Icon strokeWidth={1.25} className={"size-32"}/>
            <code>{children}</code>
        </div>
    )
}

export default NoItems;