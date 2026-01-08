import {RouteConfig} from "@common-server/express";
import completeEmailVerification from "@/routes/user/auth/complete-email-verification";
import startEmailVerification from "@/routes/user/auth/start-email-verification";

const userAuth: RouteConfig = {
    path: "/auth",
    middleware: [],
    children: [
        completeEmailVerification,
        startEmailVerification
    ]
}

export default userAuth;