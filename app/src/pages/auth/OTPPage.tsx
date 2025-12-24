import React from "react";
import Page from "@/ui/page/Page.tsx";
import {OTPForm} from "@/ui/forms/otp-form.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {ClTxAccountDeposit} from "@common/client-api/tx-account-deposit.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {R} from "@/app/routes.ts";

const OTPPage: React.FC = () => {
    const {txID} = useParams();
    const {user} = useAppStore();
    const navigate = useNavigate();

    if (txID == undefined || txID == "") {
        return null
    }

    return (
        <Page>
            <PageContent className={"min-h-[80svh] flex items-center justify-center"}>
                <OTPForm
                    length={6}
                    onVerify={async (otp) => {
                        await ClTxAccountDeposit.otp.submit({
                            otp: otp,
                            txID: txID ?? "",
                            uid: user?.uid ?? "",
                        }).then(() => {
                            // Redirect to app dashboard after successful OTP submission
                            navigate(R.app.dashboard)
                        })
                    }}
                    // onResend={async () => {
                    //     await ClTxAccountDeposit.otp.resend(txID ?? "");
                    // }}
                />
            </PageContent>
        </Page>
    )
}

export default OTPPage;