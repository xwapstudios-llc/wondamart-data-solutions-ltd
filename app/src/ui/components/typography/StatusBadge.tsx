import React from "react";
import {cn} from "@/cn/lib/utils";
import type {TxStatus} from "@common/types/tx.ts";
import {BoxIcon, CheckCircle2Icon, LoaderIcon, XIcon} from "lucide-react";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: TxStatus;
    size?: "sm" | "md" | "lg" | "xl" | "icon";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status, className, size = "sm", ...props}) => {
    const statusColors: Record<TxStatus, string> = {
        processing: "text-yellow-600 bg-yellow-600/25",
        completed: "text-green-600 bg-green-600/25",
        failed: "text-red-600 bg-red-600/25",
        pending: "text-blue-600 bg-blue-600/25",
    };
    const statusIcon: Record<TxStatus, React.ReactNode> = {
        processing: <LoaderIcon className={"text-yellow-600 animate-spin size-4"} />,
        completed: <CheckCircle2Icon className={"text-green-600 size-4"} />,
        failed: <XIcon className={"text-red-600 size-4"} />,
        pending: <BoxIcon className={"text-blue-600 animate-bounce size-4"} />,
    };
    const Icon = statusIcon[status];
    const sizes: Record<typeof size, string> = {
        sm: "p-1 pr-1.5 text-xs",
        md: "px-1.5 py-1 text-sm",
        lg: "px-2 py-1",
        xl: "px-2 py-1 text-md",
        icon: "p-0.5",
    }

    return (
        <span className={cn(
            sizes[size],
            "font-medium rounded-full capitalize inline-flex gap-1 items-center justify-center",
            statusColors[status],
            className
        )}
             {...props}
        >
            {Icon}
            {size != "icon" && status.toLowerCase()}
        </span>
    )
}

export default StatusBadge;