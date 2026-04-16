import {cn} from "@/cn/lib/utils";
import React, {useState} from "react";
import {Button} from "@/cn/components/ui/button.tsx";

interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "warning" | "info";
}

const Notice: React.FC<NoticeProps> = ({
                                           className,
                                           children,
                                           variant = "default",
                                           ...props
                                       }) => {
    const variantClasses = {
        default: "bg-primary dark:bg-primary/75 text-primary-foreground",
        warning: "bg-warning text-warning-foreground/75 border-warning-foreground/50",
        info: "bg-primary text-primary-foreground",
    };
    return (
        <div
            className={cn(
                "p-4 border rounded-md",
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const NoticeHeading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
                                                                               className,
                                                                               children,
                                                                               ...props
                                                                           }) => {
    return (
        <h3 className={cn("font-semibold", className)} {...props}>
            {children}
        </h3>
    );
};

interface NoticeContentProps extends React.HTMLAttributes<HTMLUListElement> {
    listStyle?: "disc" | "circle" | "square" | "georgian" | "decimal" | "lower-alpha" | "lower-latin" | "lower-greek" | "lower-roman" | "none";
}

const NoticeContent: React.FC<NoticeContentProps> = ({
                                                         className,
                                                         children,
                                                         listStyle = "disc",
                                                         ...props
                                                     }) => {
    return (
        <ul
            style={{listStyleType: listStyle}}
            className={cn("text-sm space-y-1 pl-4", className)}
            {...props}
        >
            {children}
        </ul>
    );
};

interface NoticeItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    title?: string;
}

const NoticeItem: React.FC<NoticeItemProps> = ({
                                                   className,
                                                   children,
                                                   title,
                                                   ...props
                                               }) => {
    return (
        <li className={cn(className)} {...props}>
            {title && (
                <span className={"font-semibold mr-2"}>{title}:</span>
            )}
            {children}
        </li>
    );
};

interface NoticeData {
    heading: string;
    subHeading?: string;
    variant?: "default" | "warning" | "info";
    subHeadingClass?: string,
    notices: {
        title?: string;
        description: React.ReactNode;
    }[];
}

interface NoticeConstructorProps extends React.HTMLAttributes<HTMLDivElement> {
    notice: NoticeData;
    collapsable?: boolean;
}

const NoticeConstructor: React.FC<NoticeConstructorProps> = ({
                                                                 notice,
                                                                 collapsable = false,
                                                                 children,
    className,
                                                                 ...props
                                                             }) => {
    const [opened, setOpened] = useState(!collapsable);

    return (
        <Notice variant={notice.variant} className={cn("relative", className)} {...props}>
            <div>
                <p className={"font-semibold text-sm"}>{notice.heading}</p>
                {
                    notice.subHeading && (<span className={`text-xs ${notice.subHeadingClass}`}>{notice.subHeading}</span>)
                }
            </div>
            {
                collapsable && (
                    <Button
                        className={"absolute top-2 right-2"}
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {setOpened(!opened)}}
                    >
                        {opened ? "Hide" : "Show"}
                    </Button>
                )
            }
            {
                (!collapsable || opened) && (
                    <>
                        <NoticeContent>
                            {notice.notices.map((notice, index) => (
                                <NoticeItem
                                    key={index}
                                    title={notice.title}
                                    children={notice.description}
                                />
                            ))}
                        </NoticeContent>
                        {children}
                    </>
                )
            }
        </Notice>
    );
};
export {Notice, NoticeHeading, NoticeContent, NoticeItem, NoticeConstructor, type NoticeData};
