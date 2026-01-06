import { TxUserRegistration } from "@common/types/user-registration";
import { TxFn } from "./tx-fn";
import {CommonSettingsFn} from "../common-settings-fn";
import {txType} from "@common/types/tx";

const TxUserRegistrationFn = {
    async create(uid: string,  registeredUID: string) {
        const settings = await CommonSettingsFn.read_userRegistration();
        const txDetails: TxUserRegistration = {
            ...await TxFn.initialDoc(txType.userRegistration, uid),
            type: "user-registration",
            amount: settings.unitPrice,
            commission: settings.commission,
            data: {
                uid: registeredUID,
                email: "",
                password: "",
                firstName: "",
                phoneNumber: "", // Todo
            }
        };
        return txDetails;
    },
    async read_TxUserRegistrationDoc(txID: string): Promise<TxUserRegistration> {
        return await TxFn.read(txID) as TxUserRegistration;
    },
    async createAndCommit(uid: string, registeredUID: string): Promise<TxUserRegistration> {
        const details = await this.create(uid, registeredUID);
        await TxFn.commit(details);
        return details;
    }
};

export {
    TxUserRegistrationFn
};
