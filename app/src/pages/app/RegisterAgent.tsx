import React from "react";
import Page from "@/ui/page/Page";
import PageHeading from "@/ui/page/PageHeading";
import PageSubHeading from "@/ui/page/PageSubHeading";
import RegisterForm, {type RegisterValues} from "@/ui/forms/register-form";
import {ClUser as ClientUserAPI} from "@common/client-api/user";
import {Notice, NoticeContent, NoticeHeading, NoticeItem} from "@/ui/components/typography/Notice";
import Code from "@/ui/components/typography/Code";
import {Loader2Icon} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";

const RegisterAgent: React.FC = () => {
    const {setError, commonSettings} = useAppStore();
    const settings = commonSettings.userRegistration;


    const onSubmit = async (values: RegisterValues) => {
        try {
            await ClientUserAPI.registerAgent({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                referredBy: values.referredBy,
            });
        } catch (e) {
            console.error("Error registering agent:", e);
            setError(e as string);
        }
    }

    return (
        <Page>
            <PageHeading>Register Agent</PageHeading>
            <PageSubHeading>Gain more commission by registering new wondamart agents.</PageSubHeading>

            <Notice variant={"default"} className={"mt-4"}>
                <NoticeHeading>Agent Registration Notice</NoticeHeading>
                <NoticeContent>
                    <NoticeItem title={"Amount"}>
                        Agent registration const <Code>{settings?.unitPrice ? `₵ ${settings.unitPrice.toFixed(2)}` :
                        <Loader2Icon className={"animate-spin inline-flex size-4"}/>}</Code>
                    </NoticeItem>
                    <NoticeItem title={"Commissions"}>
                        Agent registration attracts a commission
                        of <Code>{settings?.commission ? `₵ ${settings.commission.toFixed(2)}` :
                        <Loader2Icon className={"animate-spin inline-flex size-4"}/>}</Code>
                    </NoticeItem>
                    <NoticeItem title={"Activation"}>
                        This automatically activates the user's account. Hence no need for account activation.
                    </NoticeItem>
                </NoticeContent>
            </Notice>

            {
                settings && settings.enabled
                    ? (
                        <div className={"max-w-xl mx-auto space-y-4 mt-6"}>
                            <div>
                                <p className={"text-center text-2xl"}>Registration details</p>
                                <PageSubHeading className={"text-center"}>Fill the from below with the details of the new
                                    agent you are registering.</PageSubHeading>
                            </div>
                            <RegisterForm onSubmit={onSubmit}/>
                        </div>
                    ) : (
                        <DisabledNotice className="mt-4" title={"Agent Registration Unavailable"}>
                            Agent registration is currently unavailable. Please come back later or
                            contact support for more information.
                        </DisabledNotice>
                    )
            }
        </Page>
    )
}

export default RegisterAgent;