import {
    UserRegistrationData,
    UserInfoDocument,
    UserWalletDocument,
    UserRegistrationRequest,
    UserClaims
} from "@common/types/user";
import {Timestamp} from "firebase-admin/firestore";
import {userCollections, walletsCollections} from "./collections"

import {getAuth} from "firebase-admin/auth";

const auth = getAuth();


type UserInfoDocumentUpdate = Omit<UserInfoDocument, "updatedAt">;

const UserFn = {
    async create_doc(id: string, d: UserRegistrationData): Promise<void> {
        // Reference the user's document in Firestore.
        const userRef = userCollections.doc(id);

        // Check if the user document already exists.
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            // If the user document exists, throw an error.
            throw {
                code: "already-exists",
                message: `User ${id} document already exists.`
            };
        }

        // Initialize the info document.
        await userRef.set(
            {
                id: id,
                firstName: d.firstName,
                lastName: d.lastName || "",
                namesUpdatedAt: Timestamp.now(),
                email: d.email,
                referredBy: d.referredBy || "",
                phoneNumber: d.phoneNumber,
                recentTx: [],
                createdAt: Timestamp.now(),
            },
            {merge: true}
        );

        // Reference the user's document in Firestore.
        const userWalletRef = walletsCollections.doc(id);

        // Check if the user document already exists.
        const userWalletDoc = await userWalletRef.get();
        if (userWalletDoc.exists) {
            // If the user document exists, throw an error.
            throw {
                code: "already-exists",
                message: `User Wallet ${id} document already exists.`
            }
        }

        // Initialize the info document.
        await userWalletRef.set(
            {
                balance: 0,
                commission: 0,
                updatedAt: Timestamp.now(),
            },
            {merge: true}
        );
    },

    async createAccount(data: UserRegistrationRequest) {
        const userRecord = await auth.createUser({
            email: data.email,
            password: data.password,
        });
        console.log("Phone Number: /", UserFn.preparePhoneNumber(data.phoneNumber), "/");
        await auth.updateUser(userRecord.uid, {
            // emailVerified: false,
            phoneNumber: UserFn.preparePhoneNumber(data.phoneNumber),
            displayName: `${data.firstName} ${data.lastName ?? ""}`.trim(),
            // photoURL: "",
            // disabled: false,
        });
        await auth.setCustomUserClaims(userRecord.uid, {
            isActivated: false,
            updatedAt: Timestamp.now(),
        } as UserClaims);

        await this.create_doc(userRecord.uid, data);

        return userRecord.uid;
    },

    async read_credentials(uid: string): Promise<UserClaims | null> {
        const user = await auth.getUser(uid);
        if (!user) {
            return null;
        }
        const credentials = user.customClaims;
        if (!credentials) {
            return null;
        }
        return credentials;
    },

    preparePhoneNumber(phone: string): string | null {
        if (!phone || phone.trim().length === 0) {
            console.error("Phone number is empty or null");
            return null;
        }

        // Remove any non-digit characters (e.g., spaces, dashes)
        const cleanedPhone = phone.replace(/\D/g, '');

        // Handle the case where the number starts with country code '+233' or '233'
        if (cleanedPhone.startsWith('233')) {
            // If it starts with '233' but without the '+', treat it as a valid number
            return `+233${cleanedPhone.slice(3)}`;
        }

        // Handle the case where the number starts with '+233'
        if (cleanedPhone.startsWith('+233')) {
            return cleanedPhone; // Already in the correct format
        }

        // Handle the case where the number starts with '0' (local format)
        if (cleanedPhone.startsWith('0')) {
            return `+233${cleanedPhone.slice(1)}`; // Replace leading '0' with country code +233
        }

        // If none of the above conditions match, the phone number is invalid
        console.error("Phone number must start with 0, 233, or +233");
        return null;
    },


    async update_phoneNumber(uid: string, phoneNumber: string): Promise<void> {
        // Update Auth phone number
        await auth.updateUser(uid, {
            phoneNumber: UserFn.preparePhoneNumber(phoneNumber),
        });
        // Update Firestore phone number
        const ref = userCollections.doc(uid);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("User doesn't exist");
        }
        await ref.set({
            phoneNumber: phoneNumber,
            updatedAt: Timestamp.now(),
        }, {merge: true});
    },

    async read_UserDoc(uid: string): Promise<UserInfoDocument> {
        const ref = userCollections.doc(uid)
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("User doesn't exist");
        }
        return doc.data() as UserInfoDocument;
    },

    async read_UserWallet(uid: string): Promise<UserWalletDocument> {
        const ref = walletsCollections.doc(uid)
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("User doesn't exist");
        }
        return doc.data() as UserWalletDocument;
    },

    async update_UserInfoDocument(uid: string, data: UserInfoDocumentUpdate): Promise<void> {
        const ref = userCollections.doc(uid);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("User doesn't exist");
        }
        await ref.set({
            ...data,
            updatedAt: Timestamp.now(),
        }, {merge: true});
    },

    async update_UserWalletBalance(uid: string, amount: number): Promise<void> {
        const ref = walletsCollections.doc(uid);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("User doesn't exist");
        }
        await ref.set({
            balance: amount,
            updatedAt: Timestamp.now(),
        }, {merge: true});
    },

    async update_add_UserBalance(uid: string, amount: number): Promise<void> {
        const wallet = await UserFn.read_UserWallet(uid);
        await this.update_UserWalletBalance(uid, wallet.balance + amount);
    },

    async update_sub_UserBalance(uid: string, amount: number): Promise<void> {
        const wallet = await UserFn.read_UserWallet(uid);
        if (wallet.balance < amount) {
            // Either set to zero, remain negative or cancel order.
            throw new Error("Insufficient balance");
        }
        await this.update_UserWalletBalance(uid, wallet.balance - amount);
    },

    async update_add_recentTransaction(uid: string, txID: string): Promise<void> {
        const userDoc = await this.read_UserDoc(uid);
        if (userDoc.recentTx) userDoc.recentTx.unshift(txID);
        else userDoc.recentTx = [txID];
        if (userDoc.recentTx.length > 5) userDoc.recentTx = userDoc.recentTx.slice(0, 5)
        await this.update_UserInfoDocument(uid, userDoc);
    },

    claims: {
        update: async (uid: string, claims: Omit<UserClaims, "updatedAt">): Promise<void> => {
            // check if request is made by an admin user
            const user = await auth.getUser(uid);
            const previousClaims = user.customClaims as UserClaims;
            await auth.setCustomUserClaims(uid, {
                ...previousClaims,
                ...claims,
                updatedAt: Timestamp.now()
            } as UserClaims);
        },
        read: async (uid: string): Promise<UserClaims | null> => {
            const user = await auth.getUser(uid);
            if (!user) {
                return null;
            }
            const credentials = user.customClaims;
            if (!credentials) {
                return null;
            }
            return credentials;
        },
        activate: async (uid: string): Promise<void> => {
            await UserFn.claims.update(uid, {
                isActivated: true,
                // @ts-ignore
                isActivatedAt: Timestamp.now()
            });
        },
        makeAdmin: async (uid: string) => {
            await UserFn.claims.update(uid, {
                isAdmin: true,
                adminAt: Timestamp.now(),
                adminRole: {
                    dataBundles: {
                        read: true
                    },
                    users: {
                        read: true
                    },
                    commissions: {
                        read: true
                    },
                    transactions: {
                        read: true
                    }
                }
            } as UserClaims);
        }
    }
}

export {UserFn};