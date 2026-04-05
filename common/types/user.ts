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

export type AdminRoleClaims = {
    canViewProviders: boolean,
    canEditProviders: boolean,
    canViewPayments: boolean,
    canEditPayments: boolean,

    canViewDataBundles: boolean,
    canEditDataBundles: boolean,
    canViewAfaBundles: boolean,
    canViewResultCheckers: boolean,
    canEditResultCheckers: boolean,

    canViewServers: boolean,
    canEditServers: boolean,
    canViewUsers: boolean,
    canEditUsers: boolean,

    canViewTransactions: boolean,
    canEditTransactions: boolean,

    canViewCommissions: boolean,
    canEditCommissions: boolean,
    canPayCommissions: boolean,

    canViewMessaging: boolean,
    canCreateMessaging: boolean,

    canUseModem: boolean,

    canViewAdmins: boolean,
    canEditAdmins: boolean,
    canMakeUserAdmin: boolean,
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
    lastName: string;
    phoneNumber: string;
    referredBy?: string;
}

export interface UserPhoneNumberUpdateRequest {
    uid: string;
    phoneNumber: string;
}
//
