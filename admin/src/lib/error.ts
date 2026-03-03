import type {LucideIcon} from "lucide-react";
import type {ButtonVariant} from "@/cn/components/ui/button.tsx";
import type {HTTPResponse} from "@common/types/request.ts";
import {getHTTPResponseIcon} from "@/lib/getHTTPResponseIcon.ts";
import {useAppStore} from "@/lib/useAppStore.ts";

interface ErrorAction {
    label: string;
    variant?: ButtonVariant;
    action: () => void;
}
interface AppDetailedError {
    title?: string;
    description?: string;
    Icon?: LucideIcon;
    actions?: Array<ErrorAction>;
    hideCloseButton?: boolean;
}

export type AppError = string | null | AppDetailedError;

export function prepareHTTPResponse(response: HTTPResponse): AppError {
    const Icon = getHTTPResponseIcon(response.status);
    if (typeof response.message == "string") {
        return {
            Icon: Icon,
            description: response.message,
            actions: [{
                label: "OK",
                action: () => useAppStore.getState().setError(null)
            }],
            hideCloseButton: true,
        }
    } else if (typeof response.message == "object") {
        return {
            Icon: Icon,
            title: response.message.title,
            description: response.message.message,
            actions: [{
                label: "OK",
                action: () => useAppStore.getState().setError(null)
            }],
            hideCloseButton: true,
        }
    } else return {
        Icon: Icon,
        title: "Error",
        description: "An error occurred.",
    }
}