import { Request, Response, NextFunction } from "express";
import {httpStatusCode} from "@common/types/request";
import {getAuth} from "firebase-admin/auth";

export async function firebaseOnlyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Headers ----------------------------------")
    console.log(req.headers);
    console.log("-----------------------------------------");
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(httpStatusCode["unauthenticated"]).end();
    }

    const token = authHeader.split(" ")[1];
    try {
        const auth = getAuth();
        (req as any).firebase = await auth.verifyIdToken(token);
        next();
    } catch {
        return res.status(httpStatusCode["access-denied"]).end();
    }
}