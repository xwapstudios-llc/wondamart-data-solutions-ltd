import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {httpResponse} from "@common/types/request";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const db = getFirestore();
    const auth = getAuth();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return sendResponse(res, httpResponse("unauthorized", `User with uid ${uid} not found.`));
    }

    try {
        const userData = userDoc.data();

        const deletedUsersRef = db.collection("deleted_users").doc(uid);
        await deletedUsersRef.set({
            ...userData,
            deletedAt: FieldValue.serverTimestamp(),
        });

        await userRef.delete();

        const userWalletRef = db.collection("wallets").doc(uid);
        const userWalletDoc = await userWalletRef.get();
        const userWalletData = userWalletDoc.exists ? userWalletDoc.data() : null;

        if (userWalletData) {
            const deletedWalletsRef = db.collection("deleted_wallets").doc(uid);
            await deletedWalletsRef.set({
                ...userWalletData,
                deletedAt: FieldValue.serverTimestamp(),
            });
        }

        await userWalletRef.delete();
        await auth.deleteUser(uid);

        return sendResponse(res, httpResponse("ok", `User ${uid} document deleted successfully`));
    } catch (error) {
        console.error("Error deleting user:", error);
        return sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};


const deleteAccount : RouteConfig = {
    path: "/delete",
    post: handler,
}

export default deleteAccount;