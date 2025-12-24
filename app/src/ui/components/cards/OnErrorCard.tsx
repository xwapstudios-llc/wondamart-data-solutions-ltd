import React from "react";
import {cn} from "@/cn/lib/utils";
import {useAppStore} from "@/lib/useAppStore.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {TriangleAlertIcon, XIcon} from "lucide-react";

type OnErrorCardProps = React.HTMLAttributes<HTMLDivElement>;

const OnErrorCard: React.FC<OnErrorCardProps> = ({className, ...props}) => {
    const {error, clearError} = useAppStore();

    if (error === null) {
        return null;
    }

    return (
        <div
            className={"fixed z-50 top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-background/55 backdrop-blur-xs"}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className={cn(
                "bg-primary/50 backdrop-blur-2xl text-primary-foreground p-4 rounded-md relative",
                "flex flex-col items-center justify-center gap-4",
                "min-w-96 md:min-w-lg min-h-64",
                className
            )}
                 {...props}
            >
                <Button variant={"outline"} className={"absolute top-4 right-4"} onClick={clearError}><XIcon /></Button>
                {
                    typeof error === "string" ? (
                        <>
                            <TriangleAlertIcon strokeWidth={1.2} className={"size-24"} />
                            {error}
                            <p className={"text-center text-lg"}>{error}</p>
                        </>
                    ) : error && typeof error === "object" ? (
                        <>
                            {
                                error.Icon ? (
                                    <error.Icon strokeWidth={1.2} className={"size-24"} />
                                ) : (
                                    <TriangleAlertIcon strokeWidth={1.2} className={"size-24"} />
                                )
                            }
                            <h3 className={"font-semibold text-2xl"}>
                                {
                                    error.title ? error.title : "Error"
                                }
                            </h3>

                            {
                                error.description && (
                                    <p className={"text-center text-lg"}>{error.description}</p>
                                )
                            }

                            {
                                error.actions && (
                                    <div className={"flex items-center justify-center w-full"}>
                                        {
                                            error.actions.map((action, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => {
                                                        action.action();
                                                        clearError();
                                                    }}
                                                >
                                                    {action.label}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </>
                    ) : null
                }
            </div>
        </div>
    )
}

export default OnErrorCard;