import { Request, Response, NextFunction } from "express";
import {httpResponse} from "@common/types/request";
import {api_key} from "./api_key";

async function firebaseOnlyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Headers ----------------------------------")
    console.log(req.headers);
    console.log("-----------------------------------------");

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        const response = httpResponse(
            "unauthenticated",
            "Bearer not found",
        )
        return res.status(response.code).json(response).end();
    }

    const token = authHeader.slice(7);
    if (api_key != token) {
        const response = httpResponse(
            "access-denied",
            "Bearer is not valid",
        )
        return res.status(response.code).json(response).end();
    }

    next();
}

export {
    firebaseOnlyMiddleware
}