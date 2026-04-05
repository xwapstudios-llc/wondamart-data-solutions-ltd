import React from "react";
import {cn} from "@/cn/lib/utils.ts";

type PageSubHeadingProps = React.HTMLAttributes<HTMLParagraphElement>;

const PageSubHeading: React.FC<PageSubHeadingProps> = ({className, children, ...props}) => {
    return (
        <p className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</p>
    )
}

export default PageSubHeading;