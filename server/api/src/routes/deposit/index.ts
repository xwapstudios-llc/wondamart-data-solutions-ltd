import momo from "./momo"
import paystack from "./paystack"
import send from "./send"
import paystackSubmitOTP from "./paystack-submit-otp"
import {notFoundHandler, RouteConfig, user_middleware} from "@common-server/express";
import {origen_middleware} from "@common-server/express/origin_middleware";
import {api_middleware} from "@common-server/express/api_middleware";

const deposit: RouteConfig = {
    path: "/deposit",
    middleware: [origen_middleware, api_middleware, user_middleware],
    children: [
        momo,
        send,
        paystack,
        paystackSubmitOTP
    ]
};

export default deposit;