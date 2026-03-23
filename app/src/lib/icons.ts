import {
    BookOpenIcon,
    CompassIcon,
    DollarSignIcon,
    type LucideIcon,
    Package2Icon,
    SendIcon,
    UserPlus2Icon
} from "lucide-react";
import type {Tx, TxType} from "@common/tx";
import type {TxDataBundleData} from "@common/types/data-bundle";
import type {TxUserRegistrationData} from "@common/types/user-registration";
import type {TxResultCheckerData} from "@common/types/result-checker";
import type {TxAfaBundleData} from "@common/types/afa-bundle";
import type {
    TxDepositData,
    TxDepositMoMoData,
    TxDepositPaystackData,
    TxDepositSendData
} from "@common/types/account-deposit";

const TxIcons = {
    dataBundles: Package2Icon,
    afaBundle: CompassIcon,
    resultChecker: BookOpenIcon,
    userRegistration: UserPlus2Icon,
    deposit: DollarSignIcon
}

const getTxIcon: Record<TxType | "tx", LucideIcon> = {
    "paystack-deposit": TxIcons.deposit,
    "manual-deposit":   TxIcons.deposit,
    "checker-purchase": TxIcons.resultChecker,
    "debit":            TxIcons.userRegistration,
    "bundle-purchase":  TxIcons.dataBundles,
    "afa-purchase":     TxIcons.afaBundle,
    "admin-debit":      SendIcon,
    "admin-credit":     SendIcon,
    "refund":           SendIcon,
    "tx":               SendIcon,
}

const getTxName: Record<TxType | "tx", string> = {
    "paystack-deposit": "Paystack Deposit",
    "manual-deposit":   "Manual Deposit",
    "checker-purchase": "Result Checker",
    "debit":            "Debit",
    "bundle-purchase":  "Data Bundle",
    "afa-purchase":     "AFA Bundle",
    "admin-debit":      "Admin Debit",
    "admin-credit":     "Admin Credit",
    "refund":           "Refund",
    "tx":               "Transaction",
}

const toCurrency = (v: number) =>
    `₵ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;

const getTxReportText = (tx: Tx): string => {
    let strData: string;
    switch (tx.type) {
        case "bundle-purchase": {
            const data = tx.txData as TxDataBundleData;
            strData = `
📱 Phone: ${data.phoneNumber}
📶 Network: ${data.network}
📦 Bundle: ${data.bundleId}
`;
            break;
        }
        case "debit": {
            const dataReg = tx.txData as TxUserRegistrationData;
            strData = `
👤 Name: ${dataReg.firstName} ${dataReg.lastName}
📧 Email: ${dataReg.email}
📱 Phone: ${dataReg.phoneNumber}
`;
            break;
        }
        case "checker-purchase": {
            const datarc = tx.txData as TxResultCheckerData;
            strData = `
📚 CheckerType: ${datarc.checkerType}
🆔 Units: ${datarc.units}
`;
            break;
        }
        case "afa-purchase": {
            const dataAfa = tx.txData as TxAfaBundleData;
            strData = `
Name: ${dataAfa.fullName}
Phone: ${dataAfa.phoneNumber}
Date of Birth: ${dataAfa.date_of_birth}
ID Number: ${dataAfa.idNumber}
Location: ${dataAfa.location}
Occupation: ${dataAfa.occupation}
`;
            break;
        }
        case "paystack-deposit":
        case "manual-deposit": {
            const dataDep = tx.txData as TxDepositData;
            switch (dataDep.depositType) {
                case "paystack": {
                    const paystack = dataDep as TxDepositPaystackData;
                    strData = `
💳 Payment Method: ${paystack.depositType}
Phone: ${paystack.phoneNumber}
Network: ${paystack.network}
📧 Email: ${paystack.email}
`;
                    break;
                }
                case "send": {
                    const send = dataDep as TxDepositSendData;
                    strData = `
💳 Payment Method: ${send.depositType}
Transaction ID: ${send.transactionID}
`;
                    break;
                }
                case "momo": {
                    const momo = dataDep as TxDepositMoMoData;
                    strData = `
💳 Payment Method: ${momo.depositType}
Phone: ${momo.phoneNumber}
`;
                    break;
                }
                default:
                    strData = ``;
            }
            break;
        }
        default:
            strData = ``;
    }
    return `
📋 ORDER DETAILS FOR REPORT
━━━━━━━━━━━━━━━━━━━━━
🔖 Track ID: ${tx.txId}
💰 Amount: ${toCurrency(tx.amount)}
💸 Commission: ${toCurrency(tx.commission ?? 0)}
📅 Date: ${tx.time.toDate().toLocaleDateString("en-GB")}
📦 Type: ${getTxName[tx.type]}
${strData}
📊 Status: ${tx.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━
    `;
}

export {
    TxIcons, getTxIcon, getTxName, toCurrency, getTxReportText
}