import React from "react";
import {cn} from "@/cn/lib/utils";
import {ChevronRight, type LucideIcon} from "lucide-react";
import {Link} from "react-router-dom";


interface SettingsItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
    Icon: LucideIcon;
    label: string;
    href: string;
    color?: string;
    description?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({Icon, label, href, color, description, className, children, ...props}) => {
    return (
        <Link to={href} className={cn(
            "flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors rounded-xl",
            className
        )}
             {...props}
        >
            {children}

            <div className="flex items-center gap-3">
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-md text-white", color ?? "bg-muted text-foreground")}>
                    <Icon strokeWidth={1.5} className="size-4" />
                </div>
                <div>
                    <p className="text-sm font-medium leading-tight">{label}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
    )
}

export default SettingsItem;