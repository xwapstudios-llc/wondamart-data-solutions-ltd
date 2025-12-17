import React from "react";
import {Loader2Icon} from "lucide-react";


const LoadingHistoryCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => {
    return (
        <div className={`flex gap-2 p-2 border rounded-md items-center ${className}`} {...props}>
            <Loader2Icon className={"text-primary animate-spin"}/>
            <div className={"grow space-y-1 flex items-center"}>
                Loading...
            </div>
        </div>
    )
}
export default LoadingHistoryCard;