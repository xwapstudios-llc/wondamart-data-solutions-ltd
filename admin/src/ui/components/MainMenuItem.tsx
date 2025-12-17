import React, {type HTMLAttributes} from "react";
import type {LucideIcon} from "lucide-react";
import {Link} from "react-router-dom";

interface MainMenuItemProps extends HTMLAttributes<HTMLAnchorElement> {
    Icon: LucideIcon;
    children: string;
    href: string;
}

const MainMenuItem: React.FC<MainMenuItemProps> = ({Icon, href, className, children, ...props}) => {
    return (
        <Link to={href} className={`flex flex-col gap-2 items-center justify-center p-2 border-2 border-primary rounded-lg ${className}`} {...props} >
            <Icon size={44} strokeWidth={1.5} />
            {children}
        </Link>
    )
}

export default MainMenuItem;