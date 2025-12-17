import {charge, CreateChargeParams} from "./charge";

const test_paystack = async (p: CreateChargeParams): Promise<any> => {
    const r = await charge.create(p);
    if (r.error) {
        console.error(r.error);
        throw r.error;
    }

    if (r.res) {
        const res = r.res;

        if (!res.status) {
            console.log("Request failed:");
            console.log(res);
            throw {status: "failed", message: res.message};
        }

        // Check for otp
        if (res.data.status !== "success") {
            switch (res.data.status) {
                case "send_otp": // Prompt user for otp
                    console.log("OTP required. Please provide the OTP to continue.");
                    throw {status: "otp_required", reference: res.data.reference, message: "OTP required"};

                case "send_pin": // Prompt user for pin
                    console.log("PIN required. Please provide the PIN to continue.");
                    throw {status: "pin_required", reference: res.data.reference, message: "PIN required"};

                case "pay_offline": // Prompt user to pay offline using the ussd code from res.data.ussd_code
                    console.log("Continue payment offline. Please follow the prompt on your phone.");
                    throw {status: "pay_offline", reference: res.data.reference, message: "Pay offline required"};

                case "send_phone": // Prompt user for phone number
                    console.log("Phone number required. Please provide the phone number to continue.");
                    throw {status: "phone_required", reference: res.data.reference, message: "Phone number required"};

                case "send_birthday":
                    console.log("Birthday required. Please provide the birthday to continue.");
                    throw {status: "birthday_required", reference: res.data.reference, message: "Birthday required"};

                case "send_address":
                    console.log("Address required. Please provide the address to continue.");
                    throw {status: "address_required", reference: res.data.reference, message: "Address required"};

                default:
                    console.log("Unhandled status:");
                    console.log(res.data.status);
                    throw {status: "unhandled_status", reference: res.data.reference, message: `Unhandled status: ${res.data.status}`};
            }
        }

        console.log("Charge created successfully:");
        console.log(res);
        return res;
    }
}

export {test_paystack}