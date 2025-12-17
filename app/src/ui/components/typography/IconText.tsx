import React from "react";
import type {LucideIcon} from "lucide-react";
import {cn} from "@/cn/lib/utils.ts";
import type {NetworkId} from "@common/types/data-bundle.ts";

interface IconTextProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon: LucideIcon;
    children?: React.ReactNode;
    variant?: "default" | "muted" | "primary" | "destructive" | "green" | NetworkId;
    spanClass?: string;
}

const IconText: React.FC<IconTextProps> = ({className, children, Icon, spanClass, variant = "default", ...props}) => {
    const iconVariantClasses = {
        default: "text-foreground/75 bg-foreground/10",
        muted: "text-muted-foreground bg-muted-background",
        primary: "text-primary/75 bg-primary/10",
        destructive: "text-destructive/75 bg-destructive/10",
        green: "text-foreground bg-green-600",
        mtn: "text-mtn/75 bg-mtn/15",
        telecel: "text-telecel/75 bg-telecel/15",
        airteltigo: "text-airteltigo/75 bg-airteltigo/15",
    }

    return (
        <div className={cn(className, "flex gap-2 shadow-sm p-1 rounded-md pr-2 items-center")} {...props}>
            <Icon className={cn("w-6 h-6 inline-block p-1 rounded-sm", iconVariantClasses[variant])}/>
            <span className={spanClass}>{children}</span>
        </div>
    )
}

export default IconText;