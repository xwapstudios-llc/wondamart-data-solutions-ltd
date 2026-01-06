import {getAuth, UserRecord} from "firebase-admin/auth";
import {UserClaims, UserWalletDocument} from "@common/types/user.js";
import {UserFn} from "./user-fn.js";
import {httpResponse} from "@common/types/request.js"
import {ServerFn} from "./server/server-fn.js";
import {Response} from "express";
import {sendResponse} from "../express";
import {Tx} from "@common/types/tx";
import {TxFn} from "./tx/tx-fn";

const auth = getAuth();

class ThrowCheck {
    uid: string;
    email: string | undefined;
    user: UserRecord | undefined;
    userClaims: UserClaims | undefined;
    userWallet: UserWalletDocument | undefined;
    res: Response;

    constructor(res: Response, uid: string) {
        this.uid = uid;
        this.res = res;
    }

    async init(): Promise<boolean> {
        try {
            const user = await auth.getUser(this.uid);
            this.uid = user.uid;
            this.email = user.email;
            this.user = user;
            this.userClaims = user.customClaims;
            return true;
        } catch {
            sendResponse(this.res, httpResponse("unauthenticated", "User not found"));
            return false;
        }
    }

    isUser(message?: string): boolean {
        if (!this.user) {
            sendResponse(this.res, httpResponse("unauthenticated", message || "User does not exist"));
            return false;
        }
        return true;
    }

    isUserDisabled(message?: string): boolean {
        if (this.user?.disabled) {
            sendResponse(this.res, httpResponse("permission-denied", message || "User is disabled"));
            return false;
        }
        return true;
    }

    isActivated(message?: string): boolean {
        if (!this.userClaims?.isActivated) {
            sendResponse(this.res, httpResponse("permission-denied", message || "User is not activated to use this service"));
            return false;
        }
        return true;
    }

    isAdmin(message?: string): boolean {
        if (!this.userClaims?.isAdmin) {
            sendResponse(this.res, httpResponse("permission-denied", message || "User is not admin"));
            return false;
        }
        return true;
    }

    async readWallet(message?: string): Promise<boolean> {
        if (!this.userWallet) {
            this.userWallet = await UserFn.read_UserWallet(this.uid);
        }
        if (!this.userWallet) {
            sendResponse(this.res, httpResponse("aborted", message || "Unable to read user wallet for processing."));
            return false;
        }
        return true;
    }

    async hasEnoughBalance(amount: number, tx?: Tx, message?: string): Promise<boolean> {
        if (!await this.readWallet()) return false;
        
        if (this.userWallet!.balance < amount) {
            if (tx) await TxFn.update_status_failed(tx.id);
            sendResponse(this.res, httpResponse("cancelled", message || "User does not have enough balance"));
            return false;
        }
        return true;
    }
}

const ThrowCheckFn = {
    async isUser(res: Response, uid: string, message?: string): Promise<boolean> {
        try {
            const user = await auth.getUser(uid);
            return !!user;
        } catch {
            sendResponse(res, httpResponse("permission-denied", message || `User with uid:${uid} does not exist.`));
            return false;
        }
    },
    
    async userAlreadyExistsByEmail(res: Response, email: string, message?: string): Promise<boolean> {
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            sendResponse(res, httpResponse("already-exists", message || `User with email ${email} already exists.`));
            return false;
        }
        return true;
    },
    
    async userAlreadyExistsByPhone(res: Response, phoneNumber: string, message?: string): Promise<boolean> {
        const existingUserByPhone = await auth.getUserByPhoneNumber(UserFn.preparePhoneNumber(phoneNumber) ?? phoneNumber).catch(() => null);
        if (existingUserByPhone) {
            sendResponse(res, httpResponse("already-exists", message || `User with phone number ${phoneNumber} already exists.`));
            return false;
        }
        return true;
    },

    async isServerActive(res: Response): Promise<boolean> {
        if (!await ServerFn.isActive()) {
            sendResponse(res, httpResponse("error", {
                title: "Server",
                message: "Sorry the request could not go through to wondamart servers.",
            }));
            return false;
        }
        return true;
    }
}

export {
    ThrowCheckFn,
    ThrowCheck
}