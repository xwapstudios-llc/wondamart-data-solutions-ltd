import React from "react";
import {cn} from "@/cn/lib/utils";
import {BadgeDollarSignIcon, HistoryIcon, HomeIcon, ShoppingBagIcon, UserIcon,} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import {R} from "@/app/routes.ts";

const TABS = [
    {name: "Home", icon: HomeIcon, path: R.app.index},
    {name: "Purchase", icon: ShoppingBagIcon, path: R.app.purchase.index},
    {name: "History", icon: HistoryIcon, path: R.app.history.index},
    {name: "Commission", icon: BadgeDollarSignIcon, path: R.app.commissions.index},
    {name: "User", icon: UserIcon, path: R.app.user.index},
];

type MobileBottomNavProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
const MobileBottomNav: React.FC<MobileBottomNavProps> = ({className, ...props}) => {
    const location = useLocation();
    const pathname = location.pathname;

    const isActive = (route: string) => {
        if (route === "/app") {
            return pathname === "/app"; // home only active on exact /app
        }
        return pathname === route || pathname.startsWith(route + "/");
    };


    return (
        <div className={cn(
            "bg-wondamart text-primary-foreground dark:bg-background fixed bottom-0 left-0 right-0 flex justify-evenly z-40",
            className
        )}
             {...props}
        >
            {
                TABS.map((tab) => {
                    const active = isActive(tab.path);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 py-2",
                                active && "text-primary"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-all",
                                    active && "text-primary"
                                )}
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-medium">{tab.name}</span>
                        </Link>
                    );
                })
            }
        </div>
    )
}

export default MobileBottomNav;
