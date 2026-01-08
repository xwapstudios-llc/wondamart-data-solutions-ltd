import {collections, db} from "@common/lib/db";
import {type UserInfoDocument, type UserRegistrationRequest, type UserWalletDocument} from "@common/types/user";
import {doc, getDoc, Timestamp, updateDoc} from "firebase/firestore";
import type {HTTPResponse} from "@common/types/request";
import {wondamart_api_client, wondamart_api_client_without_token} from "@common/lib/api-wondamart";

const ClUser = {
    create: async (data: UserRegistrationRequest): Promise<HTTPResponse> => {
        try {
            return await wondamart_api_client_without_token(
                "/new/user",
                data
            );
        } catch (err) {
            console.log(err);
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to create user");
        }
    },
    activateAccount: async (): Promise<HTTPResponse> => {
        try {
            return await wondamart_api_client(
                "/user/activate-account",
                {}
            );
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to activate user");
        }
    },
    registerAgent: async (data: UserRegistrationRequest): Promise<HTTPResponse> => {
        return await wondamart_api_client(
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
            return await wondamart_api_client(
                "/user/update-phone-number",
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
            return await wondamart_api_client(
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