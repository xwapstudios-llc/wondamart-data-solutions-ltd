import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/cn/lib/utils.ts";
import { useAppStore } from "@/lib/useAppStore.ts";
import { useTheme } from "@/cn/components/theme/theme-provider.tsx";
import { R } from "@/app/routes.ts";
import { useSidebar } from "@/cn/components/ui/sidebar.tsx";
import {
    ArrowUpDownIcon,
    BookOpenIcon,
    ChevronDownIcon,
    CoinsIcon,
    CompassIcon,
    DollarSignIcon,
    HelpCircleIcon,
    InfoIcon,
    Moon,
    Package2Icon,
    ScrollTextIcon,
    ShieldIcon,
    SquareTerminalIcon,
    Sun,
    User2Icon,
    UserCheckIcon,
    UserPlus2Icon,
    type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/cn/components/ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/cn/components/ui/dropdown-menu.tsx";

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
        title: "Purchase",
        url: R.app.purchase.index,
        icon: SquareTerminalIcon,
        color: "bg-violet-500",
        items: [
            { title: "Data Bundles", url: R.app.purchase.dataBundle.index, icon: Package2Icon },
            { title: "AFA Bundles",  url: R.app.purchase.afaBundle,        icon: CompassIcon },
            { title: "Result Checkers", url: R.app.purchase.resultChecker, icon: BookOpenIcon },
        ],
    },
    {
        title: "Data Bundles",
        url: R.app.purchase.dataBundle.index,
        icon: ArrowUpDownIcon,
        color: "bg-sky-500",
        items: [
            { title: "MTN",        url: R.app.purchase.dataBundle.mtn,       icon: Package2Icon },
            { title: "Telecel",    url: R.app.purchase.dataBundle.telecel,   icon: Package2Icon },
            { title: "AirtelTigo", url: R.app.purchase.dataBundle.airtelTigo, icon: Package2Icon },
        ],
    },
    {
        title: "History",
        url: R.app.history.index,
        icon: ArrowUpDownIcon,
        color: "bg-amber-500",
        items: [
            { title: "Purchases",       url: R.app.history.purchases.index,       icon: SquareTerminalIcon },
            { title: "Deposits",        url: R.app.history.deposits,              icon: DollarSignIcon },
            { title: "Data Bundles",    url: R.app.history.purchases.dataBundles, icon: Package2Icon },
            { title: "AFA Bundles",     url: R.app.history.purchases.afaBundles,  icon: CompassIcon },
            { title: "Result Checkers", url: R.app.history.purchases.resultCheckers, icon: BookOpenIcon },
        ],
    },
    {
        title: "User",
        url: R.app.user.index,
        icon: User2Icon,
        color: "bg-emerald-500",
        items: [
            { title: "Profile",                  url: R.app.user.profile,           icon: User2Icon },
            { title: "General",                  url: R.app.user.settings.general,  icon: ShieldIcon },
            { title: "Security",                 url: R.app.user.settings.security, icon: ShieldIcon },
            { title: "Activation & Verification", url: R.app.user.activate,         icon: UserCheckIcon },
        ],
    },
    {
        title: "Legal & Info",
        url: R.app.about,
        icon: InfoIcon,
        color: "bg-rose-500",
        items: [
            { title: "Terms & Conditions", url: R.app.termsAndConditions, icon: ScrollTextIcon },
            { title: "Help",               url: R.app.help,               icon: HelpCircleIcon },
            { title: "About",              url: R.app.about,              icon: InfoIcon },
            { title: "FAQ",                url: R.app.faq,                icon: HelpCircleIcon },
        ],
    },
];

const utilButtons = [
    { title: "Register Agent", url: R.app.registerAgent, icon: UserPlus2Icon, color: "bg-indigo-500" },
    { title: "Commissions",    url: R.app.commissions.index, icon: CoinsIcon,  color: "bg-orange-500" },
];

// ─── Sub-item row ─────────────────────────────────────────────────────────────

const SubItemRow: React.FC<{ item: SubItem; onNavigate: () => void }> = ({ item, onNavigate }) => {
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
            <Icon className="size-3.5 shrink-0" />
            <span>{item.title}</span>
        </Link>
    );
};

// ─── Nav item row ─────────────────────────────────────────────────────────────

const NavItemRow: React.FC<{ item: NavItem; onNavigate: () => void }> = ({ item, onNavigate }) => {
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
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-white", item.color)}>
                    <Icon className="size-4" />
                </div>
                <span className="flex-1 text-left truncate">{item.title}</span>
                <ChevronDownIcon
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
                />
            </button>

            {open && (
                <div className="ml-5 mt-0.5 border-l border-sidebar-border pl-3 space-y-0.5">
                    {item.items.map((sub) => (
                        <SubItemRow key={sub.url} item={sub} onNavigate={onNavigate} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Util button row ──────────────────────────────────────────────────────────

const UtilButtonRow: React.FC<{ item: typeof utilButtons[number]; onNavigate: () => void }> = ({ item, onNavigate }) => {
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
                <Icon className="size-4" />
            </div>
            <span className="truncate">{item.title}</span>
        </Link>
    );
};

// ─── Main sidebar ─────────────────────────────────────────────────────────────

const AppSidebarNew: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile } = useAppStore();
    const { setTheme } = useTheme();
    const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();

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
                    onClick={() => { navigate(R.app.index); close(); }}
                >
                    <img src="/favicon.ico" alt="logo" className="size-8" />
                    <div className="grid text-left text-sm leading-tight">
                        <span className="font-semibold text-wondamart dark:text-blue-400">Wondamart</span>
                        <span className="text-xs text-muted-foreground">Agent</span>
                    </div>
                </div>

                {/* User pill */}
                <button
                    onClick={() => { navigate(R.app.user.index); close(); }}
                    className="mx-3 mb-2 flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors"
                >
                    <Avatar className="size-8 rounded-lg shrink-0">
                        <AvatarImage src={user?.photoURL ?? ""} alt="User" />
                        <AvatarFallback className="rounded-lg ring-2 ring-primary text-xs">
                            {profile?.firstName ? getInitials(`${profile.firstName} ${profile.lastName ?? ""}`) : <User2Icon className="size-4" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{profile?.firstName} {profile?.lastName}</span>
                        <span className="truncate text-xs text-muted-foreground">{profile?.email}</span>
                    </div>
                </button>

                <div className="mx-3 h-px bg-sidebar-border mb-2" />

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
                    {/* Util buttons (no sub-items) */}
                    {utilButtons.map((btn) => (
                        <UtilButtonRow key={btn.url} item={btn} onNavigate={close} />
                    ))}

                    <div className="h-px bg-sidebar-border my-2" />

                    {/* Main nav items */}
                    {navItems.map((item) => (
                        <NavItemRow key={item.url + item.title} item={item} onNavigate={close} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="mx-3 mb-3 space-y-1.5 shrink-0">
                    <div className="h-px bg-sidebar-border" />

                    {/* Theme toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white">
                                <Sun className="size-4 dark:hidden" />
                                <Moon className="size-4 hidden dark:inline-block" />
                            </div>
                            <span className="truncate">Theme</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Deposit CTA */}
                    <button
                        onClick={() => { navigate(R.app.deposit); close(); }}
                        className="w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/20">
                            <DollarSignIcon className="size-4" />
                        </div>
                        <span className="font-medium">Deposit</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AppSidebarNew;
