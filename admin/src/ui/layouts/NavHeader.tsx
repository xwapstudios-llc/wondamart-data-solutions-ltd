import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/cn/components/ui/breadcrumb.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {ChevronLeft, MenuIcon} from "lucide-react";
import {R} from "@/app/routes";
import {Button} from "@/cn/components/ui/button.tsx";
import {useSidebar} from "@/cn/components/ui/sidebar.tsx";

interface NavHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavHeader: React.FC<NavHeaderProps> = ({className, ...props}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleSidebar } = useSidebar();

    const [breadCrumbs, setBreadCrumbs] = React.useState<{ href: string; text: string }[]>([]);

    React.useEffect(() => {
        const pathNames = location.pathname.split("/").filter((x) => x);
        const crumbs = pathNames.map((value, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const text = decodeURIComponent(
                value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ")
            );
            return {href, text};
        });
        setBreadCrumbs(crumbs);
    }, [location]);

    return (
        <header
            className={cn("flex h-16 md:h-12 shrink-0 items-center gap-2", className)}
            {...props}
        >
            {/* Mobile */}
            <nav className="flex md:hidden items-center gap-2 p-2 justify-between h-full w-full border-b">
                <div className="flex items-center gap-2">
                    {breadCrumbs.length > 1 && location.pathname !== R.app.index && (
                        <Button
                            onClick={() => navigate(-1)}
                            size="icon-lg"
                            variant="outline"
                            className="rounded-full"
                        >
                            <ChevronLeft className="size-5 text-muted-foreground" strokeWidth={1.5}/>
                        </Button>
                    )}
                    <img className="size-8" src="/favicon.ico" alt="logo"/>
                    <div className="grid text-left text-sm leading-tight">
                        <span className="truncate font-medium text-wondamart dark:text-blue-400">Wondamart Data Solutions</span>
                        <span className="truncate text-xs text-wondamart dark:text-blue-400">
                            Agent{" "}
                            <span className="text-muted-foreground">
                                {breadCrumbs.length > 1
                                    ? `| ${breadCrumbs[breadCrumbs.length - 1].text}`
                                    : "| Dashboard"}
                            </span>
                        </span>
                    </div>
                </div>
                <Button size="icon" variant="ghost" onClick={toggleSidebar}>
                    <MenuIcon className="size-5"/>
                </Button>
            </nav>

            {/* Desktop */}
            <nav className="hidden md:flex items-center gap-2 px-4">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0.5">
                        {breadCrumbs.map((value, i) => (
                            <div key={i} className="flex items-center justify-center">
                                <BreadcrumbItem>
                                    {i < breadCrumbs.length - 1 ? (
                                        <BreadcrumbLink
                                            href={value.href}
                                            className="hover:bg-secondary p-1 px-2 rounded-md"
                                        >
                                            {value.text}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{value.text}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {i < breadCrumbs.length - 1 && <BreadcrumbSeparator/>}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </nav>
        </header>
    );
};

export default NavHeader;
