import React from "react";
import {cn} from "@/cn/lib/utils";
import {Link} from "react-router-dom";
import {buttonVariants} from "@/cn/components/ui/button.tsx";

interface DashboardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    link?: {
        to: string;
        label: string;
    };
    title: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({title, link, className, children, ...props}) => {
    return (
        <div {...props}>
            <div className={"flex gap-2 items-center justify-between"}>
                <p className={"text-lg font-semibold"}>{title}</p>
                {
                    link && (
                        <Link
                            to={link.to}
                            className={cn(
                                "text-xs",
                                buttonVariants({variant: "link", size: "sm"})
                            )}
                        >
                            {link.label}
                        </Link>
                    )
                }
            </div>
            <div className={cn("mt-1", className)}>
                {children}
            </div>
        </div>
    )
}

export default DashboardSection;