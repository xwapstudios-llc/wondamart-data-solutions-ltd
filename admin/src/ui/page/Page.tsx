import React from "react";
import {cn} from "@/cn/lib/utils.ts";

type PageProps = React.HTMLAttributes<HTMLDivElement>;

const Page: React.FC<PageProps> = ({className, children, ...props}) => {
    return (
        <main className={cn(className, "px-3 md:px-4 mb-2 md:pb-8")} {...props}>
            {children}
        </main>
    )
}

export default Page;