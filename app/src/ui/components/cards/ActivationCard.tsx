import React from "react";
import {cn} from "@/cn/lib/utils";
import {type LucideIcon} from "lucide-react";
import {Button} from "@/cn/components/ui/button.tsx";

interface ActivationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    cta: {
        label: React.ReactNode;
        action?: () => void;
    };
    Icon: LucideIcon;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const ActivationCard: React.FC<ActivationCardProps> = ({
                                                           cta,
                                                           title,
                                                           Icon,
                                                           size = "xl",
                                                           className,
                                                           children,
                                                           ...props
                                                       }) => {
    const sizeClassNames = {
        xs: "w-58 h-48",
        sm: "w-64 h-56",
        md: "w-72 h-64",
        lg: "w-80 h-72",
        xl: "w-96 h-80",
    }
    const iconSize = {
        xs: 96,
        sm: 96,
        md: 96,
        lg: 96,
        xl: 96,
    }

    return (
        <div className={cn(
            sizeClassNames[size],
            "rounded-md p-4 bg-primary text-primary-foreground flex flex-col justify-between",
            className
        )}
             {...props}
        >
            <div className={"space-y-2"}>
                <Icon size={iconSize[size]} strokeWidth={1}/>
                <h4 className={"text-4xl font-semibold"}>{title}</h4>
            </div>
            <div className={"space-y-2"}>
                <div>{children}</div>
                <Button
                    size={"lg"}
                    variant={"outline"}
                    disabled={!cta.action}
                    onClick={cta.action}
                    className={"w-full text-xl"}
                >
                    {cta.label}
                </Button>
            </div>
        </div>
    )
}

export default ActivationCard;