import React from "react";
import {Notice, NoticeContent, NoticeHeading} from "@/ui/components/typography/Notice";
import {cn} from "@/cn/lib/utils";
import WondaButton from "../buttons/WondaButton";
import {TriangleAlertIcon} from "lucide-react";

interface DisabledNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

const DisabledNotice: React.FC<DisabledNoticeProps> = ({
                                                           children = "This feature is currently disabled.",
                                                           className,
                                                           title
                                                       }) => {
    return (
        <Notice variant={"warning"} className={cn("flex items-center justify-center flex-col gap-2", className)}
                role={"alert"}>
            <WondaButton size={144} color="var(--color-warning-foreground)">
                <TriangleAlertIcon size={80} color="var(--color-warning)"/>
            </WondaButton>
            {title && <NoticeHeading>{title}</NoticeHeading>}
            <NoticeContent>
                {children}
            </NoticeContent>
        </Notice>
    );
};

export default DisabledNotice;