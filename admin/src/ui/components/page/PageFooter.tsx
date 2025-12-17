import React from "react";
import {cn} from "@/cn/lib/utils.ts";

type PageFooterProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const PageFooter: React.FC<PageFooterProps> = ({className, children, ...props}) => {
    return (
        <footer className={cn("", className)} {...props} >
            {children}
        </footer>
    )
}

export default PageFooter;