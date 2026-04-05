import React from "react";
import {cn} from "@/cn/lib/utils";
import {CheckCircle2Icon, XCircleIcon} from "lucide-react";

interface TextIconInStockProps extends React.HTMLAttributes<HTMLDivElement> {
    inStock: boolean;
}

const TextIconInStock: React.FC<TextIconInStockProps> = ({inStock, className, children, ...props}) => {
    return (
        <div className={cn(className, "flex gap-2 p-1 rounded-md pr-2 items-center")} {...props}>
            {
                inStock ? (
                    <CheckCircle2Icon className={cn("w-7 h-7 inline-block p-1 rounded-full bg-green-600")} />
                ) : (
                    <XCircleIcon className={cn("w-7 h-7 inline-block p-1 rounded-full bg-red-600")} />
                )
            }
            <div className={"flex gap-0.5 items-center flex-col w-max"}>
                <span>{children}</span>
                <span className={"text-[9px] leading-2"}>{inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
        </div>
    )
}

export default TextIconInStock;