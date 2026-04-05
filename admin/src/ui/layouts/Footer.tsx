import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import {Link} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {useAppStore} from "@/lib/useAppStore.ts";


type FooterProps = React.HTMLAttributes<HTMLDivElement>;

const Footer: React.FC<FooterProps> = ({className, children, ...props}) => {
    const {user} = useAppStore();

    return (
        <footer className={cn("bg-muted text-muted-foreground", className)} {...props}>
            <div className={"container mx-auto p-4 pb-8"}>
                <Link to={user ? R.app.index : R.login} className={"flex gap-2 items-center flex-wrap"}>
                    <img src={"/logo/logo_icon.png"} alt={"logo"} width={40} height={40} />
                    <span className={"text-xl md:text-2xl text-primary"}>Wondamart Data Solutions</span>
                </Link>
                <div className={"flex gap-12 items-start justify-start"}>
                    <Link to={R.termsAndConditions}>Terms of Service</Link>
                    <Link to={R.utils.whatsAppGroup}>Contact Support</Link>
                </div>
                <div className={"mt-12 text-sm text-muted-foreground text-center"}>
                    &copy; {new Date().getFullYear()} Wondamart Data Solutions. All rights
                    reserved.
                </div>
            </div>
            {children}
        </footer>
    )
}

export default Footer;