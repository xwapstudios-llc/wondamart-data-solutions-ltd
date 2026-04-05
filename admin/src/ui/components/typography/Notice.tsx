import {cn} from "@/cn/lib/utils";
import React from "react";

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
                "p-4 border rounded-md space-y-1",
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
            {title ? (
                <span className={"font-semibold mr-2"}>{title}:</span>
            ) : null}
            {children}
        </li>
    );
};

interface NoticeData {
    heading: string;
    variant?: "default" | "warning" | "info";
    notices: {
        title?: string;
        description: React.ReactNode;
    }[];
}

interface NoticeConstructorProps extends React.HTMLAttributes<HTMLDivElement> {
    notice: NoticeData;
}

const NoticeConstructor: React.FC<NoticeConstructorProps> = ({
                                                                 notice,
                                                                 children,
                                                                 ...props
                                                             }) => {
    return (
        <Notice variant={notice.variant} {...props}>
            <NoticeHeading>{notice.heading}</NoticeHeading>
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
        </Notice>
    );
};
export {Notice, NoticeHeading, NoticeContent, NoticeItem, NoticeConstructor, type NoticeData};
