import { type Tx } from "./tx";
import type {UserRegistrationRequest} from "@common/types/user";

//
// Database Type
export interface TxUserRegistrationData extends Omit<UserRegistrationRequest, "password"> {
    uid: string;
}
export interface TxUserRegistration extends Tx {
    type: 'user-registration';
    data: TxUserRegistrationData;
}
