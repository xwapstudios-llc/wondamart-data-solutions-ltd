import { httpResponse } from "@common/types/request";
import { MiddlewareHandler } from "./index";

const admin_middleware: MiddlewareHandler = (req, res, next) => {
    if (!req.userClaims?.isAdmin) {
        const response = httpResponse(
            "unauthorized",
            "Admin access required"
        );
        return res.status(response.code).json(response).end();
    }

    next();
};

export { admin_middleware };