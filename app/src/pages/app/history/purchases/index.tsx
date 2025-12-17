import React from 'react';
import {NoticeConstructor, type NoticeData,} from "@/ui/components/typography/Notice";
import {buttonVariants} from "@/cn/components/ui/button";
import {Link} from "react-router-dom";
import {cn} from "@/cn/lib/utils";

const notice: NoticeData = {
    heading: "Important: Delivery Notice",
    variant: "info",
    notices: [
        {
            description:
                "Sometimes, there may be validation issues delays from (MTN) portal during data delivery. While this is usually temporary, it can cause delays.",
        },
        {
            description:
                'If your order shows as "Delivered" but you haven\'t received your data yet, please wait approximately 30 minutes for validation to complete the process of your delivery.',
        },
        {
            description:
                "After waiting 30 minutes, if you still haven't received your data, please contact us.",
        },
    ],
};

const HistoryPurchases: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Purchase History</h1>
            <p className="text-sm text-muted-foreground">All purchases listed here.</p>

            <NoticeConstructor className={"mt-4"} notice={notice}>
                <Link about="_blank" to={"https://wa.me/+233539971202"}
                      className={cn(buttonVariants({size: "sm", variant: "outline"}), "mt-2")}>
                    Contact Support
                </Link>
                <p>We'll sort out your issue promptly!</p>
            </NoticeConstructor>
        </div>
    );
};

export default HistoryPurchases;

