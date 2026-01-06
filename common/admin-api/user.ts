import { ClUser } from "@common/client-api/user";
import { collections, db } from "@common/lib/db";
import {collection, doc, getDoc, getDocs, Timestamp, updateDoc} from "firebase/firestore";
import {UserInfoDocument, AdminRoleClaims} from "@common/types/user";
import {api_wondamart_req} from "@common/lib/api-wondamart";

const AdminUser = {
    updateBalance: async (uid: string, amount: number) => {
        const ref = doc(db, collections.wallets, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                balance: amount,
                updatedAt: Timestamp.now(),
            });
        }
    },
    updateCommission: async (uid: string, amount: number) => {
        const ref = doc(db, collections.wallets, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                commission: amount,
                updatedAt: Timestamp.now(),
            });
        }
    },
    updateReferralCode: async (uid: string, code: string) => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                referralCode: code,
            });
        }
    },
    updateReferredBy: async (uid: string, code: string) => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                referredBy: code,
            });
        }
    },
    readAll: async () => {
        // Fetch all users
        const snapshot = await getDocs(collection(db, collections.users));
        const users: UserInfoDocument[] = [];
        snapshot.forEach((doc) => {
            users.push(doc.data() as UserInfoDocument);
        });
        return users;
    },
    makeAdmin: async (uid?: string) => {
        if (!uid) return Promise.reject("Invalid user id");
        try {
            return await api_wondamart_req(
                "/admin/make-admin",
                uid
            );
        } catch (e) {
            return Promise.reject("An error occurred while granting admin privileges");
        }
    },
    revokeAdmin: async (uid?: string) => {
        if (!uid) return Promise.reject("Invalid user id");
        try {
            return await api_wondamart_req(
                "/admin/revoke-admin",
                uid
            );
        } catch (e) {
            return Promise.reject("An error occurred while revoking admin privileges");
        }
    },
    changeAminRole: async (uid: string, role: AdminRoleClaims) => {
        const ref = doc(db, collections.users, uid);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                role: role,
            });
        }
    },
    ...ClUser,
};

export { AdminUser };
