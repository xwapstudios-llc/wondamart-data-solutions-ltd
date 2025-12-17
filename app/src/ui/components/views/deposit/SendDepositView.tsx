import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import SendDepositForm from "@/ui/forms/deposit/SendDepositForm.tsx";
import Code from "@/ui/components/typography/Code.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {CopyIcon} from "lucide-react";
import {Notice, NoticeContent, NoticeHeading, NoticeItem,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";

interface SendDepositViewProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
}

const SendDepositView: React.FC<SendDepositViewProps> = ({
                                                             className,
                                                             children,
                                                             disabled,
                                                             ...props
                                                         }) => {
    return (
        <div className={cn(className, "space-y-4")} {...props}>
            <Notice>
                <NoticeHeading>Notice</NoticeHeading>
                <NoticeContent>
                    Transaction cost is <Code>0.0%</Code>. With the exception of
                    normal MoMo transaction cost.
                </NoticeContent>
            </Notice>
            {disabled ? (
                <>
                    <DisabledNotice title="Send Deposit Unavailable">
                        Send deposits are currently unavailable. Please come
                        back later or contact administrator.
                    </DisabledNotice>
                </>
            ) : (
                <>
                    <Notice>
                        <NoticeHeading>Instructions</NoticeHeading>
                        <NoticeContent listStyle={"decimal"}>
                            <NoticeItem>Copy the number below.</NoticeItem>
                            <div
                                className={
                                    "flex items-center justify-between gap-2 border rounded-xl bg-secondary/25 p-1 pl-4 max-w-md"
                                }
                            >
                                <span className={"text-lg font-medium"}>
                                    0595113729
                                </span>
                                <Button
                                    size={"icon-sm"}
                                    variant={"outline"}
                                    onClick={() => {
                                        // Copy number and notify copied
                                    }}
                                >
                                    <CopyIcon/>
                                </Button>
                            </div>
                            <NoticeItem>
                                Send Money to the number copied. Agent Name:{" "}
                                <Code>Wondabrain Technologies Ltd.</Code>
                            </NoticeItem>
                            <NoticeItem>
                                After confirming the transaction, copy the
                                transaction id <Code>(eg. 0123456789)</Code>{" "}
                                from the message received.
                            </NoticeItem>
                            <NoticeItem>
                                Paste the copied transaction id in the field
                                below and click <Code>Redeem</Code> to have the
                                money deposited into your account.
                            </NoticeItem>
                        </NoticeContent>
                    </Notice>

                    <SendDepositForm className={"mt-8 max-w-2xl mx-auto"}/>
                </>
            )}

            {children}
        </div>
    );
};

export default SendDepositView;
