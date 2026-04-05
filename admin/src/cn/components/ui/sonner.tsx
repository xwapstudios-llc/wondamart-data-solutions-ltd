import {CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon,} from "lucide-react"
import {useTheme} from "next-themes"
import {Toaster as Sonner, type ToasterProps} from "sonner"
import React from "react";

const Toaster = ({...props}: ToasterProps) => {
    const {theme = "system"} = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            position={"top-right"}
            richColors
            icons={{
                success: <CircleCheckIcon strokeWidth={1.5} className="size-4 text-green-500"/>,
                info: <InfoIcon strokeWidth={1.5} className="size-4 text-primary"/>,
                warning: <TriangleAlertIcon strokeWidth={1.5} className="size-4 text-warning"/>,
                error: <OctagonXIcon strokeWidth={1.5} className="size-4 text-destructive"/>,
                loading: <Loader2Icon strokeWidth={1.5} className="size-4 animate-spin text-primary"/>,
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--border-radius": "var(--radius-2xl)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export {Toaster}
