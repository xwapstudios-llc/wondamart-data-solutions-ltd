import {
    BookOpenIcon,
    CompassIcon,
    DollarSignIcon,
    type LucideIcon,
    Package2Icon,
    SendIcon,
    UserPlus2Icon
} from "lucide-react";
import type {TxType} from "@common/types/tx.ts";

const TxIcons = {
    dataBundles: Package2Icon,
    afaBundle: CompassIcon,
    resultChecker: BookOpenIcon,
    userRegistration: UserPlus2Icon,
    deposit: DollarSignIcon
}

const getTxIcon: Record<TxType | "tx", LucideIcon> = {
    "deposit": TxIcons.deposit,
    "result-checker": TxIcons.resultChecker,
    "user-registration": TxIcons.userRegistration,
    "data-bundle": TxIcons.dataBundles,
    "afa-bundle": TxIcons.afaBundle,
    "tx": SendIcon,
}

const getTxName: Record<TxType | "tx", string> = {
    "deposit": "Deposit",
    "result-checker": "Result Checker",
    "user-registration": "User Registration",
    "data-bundle": "Data Bundle",
    "afa-bundle": "AFA Bundle",
    "tx": "Transaction",
}

const toCurrency = (v: number) =>
    `₵ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;

export {
    TxIcons, getTxIcon, getTxName, toCurrency
}