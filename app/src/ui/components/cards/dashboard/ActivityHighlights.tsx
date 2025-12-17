import React from "react";
import {cn} from "@/cn/lib/utils";
import ActivityHighlightCard from "@/ui/components/cards/dashboard/ActivityHighlightCard.tsx";
import {getTxIcon} from "@/lib/icons.ts";
import {HandCoinsIcon} from "lucide-react";

type ActivityHighlightsProps = React.HTMLAttributes<HTMLDivElement>

const ActivityHighlights: React.FC<ActivityHighlightsProps> = ({className, ...props}) => {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            <ActivityHighlightCard
                title={"Data Sales"}
                className={"w-full max-w-2xl"}
            />
            <div className={"flex gap-2 overflow-x-auto"}>
                <ActivityHighlightCard
                    Icon={HandCoinsIcon}
                    title={"Commissions"}
                />
                <ActivityHighlightCard
                    Icon={getTxIcon["data-bundle"]}
                    title={"Bundle GB"}
                />
                <ActivityHighlightCard
                    Icon={getTxIcon["tx"]}
                    title={"Transactions"}
                />
                <ActivityHighlightCard
                    Icon={getTxIcon["afa-bundle"]}
                    title={"AFA Bundle"}
                />
                <ActivityHighlightCard
                    Icon={getTxIcon["result-checker"]}
                    title={"Result Checker"}
                />
            </div>
        </div>
    )
}

export default ActivityHighlights;