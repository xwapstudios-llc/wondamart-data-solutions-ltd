import {RouteHandler, sendResponse, RouteConfig} from "@common-server/express";
import {UserRegistrationRequest} from "@common/types/user";
import {httpResponse} from "@common/types/request";
import {ThrowCheckFn} from "@common-server/fn/throw-check-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {getAuth} from "firebase-admin/auth";
import {userCollections, walletsCollections} from "@common-server/fn/collections";
import {mnotifyClient} from "@common-server/providers/mnotify/api";

const handler: RouteHandler = async (req, res) => {
    const d = req.body as UserRegistrationRequest;
    if (!d.email || !d.password || !d.firstName || !d.phoneNumber) {
        return sendResponse(res, httpResponse(
            "invalid",
            "The function must be called with a email and phoneNumber."
        ));
    }

    if (!await ThrowCheckFn.userAlreadyExistsByEmail(res, d.email)) return;
    if (!await ThrowCheckFn.userAlreadyExistsByPhone(res, d.phoneNumber)) return;

    try {
        await UserFn.createAccount(d);
        mnotifyClient.sendSms({
            recipients: [d.phoneNumber],
            message: `Your account has been created. Please deposit and activate your account. Thank you for using Wondamart Data Solutions.`
        }).catch(err => {
            console.error("Failed to send SMS notification:", err);
        })
        sendResponse(res, httpResponse("ok", `User ${d.email} account created successfully`));
    } catch (err) {
        const auth = getAuth();
        const userRecord = await auth.getUserByEmail(d.email).catch(() => null);
        if (userRecord) {
            await auth.deleteUser(userRecord.uid).catch(() => null);

            const userDoc = await userCollections.doc(userRecord?.uid || "somedoc").get();
            if (userDoc && userDoc.exists) {
                await userCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
            const userWalletDoc = await walletsCollections.doc(userRecord?.uid || "somedoc").get();
            if (userWalletDoc && userWalletDoc.exists) {
                await walletsCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
        }

        console.error("Error creating user:", err);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const newUser: RouteConfig = {
    path: "/user",
    post: handler,
    middleware: []
};

export default newUser;