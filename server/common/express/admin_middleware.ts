import { httpResponse } from "@common/types/request";
import { MiddlewareHandler } from "./index";

const admin_middleware: MiddlewareHandler = (req, res, next) => {
    if (!req.userClaims?.isAdmin) {
        console.log("User claims => ", req.userClaims);
        console.log("Failed: Admin access required");
        const response = httpResponse(
            "unauthorized",
            "Admin access required"
        );
        return res.status(response.code).json(response).end();
    }

    console.log("Admin passed middleware");
    next();
};

export { admin_middleware };