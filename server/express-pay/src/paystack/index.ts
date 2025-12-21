import {charge, CreateChargeParams} from "./charge";
import {PayStackRequestResult} from "./core";
import {HTTPResponse, httpResponse} from "@common/types/request";

const test_paystack = async (p: CreateChargeParams): Promise<HTTPResponse> => {
    const r = await charge.create(p);
    if (r.error) {
        console.error(r.error);
        throw httpResponse(
            "aborted",
            {
                title: "Aborted",
                message: `Critical error occurred when trying to deposit with paystack. Please report this to admin.`,
            }
        )
    }

    if (r.res) {
        const res = r.res;

        if (!res.status) {
            console.log("Request failed:");
            // console.log(res);
            console.log("OTP required. Please provide the OTP to continue.");
            throw httpResponse(
                "error",
                {
                    title: "Payment Error",
                    message: `An error happened when trying to pay through paystack ${res.message}`,
                },
                {reference: res.data.reference}
            )
        }

        // Check for otp
        switch (res.data.status) {
            case "success":
                console.log("Payment successful");
                return httpResponse(
                    "ok",
                    "Payment successful",
                    {reference: res.data.reference}
                )
            case "send_otp": // Prompt user for otp
                console.log("OTP required. Please provide the OTP to continue.");
                console.log("OTP required. >>>>>>>> ", res);
                return httpResponse(
                    "send_otp",
                    {
                        title: "OTP Required",
                        message: `Please provide the OTP to continue. ${res.message}`,
                    },
                    {reference: res.data.reference}
                )

            case "send_pin": // Prompt user for pin
                console.log("PIN required. Please provide the PIN to continue.");
                return httpResponse(
                    "send_pin",
                    {
                        title: "PIN Required",
                        message: `Please provide the PIN to continue. ${res.message}`,
                    },
                    {reference: res.data.reference}
                )

            case "pay_offline": // Prompt user to pay offline using the ussd code from res.data.ussd_code
                console.log("Continue payment offline. Please follow the prompt on your phone.");
                return httpResponse(
                    "pay_offline",
                    {
                        title: "Pay Offline",
                        message: `Please continue payment on your phone. ${res.message}`,
                    },
                    {reference: res.data.reference}
                )

            case "send_phone": // Prompt user for phone number
                console.log("Phone number required. Please provide the phone number to continue.");
                return httpResponse(
                    "send_phone",
                    {
                        title: "Phone Number Required.",
                        message: `Please provide the phone number to continue. ${res.message}`,
                    },
                    {reference: res.data.reference}
                )
            case "send_birthday":
                console.log("Birthday required. Please provide the birthday to continue.");
                return httpResponse(
                "send_birthday",
                {
                    title: "Birthday required.",
                    message: `Please provide the birthday to continue. ${res.message}`,
                },
                {reference: res.data.reference}
            )

            case "send_address":
                console.log("Address required. Please provide the address to continue.");
                return httpResponse(
                    "send_address",
                    {
                        title: "Address required.",
                        message: `Please provide the your address to continue. ${res.message}`,
                    },
                    {reference: res.data.reference}
                )

            default:
                console.log("Unhandled status:");
                console.log(res.data.status);
                throw httpResponse(
                    "error",
                    {
                        title: "Payment Error",
                        message: `An error happened when trying to pay through paystack ${res.message}`,
                    },
                    {reference: res.data.reference}
                )
        }
    }

    throw httpResponse(
        "critical_or_unhandled",
        {
            title: "Critical",
            message: `An error happened when trying to pay through paystack. Please report this to admin immediately.`,
        }
    )
}

export {test_paystack}