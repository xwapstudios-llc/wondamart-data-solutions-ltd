// Create
//
// Read
//
// Update

import {collections, db} from "@common/lib/db";
import {Functions} from "@common/lib/fn";
import {UserInfoDocument, UserRegistrationRequest, UserWalletDocument} from "@common/types/user";
import {doc, getDoc, Timestamp, updateDoc} from "firebase/firestore";

const ClUser = {
    create: async (data: UserRegistrationRequest): Promise<void> => {
        try {
            await Functions.User.create(data);
            return Promise.resolve();
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to create user");
        }
    },
    activateAccount: async (): Promise<void> => {
        try {
            await Functions.User.requestActivateAccount();
            return Promise.resolve();
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to activate user");
        }
    },
    verifyEmail: async (): Promise<void> => {
        try {
            await Functions.User.requestEmailVerification();
            return Promise.resolve();
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to verify email");
        }
    },
    registerAgent: async (data: UserRegistrationRequest): Promise<void> => {
        try {
            await Functions.User.registerNewAgent(data);
            return Promise.resolve();
        } catch (err) {
            // @ts-expect-error message might not be available on error
            return Promise.reject(err.message || "Failed to create user");
        }
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
    updatePhoneNumber: async (uid: string, phoneNumber: string): Promise<void> => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await Functions.User.updatePhoneNumber({uid, phoneNumber: phoneNumber});
        }
    },
    delete: async (uid: string): Promise<void> => {
        try {
            await Functions.User.requestDelete(uid);
            return Promise.resolve();
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