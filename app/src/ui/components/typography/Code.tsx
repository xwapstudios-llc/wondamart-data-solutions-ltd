import React from "react";
import {cn} from "@/cn/lib/utils.ts";

type CodeProps = React.HTMLAttributes<HTMLSpanElement>;

const Code: React.FC<CodeProps> = ({className, children, ...props}) => {
    return (
        <code className={cn(className, "px-1 pb-0.5 pt-1 bg-foreground/12 rounded-[6px]")} {...props}>
            {children}
        </code>
    )
}

export default Code;