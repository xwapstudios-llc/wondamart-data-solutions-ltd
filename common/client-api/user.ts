import {collections, db} from "@common/lib/db";
import {type UserInfoDocument, type UserRegistrationRequest, type UserWalletDocument} from "@common/types/user";
import {doc, getDoc, Timestamp, updateDoc} from "firebase/firestore";
import {sendEmailVerification} from "firebase/auth"
import {auth} from "@common/lib/auth";
import type {HTTPResponse} from "@common/types/request";
import {api_wondamart_req} from "@common/lib/api-wondamart";

const ClUser = {
    create: async (data: UserRegistrationRequest): Promise<HTTPResponse> => {
        try {
            return await api_wondamart_req(
                "/user/create",
                data
            );
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to create user");
        }
    },
    activateAccount: async (): Promise<HTTPResponse> => {
        try {
            return await api_wondamart_req(
                "/user/activate",
                {}
            );
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to activate user");
        }
    },
    verifyEmail: async (): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            return Promise.reject("No authenticated user found");
        }
        try {
            await sendEmailVerification(user, {
                url: `https://wondamartgh.com/auth/verify-email/${user.email}`
            });
            // Toast email verification sent
            return Promise.resolve();
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to verify email");
        }
    },
    registerAgent: async (data: UserRegistrationRequest): Promise<HTTPResponse> => {
        return await api_wondamart_req(
            "/user/register-agent",
            data
        );
    },
    readInfo: async (uid: string): Promise<UserInfoDocument | undefined> => {
        const d = await getDoc(doc(db, collections.users, uid));
        if (d.exists()) return d.data() as UserInfoDocument;
    },
    readWallet: async (uid: string): Promise<UserWalletDocument | undefined> => {
        const d = await getDoc(doc(db, collections.wallets, uid));
        if (d.exists()) return d.data() as UserWalletDocument;
    },
    updateFirstName: async (uid: string, firstName: string): Promise<void> => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                firstName: firstName,
                namesUpdatedAt: Timestamp.now(),
            });
        }
    },
    updateLastName: async (uid: string, lastName: string): Promise<void> => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                lastName: lastName,
                namesUpdatedAt: Timestamp.now(),
            });
        }
    },
    updatePhoneNumber: async (uid: string, phoneNumber: string): Promise<HTTPResponse> => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            return await api_wondamart_req(
                "/user/update-phone",
                {
                    uid: uid,
                    phoneNumber: phoneNumber
                }
            );
        }
        return Promise.reject("User not found");
    },
    delete: async (uid: string): Promise<HTTPResponse> => {
        try {
            return await api_wondamart_req(
                "/user/delete",
                uid
            );
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to delete user");
        }
    },
    getRef: (uid: string) => {
        return doc(db, collections.users, uid);
    },
    getWalletRef: (uid: string) => {
        return doc(db, collections.wallets, uid);
    }
}

export {ClUser}