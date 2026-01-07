import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {TxSubmitOTPRequest} from "@common/types/account-deposit";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {httpResponse} from "@common/types/request";
import {charge} from "@/paystack/charge";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxSubmitOTPRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is no available at the moment."));
    }

    const {txID, otp} = d;

    console.log("-----------------------------------------------");
    console.log("paystack/submit-otp data:", req.body);
    console.log("-----------------------------------------------");

    if (!txID || !otp) {
        return sendResponse(res, httpResponse("invalid-data", {
            title: "Invalid data in request",
            message: "Request expected a valid transaction reference and an otp.",
        }));
    }

    try {
        console.log(`Received OTP submission for reference ${txID}: ${otp}`);
        const response = await charge.submit_otp(txID, otp);

        if (response.error) {
            return sendResponse(res, httpResponse("error", {
                title: "Failed to submit OTP",
                message: `An error occurred while submitting the OTP: ${response.error}`,
            }));
        }

        return sendResponse(res, httpResponse("ok", "OTP submitted successfully."));
    } catch (err: unknown) {
        console.error("Paystack OTP submission failed:", err);
        return sendResponse(res, httpResponse("error", {
            title: "Paystack OTP Error",
            message: `An error occurred while submitting the OTP: ${err}`,
        }));
    }
};

const paystackSubmitOTP : RouteConfig = {
    path: "/paystack-submit-otp",
    post: handler,
    middleware: [],
    children: [],
}
export default paystackSubmitOTP;