import React from "react";
import {cn} from "@/cn/lib/utils";

type PageContentProps = React.HTMLAttributes<HTMLDivElement>;
const PageContent: React.FC<PageContentProps> = ({className, children, ...props}) => {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    )
}

export default PageContent;