import React from "react";
import type {UserInfoDocument} from "@common/types/user.ts";
import {cn} from "@/cn/lib/utils.ts";
import {Label} from "@/cn/components/ui/label.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Timestamp} from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import R from "@/routes.ts";

const UserField: React.FC<{ label: string, value: React.ReactNode }> = ({label, value}) => {
    return (
        <div className={"flex gap-2"}>
            <Label>{label}</Label>
            <p className={"text-foreground/90 break-words"}>{value}</p>
        </div>
    )
}


interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    name?: string;
    size?: number;
}
const Avatar: React.FC<AvatarProps> = ({ src, name, size = 64, className, children, ...props }) => {
    const initials = (name || "").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div
            className={cn(className, "flex items-center justify-center rounded-full bg-muted overflow-hidden")}
            style={{width: size, height: size}}
            {...props}
        >
            {src ? (
                <img src={src} alt={name || "avatar"} style={{width: size, height: size, objectFit: 'cover'}}/>
            ) : (
                <span className={"text-lg font-medium text-foreground/80"}>{initials || "U"}{children}</span>
            )}
        </div>
    );
}

interface UserViewCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserInfoDocument
    photoURL?: string; // optional image URL (if available from Firebase Auth or caller)
    detailed?: boolean;
}
const UserViewCard: React.FC<UserViewCardProps> = ({className, user, photoURL, detailed = false, ...props}) => {
    const navigate = useNavigate();
    // try to use firebase auth user photoURL as a sensible default if caller didn't provide one
    const authUser = useAppStore((s) => s.user);
    const resolvedPhoto = photoURL || (authUser && authUser.uid === user.id ? authUser.photoURL ?? undefined : undefined);

    const format = (ts: Timestamp) => {
        try {
            return ts?.toDate().toLocaleString();
        } catch {
            return "N/A";
        }
    }

    return (
        <div
            onClick={() => {
                navigate(R.user(user.id));
            }}
            className={cn("p-4 bg-card border rounded-lg shadow-sm cursor-pointer space-y-2", className)}
            {...props}
        >
            <div className={"flex gap-4 items-center"}>
                <Avatar
                    className={`${user.role != "user" && "ring-4 ring-offset-2"} ${user.role === "admin" ? "ring-primary ring-offset-blue-200" : ""} ${user.role === "manager" ? "ring-green-500 ring-offset-green-200" : ""}`}
                    src={resolvedPhoto}
                    name={`${user.firstName} ${user.lastName ?? ''}`}
                    size={64}
                />
                <div>
                    <h3 className={"text-lg font-semibold"}>{user.firstName} {user.lastName ?? ''}</h3>
                    <p className={"text-sm font-medium text-muted-foreground"}>{user.email}</p>
                    <div className={"text-sm text-muted-foreground flex gap-2"}>
                        {user.phoneNumber || "N/A"}
                    </div>
                </div>
            </div>

            <div>
                <UserField label={"Joined"} value={format(user.createdAt)}/>
                <UserField label={"ID"} value={user.id}/>
                {
                    detailed && (
                        <div className={"text-sm"}>
                            <UserField label={"Referral Code"} value={user.referralCode || "-"}/>
                            <UserField label={"Referred By"} value={user.referredBy || "N/A"}/>
                            <UserField label={"Names Updated"} value={format(user.namesUpdatedAt)}/>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default UserViewCard;

