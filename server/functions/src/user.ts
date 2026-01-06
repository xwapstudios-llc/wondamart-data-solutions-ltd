// import { onCall } from "firebase-functions/v2/https";
// import {
//     UserPhoneNumberUpdateRequest, UserRegistrationRequest
// } from "@common/types/user.js";
// import { httpResponse } from "@common/types/request.js";
//
//
// export const createUser = onCall(async (event) => {
//     const d = event.data as UserRegistrationRequest;
//     console.log("Received user creation request:", d);
//     return await fbCreateUser(d);
// });
//
// export const registerNewAgent = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const data = event.data as UserRegistrationRequest;
//     console.log("Received user creation request:", data);
//     return await fbRegisterNewAgent(data, event.auth.uid);
// });
//
// export const requestActivateAccount = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     return await fbRequestActivateAccount(event.auth.uid);
// });
//
// export const requestEmailVerification = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     return await fbRequestEmailVerification(event.auth.uid);
// });
//
// export const updateUserPhoneNumber = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const d = event.data as UserPhoneNumberUpdateRequest;
//     return await fbUpdateUserPhoneNumber(d, event.auth.uid);
// });
//
// export const requestDeleteUser = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const uID = event.data as string;
//     return await fbRequestDeleteUser(uID);
// });
