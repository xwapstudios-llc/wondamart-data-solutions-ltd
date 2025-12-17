import React from "react";
import {Loader2Icon} from "lucide-react";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";

const LoadingView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, children, ...props}) => {
    return (
        <Skeleton className={`w-full h-full flex items-center justify-center gap-4 rounded-lg ${className}`} {...props}>
            <Loader2Icon size={72} className={"animate-spin text-primary"}/>
            {children}
        </Skeleton>
    )
}


export default LoadingView;