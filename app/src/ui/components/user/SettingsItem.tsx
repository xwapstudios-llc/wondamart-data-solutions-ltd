import React from "react";
import {cn} from "@/cn/lib/utils";
import {ChevronRight, type LucideIcon} from "lucide-react";
import {Link} from "react-router-dom";


interface SettingsItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
    Icon: LucideIcon;
    label: string;
    href: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({Icon, label, href, className, children, ...props}) => {
    return (
        <Link to={href} className={cn(
            "flex items-center justify-between p-2 px-4 cursor-pointer hover:bg-accent/50 transition-colors rounded-md",
            className
        )}
             {...props}
        >
            {children}

            <div className="flex items-center gap-4">
                <Icon strokeWidth={1.5} className={"size-6"} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
    )
}

export default SettingsItem;