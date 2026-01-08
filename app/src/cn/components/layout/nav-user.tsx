import {Bell, ChevronsUpDown, LockIcon, LogOut, ShieldCheckIcon, User2Icon, UserPenIcon,} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage,} from "@/cn/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/cn/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/cn/components/ui/sidebar";
import {useAppStore} from "@/lib/useAppStore";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes";


export function NavUser() {
    const {user, profile, logout} = useAppStore();
    const {isMobile} = useSidebar();
    const navigate = useNavigate();

    const getInitials = (name: string) => {
        const names = name.split(" ");
        return names.map(n => n.charAt(0).toUpperCase()).join("").slice(0, 2);
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user?.photoURL || ""}
                                    alt={"User"}
                                />
                                <AvatarFallback className="ring-2 ring-primary">
                                    {
                                        user?.displayName ? getInitials(user.displayName) : <User2Icon className={"text-muted-foreground"}/>
                                    }
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {profile?.firstName} {profile?.lastName}
                                </span>
                                <span className="truncate text-xs">
                                    {profile?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user?.photoURL || ""}
                                        alt={"User"}
                                    />
                                    <AvatarFallback className="ring-2 ring-primary">
                                        {
                                            user?.displayName ? getInitials(user.displayName) : <User2Icon className={"text-muted-foreground"}/>
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {profile?.firstName} {profile?.lastName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {profile?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(R.app.user.activate)}>
                                <ShieldCheckIcon/>
                                Account Activation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(R.app.user.profile)}>
                                <UserPenIcon />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(R.app.user.settings.security)}>
                                <LockIcon/>
                                Security
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(R.app.notifications)}>
                                <Bell/>
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={logout}>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
