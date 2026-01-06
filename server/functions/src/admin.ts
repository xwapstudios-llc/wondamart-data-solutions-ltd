// import { onCall } from "firebase-functions/v2/https";
// import {UserClaimsUpdate} from "@common/types/user.js";
// import { httpResponse } from "@common/types/request.js";
//
// export const requestFirstAdmin = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     return await fbRequestFirstAdmin(event.auth.uid);
// });
//
// export const requestMakeAdmin = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const uid = event.data as string;
//     return await fbRequestMakeAdmin(uid, event.auth.uid);
// });
//
// export const requestUpdateAdmin = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const data = event.data as UserClaimsUpdate;
//     return await fbRequestUpdateAdmin(data, event.auth.uid);
// });
//
// export const requestRevokeAdmin = onCall(async (event) => {
//     if (!event.auth) {
//         throw httpResponse("unauthenticated", "The function must be called while authenticated.");
//     }
//
//     const uid = event.data as string;
//     return await fbRequestRevokeAdmin(uid, event.auth.uid);
// });
