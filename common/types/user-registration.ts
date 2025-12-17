import { type Tx } from "./tx";

//
// Database Type
export interface TxUserRegistrationData {
    uid: string;
}
export interface TxUserRegistration extends Tx {
    type: 'user-registration';
    data: TxUserRegistrationData;
}
