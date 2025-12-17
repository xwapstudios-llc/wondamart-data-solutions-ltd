import React from "react";
import {CircleQuestionMarkIcon, BellIcon, CheckCircleIcon, XCircleIcon} from "lucide-react";

type NotificationCardType = "normal" | "success" | "warning" | "danger";

interface NotificationCardProps {
    text: string
    type?: NotificationCardType
}

const NotificationCard: React.FC<NotificationCardProps> = ({text, type = "normal"}) => {
    let notificationColor = "text-primary";
    let Icon = BellIcon;

    if (type === "success") {
        notificationColor = "text-green-500"
        Icon = CheckCircleIcon
    } else if (type === "warning") {
        notificationColor = "text-orange-500"
        Icon = CircleQuestionMarkIcon;
    } else if (type === "danger") {
        notificationColor = "text-red-500"
        Icon = XCircleIcon;
    }

    return (
        <div className={"flex gap-4 p-4 border rounded-md items-center"}>
            <div className={`${notificationColor} rounded-full w-10 h-10 basis-10 flex items-center justify-center`}>
                <Icon/>
            </div>
            <div className={"grow"}>
                <p>This is a {text} notification.</p>
            </div>
        </div>
    )
}

export default NotificationCard;