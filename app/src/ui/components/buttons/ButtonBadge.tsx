import {Button} from "@/cn/components/ui/button.tsx";
import {cn} from "@/cn/lib/utils.ts";
import React from "react";

interface ButtonBadgeProps extends React.ComponentProps<typeof Button> {
    badgeContent?: number | string;
    badgeClassName?: string;
}
const ButtonBadge: React.FC<ButtonBadgeProps> = ({
                                                     badgeContent,
                                                     badgeClassName,
                                                     children,
                                                     ...props
}) => {
    return (
        <div className={"relative"}>
            <Button {...props}>{children}</Button>
            {
                badgeContent && (
                    <div
                        className={cn(
                            `absolute -top-1 -right-2 flex items-center justify-center rounded-full w-5 h-5 text-xs font-bold`,
                            badgeClassName,
                            "bg-red-500 text-white"
                        )}>
                        {badgeContent}
                    </div>
                )
            }
        </div>
    )
}

export { ButtonBadge };