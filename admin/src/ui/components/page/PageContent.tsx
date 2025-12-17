import React from "react";
import {cn} from "@/cn/lib/utils.ts";

type PageContentProps = React.HtmlHTMLAttributes<HTMLDivElement>;
const PageContent: React.FC<PageContentProps> = ({className, children, ...props}) => {
    return (
        <div className={cn("max-w-4xl mx-auto px-2", className)} {...props}>
            {children}
        </div>
    )
}

export default PageContent;