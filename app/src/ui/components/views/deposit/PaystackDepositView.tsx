import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import PaystackDepositForm from "@/ui/forms/deposit/PaystackDepositForm.tsx";
import Code from "@/ui/components/typography/Code.tsx";
import {Notice, NoticeContent, NoticeHeading, NoticeItem,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";

interface PaystackDepositViewProps
    extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
}

const PaystackDepositView: React.FC<PaystackDepositViewProps> = ({
                                                                     className,
                                                                     children,
                                                                     disabled,
                                                                     ...props
                                                                 }) => {
    return (
        <div className={cn(className, "space-y-4")} {...props}>
            <Notice>
                <NoticeHeading className={"font-semibold"}>
                    Notice
                </NoticeHeading>
                <NoticeContent>
                    <NoticeItem title={"Cost"}>
                        Transaction cost using this deposit method is{" "}
                        <Code>0.5%</Code> of the stated amount
                    </NoticeItem>
                </NoticeContent>
            </Notice>
            {children}
            {disabled ? (
                <DisabledNotice title="Paystack Deposit Unavailable">
                    Paystack deposits are currently unavailable. Please come
                    back later or contact administrator.
                </DisabledNotice>
            ) : (
                <PaystackDepositForm className={"max-w-2xl mx-auto"}/>
            )}
        </div>
    );
};

export default PaystackDepositView;
