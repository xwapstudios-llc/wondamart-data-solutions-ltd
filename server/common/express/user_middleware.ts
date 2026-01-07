import { httpResponse } from "@common/types/request";
import { UserClaims } from "@common/types/user";
import { MiddlewareHandler } from "./index";
import {getAuth} from "firebase-admin/auth";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userToken?: string;
            userClaims?: UserClaims;
        }
    }
}

const user_middleware: MiddlewareHandler = async (req, res, next) => {
    const userId = req.headers['user-id'] as string;
    const userToken = req.headers['user-token'] as string;

    const auth = getAuth();
    if (!userId) {
        console.log("No user id found at user_middleware.");
        const response = httpResponse(
            "unauthenticated",
            "User ID header required"
        );
        return res.status(response.code).json(response).end();
    }

    try {
        await auth.verifyIdToken(userToken, true);
    } catch (error) {
        console.log("Failed to verify auth id token.");
        const response = httpResponse(
            "unauthenticated",
            "User token is not valid"
        );
        return res.status(response.code).json(response).end();
    }

    const user = await auth.getUser(userId);
    req.userId = user.uid;
    req.userClaims = user.customClaims as UserClaims || {};

    console.log("User passed middleware");
    next();
};

export { user_middleware };