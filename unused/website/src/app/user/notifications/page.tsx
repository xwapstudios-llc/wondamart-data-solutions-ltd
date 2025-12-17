import React from "react";
import NotificationCard from "@/ui/components/NotificationCard";


const UserNotification: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">System alerts and updates appear here.</p>

            <div className="flex flex-col gap-4 mt-8">
                <NotificationCard text={"Normal"} type={"normal"} />
                <NotificationCard text={"Success"} type={"success"} />
                <NotificationCard text={"Warning"} type={"warning"} />
                <NotificationCard text={"Danger"} type={"danger"} />
            </div>
        </div>
    )
}

export default UserNotification;