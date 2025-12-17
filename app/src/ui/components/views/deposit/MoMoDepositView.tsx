import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import Code from "@/ui/components/typography/Code.tsx";
import MoMoDepositForm from "@/ui/forms/deposit/MoMoDepositForm.tsx";
import {Notice, NoticeContent, NoticeHeading, NoticeItem,} from "@/ui/components/typography/Notice";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";

interface MoMoDepositViewProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
}

const MoMoDepositView: React.FC<MoMoDepositViewProps> = ({
                                                             className,
                                                             children,
                                                             disabled,
                                                             ...props
                                                         }) => {
    return (
        <div className={cn(className, "space-y-4")} {...props}>
            <Notice className={"p-4 border rounded-md bg-secondary/25"}>
                <NoticeHeading>Notice</NoticeHeading>
                <NoticeContent>
                    <NoticeItem>
                        This method is just like making a withdrawal from a MoMo
                        Agent.
                    </NoticeItem>
                    <NoticeItem title="Cost">
                        Transaction cost <Code>0.0%</Code>. With the exception
                        of normal MoMo withdrawal cost.
                    </NoticeItem>
                </NoticeContent>
            </Notice>

            {disabled ? (
                <DisabledNotice title="MoMo Deposit Unavailable">
                    MoMo deposits are currently unavailable. Please come back
                    later or contact administrator for more information.
                </DisabledNotice>
            ) : (
                <>
                    <div
                        className={
                            "p-4 border border-destructive rounded-md bg-secondary/25"
                        }
                    >
                        <h3 className={"font-semibold text-destructive"}>Warning</h3>
                        <Code>MTN ONLY</Code>
                    </div>

                    <Notice>
                        <NoticeHeading>Instructions</NoticeHeading>
                        <NoticeContent listStyle={"decimal"}>
                            <NoticeItem>Allow cash out on your phone.</NoticeItem>
                            <NoticeItem>
                                Input phone number and amount below. Then "Deposit".
                            </NoticeItem>
                            <NoticeItem>
                                Confirm the withdrawal prompt on your phone. Agent Name:{" "}
                                <Code>Wondabrain Technologies Ltd.</Code>
                            </NoticeItem>
                            <NoticeItem>
                                Money is deposited into your account.
                            </NoticeItem>
                        </NoticeContent>
                    </Notice>
                    <MoMoDepositForm className={"mt-8 max-w-2xl mx-auto"}/>
                </>
            )}
            {children}
        </div>
    );
};

export default MoMoDepositView;
