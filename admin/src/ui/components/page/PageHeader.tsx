import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import {MenuIcon} from "lucide-react";

type PageHeaderProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const PageHeader: React.FC<PageHeaderProps> = ({className, children, title, ...props}) => {
    return (
        <header className={cn("border-b sticky top-0", className)} {...props} >
            <nav className={"flex items-center justify-between px-1 py-2"}>
                <h2 className={"font-medium"}>WondaMart {title ? title : "Admin"}</h2>
                <MenuIcon size={28} />
            </nav>
            {children}
        </header>
    )
}

export default PageHeader;