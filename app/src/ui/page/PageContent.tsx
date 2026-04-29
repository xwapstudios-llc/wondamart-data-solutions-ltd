import React from "react";
import {cn} from "@/cn/lib/utils";

type PageContentProps = React.HTMLAttributes<HTMLDivElement>;
const PageContent: React.FC<PageContentProps> = ({className, children, ...props}) => {
    return (
        <div className={cn("px-3 md:px-4 pt-4 mb-8", className)} {...props}>
            {children}
        </div>
    )
}

export default PageContent;