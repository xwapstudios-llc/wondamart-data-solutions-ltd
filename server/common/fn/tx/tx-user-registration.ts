import { TxUserRegistration } from "@common/types/user-registration";
import { TxFn } from "./tx-fn";
import {CommonSettingsFn} from "../common-settings-fn";
import {txType} from "@common/tx";
import {UserFn} from "../user-fn";

const TxUserRegistrationFn = {
    async create(uid: string, registeredUID: string) {
        const settings = await CommonSettingsFn.read_userRegistration();
        const registeredUser = await UserFn.read_UserDoc(registeredUID);
        const txDetails: TxUserRegistration = {
            ...await TxFn.initialDoc(txType.debit, uid),
            type: "debit",
            amount: settings.unitPrice,
            commission: settings.commission,
            txData: {
                uid: registeredUID,
                email: registeredUser.email,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                phoneNumber: registeredUser.phoneNumber,
            }
        };
        return txDetails;
    },
    async read_TxUserRegistrationDoc(txId: string): Promise<TxUserRegistration> {
        return await TxFn.read(txId) as TxUserRegistration;
    },
    async createAndCommit(uid: string, registeredUID: string): Promise<TxUserRegistration> {
        const details = await this.create(uid, registeredUID);
        await TxFn.commit(details);
        return details;
    }
};

export { TxUserRegistrationFn };
