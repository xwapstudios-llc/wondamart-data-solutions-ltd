import React from "react";
import {cn} from "@/cn/lib/utils";
import {EllipsisVerticalIcon, type LucideIcon, TrendingUpIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/cn/components/ui/dropdown-menu.tsx";

interface ActivityHighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    Icon?: LucideIcon;
    iconClassName?: string;
    subTitle?: string;
    actions?: {
        label: string;
        Icon?: LucideIcon;
        action: () => void;
    }[],
    childrenClassName?: string;
}

const ActivityHighlightCard: React.FC<ActivityHighlightCardProps> =
    ({className,
         title,
         Icon = TrendingUpIcon,
         iconClassName,
         children,
         subTitle,
         actions,
         childrenClassName,
         ...props }) => {
    return (
        <div className={cn(
            "h-fit min-w-36 rounded-md bg-secondary/50 shrink-0 p-2",
            className
        )}
             {...props}
        >
            <div className={"flex items-center justify-between"}>
                <div className={"flex gap-2 items-center"}>
                    <div className={cn("p-2 rounded-full bg-primary ", iconClassName)}>
                        <Icon strokeWidth={1.5} className={cn("size-6")}/>
                    </div>
                    <h4 className={"font-semibold"}>{title}</h4>
                </div>
                {
                    actions && actions.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVerticalIcon className={"size-5"} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {
                                    actions.map(({ label, Icon, action }) => (
                                        <DropdownMenuItem onClick={action}>
                                            {Icon && <Icon strokeWidth={1.5} />}
                                            {label}
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            </div>
            <div className={cn(
                childrenClassName,
                "text-right -mt-4"
            )}>
                {children}
            </div>
            {
                subTitle && (
                    <p className={"text-xs opacity-75 text-right"}>{subTitle}</p>
                )
            }
        </div>
    )
}

export default ActivityHighlightCard;