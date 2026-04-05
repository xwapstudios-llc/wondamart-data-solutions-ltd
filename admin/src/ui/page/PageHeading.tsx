import React, {type HTMLAttributes} from "react";
import {cn} from "@/cn/lib/utils.ts";

type PageHeadingProps = HTMLAttributes<HTMLHeadingElement>;

const PageHeading: React.FC<PageHeadingProps> = ({className, children, ...props}) => {
    return (
        <h1 className={cn("text-2xl font-semibold", className)} {...props}>{children}</h1>
    )
}

export default PageHeading;