import React from "react";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {cn} from "@/cn/lib/utils.ts";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({title, subtitle, className, children, ...props}) => {
    return (
        <div className={cn("px-3 md:px-4 mt-4", className)} {...props}>
            <PageHeading>{title}</PageHeading>
            { subtitle && (<PageSubHeading>Choose a network and bundle.</PageSubHeading>) }
            {children}
        </div>
    )
}

export default PageHeader;