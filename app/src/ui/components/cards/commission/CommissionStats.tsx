import React from "react";
import {cn} from "@/cn/lib/utils";
import {type LucideIcon} from "lucide-react";

interface CommissionStatsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    Icon: LucideIcon;
    display: React.ReactNode;
    sub: React.ReactNode;
}

const CommissionStats: React.FC<CommissionStatsProps> = ({Icon, display, sub, className, ...props}) => {
    return (
        <div className={cn(
            "p-4 rounded-md bg-secondary/15 dark:bg-secondary/30 border border-primary-foreground/15 space-y-1",
            className
        )}
             {...props}
        >
            <div className="flex items-center gap-3">
                <Icon className="size-5 dark:opacity-75"/>
                <span className="text-xl font-bold">{display}</span>
            </div>
            <span className="text-xs opacity-90 dark:opacity-60">{sub}</span>
        </div>
    )
}

export default CommissionStats;