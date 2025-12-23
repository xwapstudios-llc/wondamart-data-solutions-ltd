interface HTTPMessage {
    title: string;
    message: string;
}

type HTTPStatus =
    "ok"
    | "error"
    | "rejected"
    | "aborted"
    | "cancelled"
    | "critical_or_unhandled"
    | "permission-denied"
    | "pending"
    | "unauthorized"
    | "unauthenticated"
    | "user-disabled"
    | "already-exists"
    | "access-denied"
    | "invalid"
    | "invalid-data"
    | "send_otp"
    | "send_pin"
    | "send_payload"
    | "send_phone"
    | "send_email"
    | "send_birthday"
    | "send_address"
    | "pay_offline"
    ;

export const httpStatusCode = {
    // ✅ Success
    ok: 200,
    send_otp: 210,
    send_pin: 211,
    send_payload: 212,
    send_phone: 213,
    send_email: 214,
    send_birthday: 215,
    send_address: 216,
    pay_offline: 217,

    // ⏳ In-progress / async
    pending: 202,

    // ❌ Client errors
    invalid: 400,
    "invalid-data": 400,
    "already-exists": 409,

    // 🔐 Auth / Access
    unauthenticated: 401,
    unauthorized: 401,
    "permission-denied": 403,
    "access-denied": 403,
    "user-disabled": 404,

    // 🚫 Flow termination
    cancelled: 410,
    rejected: 422,
    aborted: 433,

    critical_or_unhandled: 445,

    // 💥 Generic failure
    error: 500,
};


export interface HTTPResponse {
    status: HTTPStatus;
    data?: any;
    message?: string | HTTPMessage;
    code: number;
}

export function httpResponse(status: HTTPStatus, message: string | HTTPMessage, data?: unknown | undefined): HTTPResponse {
    return {
        status: status,
        data: data,
        message: message,
        code: httpStatusCode[status],
    };
}