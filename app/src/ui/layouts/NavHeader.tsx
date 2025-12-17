import React, {useState} from "react";
import {Separator} from "@/cn/components/ui/separator.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/cn/components/ui/breadcrumb.tsx";
import {SidebarTrigger, useSidebar} from "@/cn/components/ui/sidebar.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {ChevronLeft} from "lucide-react";
import {R} from "@/app/routes";
import {Button} from "@/cn/components/ui/button.tsx";

type NavHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const NavHeader: React.FC<NavHeaderProps> = ({className, ...props}) => {
    const {isMobile} = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();

    const [breadCrumbs, setBreadCrumbs] = useState<
        { href: string; text: string }[]
    >([]);

    // Use Effect to update breadcrumbs based on location
    React.useEffect(() => {
        const pathNames = location.pathname.split("/").filter((x) => x);
        const crumbs = pathNames.map((value, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const text = decodeURIComponent(
                value.charAt(0).toUpperCase() +
                value.slice(1).replace(/-/g, " ")
            );
            return {href, text};
        });
        setBreadCrumbs(crumbs);
    }, [location]);

    return (
        <header
            className={cn(
                "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
                className
            )}
            {...props}
        >
            {isMobile ? (
                <nav
                    className={`flex items-center gap-2 p-2 justify-between h-full w-full border-b`}
                >
                    <div className="flex items-center gap-2 pr-2 ">
                        {
                            breadCrumbs.length > 1 && location.pathname != R.app.index && (
                                <Button
                                    onClick={() => navigate(-1)}
                                    size={"icon-lg"} variant={"outline"} className={"rounded-full"}>
                                    <ChevronLeft className={"size-5 text-muted-foreground"} strokeWidth={1.5}/>
                                </Button>
                            )
                        }
                        <img className={"size-8"} src={"/favicon.ico"} alt={"logo"}/>
                        <div className="grid flex-1 text-left text-sm leading-tight text-blue-900">
                            <span className="truncate font-medium text-wondamart">
                                Wondamart Data Solutions
                            </span>
                            <span className="truncate text-xs text-wondamart">
                                Agent{" "}
                                <span className={"text-muted-foreground"}>
                                    {breadCrumbs.length > 1
                                        ? ` | ${
                                            breadCrumbs[
                                            breadCrumbs.length - 1
                                                ].text
                                        }`
                                        : "| Dashboard"}
                                </span>
                            </span>
                        </div>
                    </div>
                    <SidebarTrigger className="-ml-1"/>
                </nav>
            ) : (
                <nav className={`flex items-center gap-2 px-4`}>
                    <SidebarTrigger className="-ml-1"/>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList className={"gap-0.5"}>
                            {breadCrumbs.map((value, i) => (
                                <div
                                    key={i}
                                    className={
                                        "flex items-center justify-center"
                                    }
                                >
                                    <BreadcrumbItem>
                                        {i < breadCrumbs.length - 1 ? (
                                            <BreadcrumbLink
                                                href={value.href}
                                                className={
                                                    "hover:bg-secondary p-1 px-2 rounded-md"
                                                }
                                            >
                                                {value.text}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>
                                                {value.text}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {i < breadCrumbs.length - 1 && (
                                        <BreadcrumbSeparator/>
                                    )}
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </nav>
            )}
        </header>
    );
};

export default NavHeader;
