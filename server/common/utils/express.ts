import { Request, Response, NextFunction } from "express";
import {httpStatusCode} from "@common/types/request";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

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

    const token = authHeader.slice(7);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "https://pay.wondamartgh.com",
    });

    const payload = ticket.getPayload();
    if (
        payload?.email !== "wondamart-data-solutions-ltd@appspot.gserviceaccount.com"
    ) {
        return res.status(httpStatusCode["access-denied"]).end();
    }

    req.service = payload;
    next();
}