import {Timestamp} from "firebase/firestore";

//
//  SubType
// export type UserActivity = TxDataBundle | TxAfaBundle | TxResultChecker | TxAccountDeposit | TxCommissionDeposit;

//
// Database Type
export interface UserWalletDocument {
    balance: number;
    commission: number;
    updatedAt: Timestamp;
}

export interface UserInfoDocument {
    id: string;
    firstName: string;
    lastName?: string;
    namesUpdatedAt: Timestamp;
    email: string;
    referredBy?: string;
    phoneNumber: string;
    recentTx: string[];
    createdAt: Timestamp;
}

export interface UserFullDocument {
    doc?: UserInfoDocument,
    wallet?: UserWalletDocument
}

// Credentials
interface RoleClaim {
    read?: boolean;
    create?: boolean;
    modify?: boolean;
    delete?: boolean;
}
export type AdminRoleClaims = {
    dataBundles?: RoleClaim;
    users?: RoleClaim;
    admins?: RoleClaim;
    commissions?: RoleClaim;
    transactions?: RoleClaim;
    messages?: RoleClaim;
    server?: RoleClaim;
};

export interface UserClaims {
    isActivated?: boolean;
    isActivatedAt?: Timestamp;

    isAdmin?: boolean;
    adminAt?: Timestamp;
    adminRole?: AdminRoleClaims;

    updatedAt?: Timestamp;

    email_verified?: boolean;
}
export interface UserClaimsUpdate {
    uid: string;
    credentials: UserClaims;
}

//
// Form Type
export type UserRegistrationData = Omit<UserInfoDocument, "id" | "namesUpdatedAt" | 'recentTx' | "createdAt">;
//
// Client Request Type
export interface UserRegistrationRequest {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phoneNumber: string;
    referredBy?: string;
}

export interface UserPhoneNumberUpdateRequest {
    uid: string;
    phoneNumber: string;
}
//
