import {getAuth, UserRecord} from "firebase-admin/auth";
import {UserClaims, UserWalletDocument} from "@common/types/user.js";
import {UserFn} from "./user-fn.js";
import {httpResponse} from "@common/types/request.js"
import {ServerFn} from "./server/server-fn.js";

const auth = getAuth();

class ThrowCheck {
    uid: string;
    email: string | undefined;
    user: UserRecord | undefined;
    userClaims: UserClaims | undefined;
    userWallet: UserWalletDocument | undefined;

    constructor(uid: string) {
        this.uid = uid;
    }

    async init() {
        const user = await auth.getUser(this.uid);
        this.uid = user.uid;
        this.email = user.email;
        this.user = user;
        this.userClaims = user.customClaims;
    }

    _isUser() {
        return this.user != undefined;
    }

    isUser(message?: string) {
        if (!this._isUser()) {
            throw httpResponse
            (
                "unauthenticated",
                message ? message : "User does not exist",
            )
        }
    }

    isUserDisabled(message?: string) {
        if (this.user?.disabled) {
            throw httpResponse
            (
                "permission-denied",
                message ? message : "User is disabled",
            )
        }
    }

    _isActivated() {
        return this.userClaims?.isActivated != undefined && this.userClaims?.isActivated;
    }

    isActivated(message?: string) {
        if (!this._isActivated()) {
            throw httpResponse
            (
                "permission-denied",
                message ? message : "User is not activated to use this service"
            )
        }
    }

    isAdmin(message?: string) {
        if (!this.userClaims?.isAdmin) {
            throw httpResponse
            (
                "permission-denied",
                message ? message : "User is not admin",
            )
        }
    }

    async readWallet(message?: string) {
        if (!this.userWallet) {
            this.userWallet = await UserFn.read_UserWallet(this.uid);
        }
        if (!this.userWallet) {
            throw httpResponse
            (
                "aborted",
                message ? message : "Unable to read user wallet for processing."
            )
        }
    }

    async _hasEnoughBalance(amount: number) {
        if (!this.userWallet) {
            this.userWallet = await UserFn.read_UserWallet(this.uid);
            console.log("No wallet, hence reading user wallet > ", this.userWallet);
        }
        if (this.userWallet) {
            console.log("User wallet balance > ", this.userWallet.balance);
            console.log("User has enough balance : ", this.userWallet.balance >= amount);
            return this.userWallet.balance >= amount;
        }
        console.log("No wallet so returning false");
        return false;
    }

    async hasEnoughBalance(amount: number, message?: string) {
        await this.readWallet();
        const has_enough = await this._hasEnoughBalance(amount);
        console.log("Has enough balance, ", has_enough);
        if (!has_enough) {
            throw httpResponse
            (
                "cancelled",
                message ? message : "User does not have enough balance"
            )
        }
    }
}

const ThrowCheckFn = {
    async isUser(uid: string, message?: string) {
        // Find the user requesting the admin registration;
        const user = await auth.getUser(uid);

        if (!user) {
            throw httpResponse
            (
                "permission-denied",
                message ? message : `User with uid:${uid} does not exist.`
            )
        }
    },
    async userAlreadyExistsByEmail(email: string, message?: string) {
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            throw httpResponse
            (
                "already-exists",
                message ? message : `User with email ${email} already exists.`
            );
        }
    },
    async userAlreadyExistsByPhone(phoneNumber: string, message?: string) {
        const existingUserByPhone = await auth.getUserByPhoneNumber(UserFn.preparePhoneNumber(phoneNumber) ?? phoneNumber).catch(() => null);
        if (existingUserByPhone) {
            throw httpResponse
            (
                "already-exists",
                message ? message : `User with phone number ${phoneNumber} already exists.`
            );
        }
    },

    async isServerActive() {
        if (!await ServerFn.isActive()) {
            throw httpResponse (
                "error",
                {
                    title: "Server",
                    message: "Sorry the request could not go through to wondamart servers.",
                }
            )
        }
    }
    // claims: {
    //     isActivated(uid: string) {}
    // }
}

export {
    ThrowCheckFn,
    ThrowCheck
}