import {User2Icon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage,} from "@/cn/components/ui/avatar";
import {SidebarMenuButton} from "@/cn/components/ui/sidebar";
import {useAppStore} from "@/lib/useAppStore";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes";


export function NavUser() {
    const {user, profile} = useAppStore();
    const navigate = useNavigate();

    const getInitials = (name: string) => {
        const names = name.split(" ");
        return names.map(n => n.charAt(0).toUpperCase()).join("").slice(0, 2);
    }

    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            onClick={() => navigate(R.app.user.index)}
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
                <span className="truncate text-xs text-muted-foreground">
                                    {profile?.email}
                                </span>
            </div>
        </SidebarMenuButton>
    );
}
