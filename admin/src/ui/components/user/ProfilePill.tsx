import React from "react";
import {cn} from "@/cn/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/cn/components/ui/avatar.tsx";
import {User2Icon} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore.ts";

type ProfilePillProps = React.HTMLAttributes<HTMLDivElement>;

const ProfilePill: React.FC<ProfilePillProps> = ({className, children, ...props}) => {
    const {user} = useAppStore();

    const getInitials = (name: string) => {
        const names = name.split(" ");
        return names.map(n => n.charAt(0).toUpperCase()).join("").slice(0, 2);
    }

    return (
        <div className={cn("flex items-center gap-4 border rounded-full p-2 bg-muted/25", className)} {...props}>
            <Avatar className="size-16">
                <AvatarFallback>
                    {
                        user?.displayName ? getInitials(user.displayName) : <User2Icon className={"text-muted-foreground"}/>
                    }
                </AvatarFallback>
                <AvatarImage src={user?.photoURL ?? ""}/>
            </Avatar>
            <div className="space-y-1">
                <p className="font-medium">
                    {user?.displayName ?? "Name"}
                </p>
                {
                    user && <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                }
            </div>
            {
                children
            }
        </div>
    )
}

export default ProfilePill;