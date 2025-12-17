import React from "react";
import {SidebarMenuButton} from "@/cn/components/ui/sidebar.tsx";
import {type LucideIcon} from "lucide-react";
import {cn} from "@/cn/lib/utils.ts";

interface SidebarItemLargeProps extends React.ComponentProps<typeof SidebarMenuButton> {
    Icon: LucideIcon;
    text: string;
    subtext?: string;
    RightIcon?: LucideIcon;
    colorVariant?: "default" | "danger" | "secondary";
}

const SidebarItemLarge: React.FC<SidebarItemLargeProps> = ({
                                                               Icon,
                                                               RightIcon,
                                                               text,
                                                               subtext,
                                                               colorVariant,
                                                               className,
                                                               ...props
                                                           }) => {
    const getVariantClasses = () => {
        switch (colorVariant) {
            case "danger":
                return "data-[state=open]:bg-red-600 data-[state=open]:text-red-100";
            case "secondary":
                return "data-[state=open]:bg-gray-600 data-[state=open]:text-gray-100";
            case "default":
            default:
                return "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground";
        }
    };
    const getVariantIconClasses = () => {
        switch (colorVariant) {
            case "danger":
                return "bg-red-100 text-red-600";
            case "secondary":
                return "bg-gray-100 text-gray-600";
            case "default":
            default:
                return "bg-sidebar-primary text-sidebar-primary-foreground";
        }
    };

    return (
        <SidebarMenuButton
            size="lg"
            className={cn(getVariantClasses(), className)}
            {...props}
        >
            <div
                className={`${getVariantIconClasses()} flex aspect-square size-8 items-center justify-center rounded-lg`}>
                <Icon className="size-4"/>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{text}</span>
                {subtext && <span className="truncate text-xs">{subtext}</span>}
            </div>
            {
                RightIcon && <RightIcon className="ml-auto"/>
            }
        </SidebarMenuButton>

    )
}

export default SidebarItemLarge;