import {
    BookOpenIcon,
    CompassIcon,
    DollarSignIcon,
    type LucideIcon,
    Package2Icon,
    SendIcon,
    UserPlus2Icon
} from "lucide-react";
import type {Tx, TxType} from "@common/types/tx.ts";
import type {TxDataBundleData} from "@common/types/data-bundle.ts";
import type {TxUserRegistrationData} from "@common/types/user-registration.ts";
import type {TxResultCheckerData} from "@common/types/result-checker.ts";
import type {TxAfaBundleData} from "@common/types/afa-bundle.ts";
import type {
    TxDepositData,
    TxDepositMoMoData,
    TxDepositPaystackData,
    TxDepositSendData
} from "@common/types/account-deposit.ts";

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

const getTxReportText = (tx: Tx): string => {
    let strData: string;
    switch (tx.type) {
        case "data-bundle":
            const data = tx.data as TxDataBundleData;
            strData = `
📱 Phone: ${data.phoneNumber}
📶 Network: ${data.network}
📦 Bundle: ${data.bundleId}
`;
            break;
        case "user-registration":
            const dataReg = tx.data as TxUserRegistrationData;
            strData = `
👤 Name: ${dataReg.firstName } ${dataReg.lastName}
📧 Email: ${dataReg.email}
📱 Phone: ${dataReg.phoneNumber}
`;
            break;
        case "result-checker":
            const datarc = tx.data as TxResultCheckerData;
            strData = `
📚 CheckerType: ${datarc.checkerType}
🆔 Units: ${datarc.units}
`;
            break;
        case "afa-bundle":
            const dataAfa = tx.data as TxAfaBundleData;
            strData = `
Name: ${dataAfa.fullName}
Phone: ${dataAfa.phoneNumber}
Date of Birth: ${dataAfa.date_of_birth}
ID Number: ${dataAfa.idNumber}
Location: ${dataAfa.location}
Occupation: ${dataAfa.occupation}
`;
            break;
        case "deposit":
            const dataDep = tx.data as TxDepositData;

            switch (dataDep.type) {
                case "paystack":
                    const paystack = dataDep as TxDepositPaystackData;
                    strData = `
💳 Payment Method: ${paystack.type}
Phone: ${paystack.phoneNumber}
Network: ${paystack.network}
📧 Email: ${paystack.email}
`;
                    break;
                case "send":
                    const send = dataDep as TxDepositSendData;
                    strData = `
💳 Payment Method: ${send.type}
Transaction ID: ${send.transactionID}
`;
                    break;
                case "momo":
                    const momo = dataDep as TxDepositMoMoData;
                    strData = `
💳 Payment Method: ${momo.type}
Phone: ${momo.phoneNumber}
`;
                    break;
                default:
                    strData = ``;
            }
            break;
        default:
            strData = ``;
    }
    return `
📋 ORDER DETAILS FOR REPORT
━━━━━━━━━━━━━━━━━━━━━
🔖 Track ID: ${tx.id}
💰 Amount: ${toCurrency(tx.amount)}
💸 Commission: ${toCurrency(tx.commission)}
📅 Date: ${tx.date.toDate().toLocaleDateString("en-GB")}
📦 Type: ${getTxName[tx.type]}
${strData}
📊 Status: ${tx.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━
    `;
}

export {
    TxIcons, getTxIcon, getTxName, toCurrency, getTxReportText
}