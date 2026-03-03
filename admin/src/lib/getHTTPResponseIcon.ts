import {
    CheckCircle2Icon,
    XCircleIcon,
    ShieldAlertIcon,
    LockIcon,
    ClockIcon,
    UserXIcon,
    KeyRoundIcon,
    MailIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    CreditCardIcon,
    TriangleAlertIcon,
    FileWarningIcon,
    BanIcon,
    RotateCcwIcon,
    type LucideIcon
} from "lucide-react";
import type {HTTPResponseStatus} from "@common/types/request.ts";

function getHTTPResponseIcon(status: HTTPResponseStatus): LucideIcon {
    switch (status) {
        case "ok":
            return CheckCircle2Icon;
        case "pending":
            return ClockIcon;
        case "error":
        case "failed":
        case "critical_or_unhandled":
            return XCircleIcon;
        case "rejected":
        case "aborted":
        case "cancelled":
            return RotateCcwIcon;
        case "unauthorized":
        case "unauthenticated":
            return ShieldAlertIcon;
        case "access-denied":
        case "permission-denied":
            return LockIcon;
        case "user-disabled":
            return UserXIcon;
        case "already-exists":
            return BanIcon;
        case "invalid":
        case "invalid-data":
            return FileWarningIcon;
        case "send_otp":
        case "send_pin":
            return KeyRoundIcon;
        case "send_phone":
            return PhoneIcon;
        case "send_email":
            return MailIcon;
        case "send_birthday":
            return CalendarIcon;
        case "send_address":
            return MapPinIcon;
        case "pay_offline":
            return CreditCardIcon;
        default:
            return TriangleAlertIcon;
    }
}

export { getHTTPResponseIcon };