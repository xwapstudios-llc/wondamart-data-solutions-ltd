import {USSDCode} from "@/types";

const momo_pin = "5050";
export const check_number: USSDCode = {
    root: "*124#"
}
export const check_momo_balance: USSDCode = {
    root: "*171#",
    sequence: ["7", "1", momo_pin]  // For MTN Ghana
}
export function cashInTo(number: string, amount: number): USSDCode {
    return {
        root: "*171#",
        sequence: ["3", "1", number, number, amount.toString(), momo_pin]
    }
}
