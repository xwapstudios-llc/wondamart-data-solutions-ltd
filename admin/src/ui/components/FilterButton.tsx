import React, {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/cn/components/ui/dropdown-menu";
import {cn} from "@/cn/lib/utils";
import {buttonVariants} from "@/cn/components/ui/button";
import {ChevronDown} from "lucide-react";

interface FilterButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    onValueChange?: (value: string) => void;
    values: { label: string, value: string }[];
    defaultIndex: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({className, values, defaultIndex, onValueChange, ...props}) => {
    const [selected, setSelected] = useState<{ label: string, value: string }>(values[defaultIndex]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({variant: "outline"}), "border-secondary", className)} {...props} >
                {selected.label}<ChevronDown/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                    values.map((item) => (
                        <DropdownMenuItem
                            key={item.value}
                            onClick={() => {
                                setSelected(item);
                                if (onValueChange) onValueChange(item.value);
                            }}
                            className={cn(
                                item.value === selected?.value && "bg-accent text-accent-foreground"
                            )}
                        >
                            {item.label}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterButton;