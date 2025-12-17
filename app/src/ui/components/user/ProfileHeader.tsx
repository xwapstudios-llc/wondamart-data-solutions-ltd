import React from "react";
import {cn} from "@/cn/lib/utils";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/cn/components/ui/avatar.tsx";


interface ProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    something: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({something, className, children, ...props}) => {
    return (
        <div className={cn(
            "p-6 pb-2",
            className
        )}
             {...props}
        >
            {children}

            <div className="flex items-center gap-4 mb-6">
                <ChevronLeft className="w-6 h-6 cursor-pointer" />
                <h1 className="text-xl font-bold flex-1 text-center mr-6">Settings</h1>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 dark:bg-zinc-900 border border-orange-100/20">
                <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white dark:border-zinc-800">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-lg">Jennifer Smith</h2>
                        <p className="text-xs text-muted-foreground">+7 893 22 01 77</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
        </div>
    )
}

export default ProfileHeader;

