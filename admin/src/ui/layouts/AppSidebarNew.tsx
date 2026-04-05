import React, {useState} from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {cn} from "@/cn/lib/utils.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useTheme} from "@/cn/components/theme/theme-provider.tsx";
import {R} from "@/app/routes.ts";
import {useSidebar} from "@/cn/components/ui/sidebar.tsx";
import {
    ArrowUpDownIcon,
    BookOpenIcon,
    ChevronDownIcon,
    CoinsIcon,
    CompassIcon,
    Moon,
    Package2Icon,
    ShieldIcon,
    ShoppingBagIcon,
    Sun,
    User2Icon,
    type LucideIcon, MailsIcon,
} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/cn/components/ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/cn/components/ui/dropdown-menu.tsx";
import {txTypes} from "@common/tx";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SubItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    color: string; // tailwind bg class
    items: SubItem[];
}

// ─── Nav data ────────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
    {
        title: "Agent Stores",
        url: R.app.agentStore,
        icon: ShoppingBagIcon,
        color: "bg-purple-500",
        items: [],
    },
    {
        title: "Stock",
        url: R.app.stock.index,
        icon: Package2Icon,
        color: "bg-blue-500",
        items: [
            {title: "Bundles", url: R.app.stock.bundles, icon: Package2Icon},
            {title: "AFA", url: R.app.stock.afa, icon: CompassIcon},
            {title: "Result Checker", url: R.app.stock.checker, icon: BookOpenIcon},
        ],
    },
    {
        title: "Transactions",
        url: R.app.transactions.index,
        icon: ArrowUpDownIcon,
        color: "bg-amber-500",
        items: txTypes.map(type => ({
            title: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            url: R.app.transactions.types[type],
            icon: ArrowUpDownIcon
        })),
    },
    {
        title: "Users",
        url: R.app.users,
        icon: User2Icon,
        color: "bg-emerald-500",
        items: [],
    },
    {
        // Todo: make APIs route for each API category (e.g. HendyLinks, Skynet)
        // These hold transactions that were pushed through the APIs, and can be useful for monitoring
        // We need to keep track of all transactions pushed through the API
        // We need to fetch APIs and put them here.
        title: "APIs",
        url: R.app.stock.index,
        icon: Package2Icon,
        color: "bg-teal-500",
        items: [
            {title: "HendyLinks", url: R.app.stock.bundles, icon: Package2Icon},
            {title: "Skynet", url: R.app.stock.afa, icon: CompassIcon},
            {title: "Datamart", url: R.app.stock.checker, icon: BookOpenIcon},
        ],
    },
    {
        title: "Messages",
        url: R.app.settings,
        icon: MailsIcon,
        color: "bg-yellow-800",
        items: [],
    },
    {
        title: "Settings",
        url: R.app.settings,
        icon: ShieldIcon,
        color: "bg-slate-500",
        items: [],
    },
];

const utilButtons = [
    {title: "Commissions", url: R.app.commissions.index, icon: CoinsIcon, color: "bg-orange-500"},
];

// ─── Sub-item row ─────────────────────────────────────────────────────────────

const SubItemRow: React.FC<{ item: SubItem; onNavigate: () => void }> = ({item, onNavigate}) => {
    const location = useLocation();
    const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
    const Icon = item.icon;

    return (
        <Link
            to={item.url}
            onClick={onNavigate}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
        >
            <Icon className="size-3.5 shrink-0"/>
            <span>{item.title}</span>
        </Link>
    );
};

// ─── Nav item row ─────────────────────────────────────────────────────────────

const NavItemRow: React.FC<{ item: NavItem; onNavigate: () => void }> = ({item, onNavigate}) => {
    const location = useLocation();
    const Icon = item.icon;

    const isChildActive = item.items.some(
        (s) => location.pathname === s.url || location.pathname.startsWith(s.url + "/")
    );

    const [open, setOpen] = useState(isChildActive);

    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    "w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                    isChildActive
                        ? "text-sidebar-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
            >
                <div
                    className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-white", item.color)}>
                    <Icon className="size-4"/>
                </div>
                <span className="flex-1 text-left truncate">{item.title}</span>
                <ChevronDownIcon
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
                />
            </button>

            {open && (
                <div className="ml-5 mt-0.5 border-l border-sidebar-border pl-3 space-y-0.5">
                    {item.items.map((sub) => (
                        <SubItemRow key={sub.url} item={sub} onNavigate={onNavigate}/>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Util button row ──────────────────────────────────────────────────────────

const UtilButtonRow: React.FC<{ item: typeof utilButtons[number]; onNavigate: () => void }> = ({item, onNavigate}) => {
    const location = useLocation();
    const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
    const Icon = item.icon;

    return (
        <Link
            to={item.url}
            onClick={onNavigate}
            className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
        >
            <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-white", item.color)}>
                <Icon className="size-4"/>
            </div>
            <span className="truncate">{item.title}</span>
        </Link>
    );
};

// ─── Main sidebar ─────────────────────────────────────────────────────────────

const AppSidebarNew: React.FC = () => {
    const navigate = useNavigate();
    const {user, profile} = useAppStore();
    const {setTheme} = useTheme();
    const {open, setOpen, isMobile, openMobile, setOpenMobile} = useSidebar();

    const isOpen = isMobile ? openMobile : open;
    const close = () => isMobile ? setOpenMobile(false) : setOpen(false);

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]?.toUpperCase() ?? "").join("").slice(0, 2);

    return (
        <>
            {/* Backdrop (mobile) */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300",
                    "md:relative md:translate-x-0 md:z-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer shrink-0"
                    onClick={() => {
                        navigate(R.app.index);
                        close();
                    }}
                >
                    <img src="/favicon.ico" alt="logo" className="size-8"/>
                    <div className="grid text-left text-sm leading-tight">
                        <span className="font-semibold text-wondamart dark:text-blue-400">Wondamart</span>
                        <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                </div>

                {/* User pill */}
                <button
                    onClick={() => {
                        navigate(R.app.dashboard);
                        close();
                    }}
                    className="mx-3 mb-2 flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors"
                >
                    <Avatar className="size-8 rounded-lg shrink-0">
                        <AvatarImage src={user?.photoURL ?? ""} alt="User"/>
                        <AvatarFallback className="rounded-lg ring-2 ring-primary text-xs">
                            {profile?.firstName ? getInitials(`${profile.firstName} ${profile.lastName ?? ""}`) :
                                <User2Icon className="size-4"/>}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{profile?.firstName} {profile?.lastName}</span>
                        <span className="truncate text-xs text-muted-foreground">{profile?.email}</span>
                    </div>
                </button>

                <div className="mx-3 h-px bg-sidebar-border mb-2"/>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
                    {/* Util buttons (no sub-items) */}
                    {utilButtons.map((btn) => (
                        <UtilButtonRow key={btn.url} item={btn} onNavigate={close}/>
                    ))}

                    <div className="h-px bg-sidebar-border my-2"/>

                    {/* Main nav items */}
                    {navItems.map((item) => (
                        <NavItemRow key={item.url + item.title} item={item} onNavigate={close}/>
                    ))}
                </nav>

                {/* Footer */}
                <div className="mx-3 mb-3 space-y-1.5 shrink-0">
                    <div className="h-px bg-sidebar-border"/>

                    {/* Theme toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
                            <div
                                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white">
                                <Sun className="size-4 dark:hidden"/>
                                <Moon className="size-4 hidden dark:inline-block"/>
                            </div>
                            <span className="truncate">Theme</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </>
    );
};

export default AppSidebarNew;
