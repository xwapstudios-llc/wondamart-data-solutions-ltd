import {BadgeCheck, Bell, ChevronsUpDown, LockIcon, LogOut, Sparkles, User2Icon,} from "lucide-react";

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
                                    <User2Icon/>
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
                                        <User2Icon/>
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
                                <Sparkles/>
                                Account Activation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(R.app.user.settings.account)}>
                                <BadgeCheck/>
                                Account
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
