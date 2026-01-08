const R = {
    index: "/",
    login: "/login",
    signup: "/signup",

    // Terms and Conditions
    terms: "/terms", // Todo: Implement terms and conditions page
    policy: "/policy",

    help: "/help",
    about: "/about",
    faq: "/faq",

    auth: {
        action: "/auth/action",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        otp: (txID: string) => `/auth/otp/${txID}`,
    },

    app: {
        index: "/app",
        dashboard: "/app/dashboard",

        purchase: {
            index: "/app/purchase",

            // data bundle purchase
            dataBundle: {
                index: "/app/purchase/data-bundle",
                mtn: "/app/purchase/data-bundle/mtn",
                telecel: "/app/purchase/data-bundle/telecel",
                airtelTigo: "/app/purchase/data-bundle/airtel-tigo",
            },

            // AFA bundle purchase
            afaBundle: "/app/purchase/afa-bundle",

            // Result checker purchase
            resultChecker: "/app/purchase/result-checker",
        },

        registerAgent: "/app/register-agent",

        // User purchase history
        history: {
            index: "/app/history",
            id: (id: string) => `/app/history/${id}`,

            // Purchase history
            purchases: {
                index: "/app/history?type=purchase",
                dataBundles: "/app/history?type=data-bundle",
                afaBundles: "/app/history?type=afa-bundle",
                resultCheckers: "/app/history?type=result-checker",
            },
            // Deposit history
            deposits: "/app/history?type=deposit",
        },

        // Deposit funds
        deposit: "/app/deposit",

        // Commissions
        commissions: {
            index: "/app/commissions",
            id: (id: string) => `/app/commissions/${id}`,
        },

        // Notifications
        notifications: "/app/notifications",

        user: {
            index: "/app/user",

            // Profile Overview
            profile: "/app/user/profile",

            // Activate Account
            activate: "/app/user/activate",

            // Settings
            settings: {
                general: "/app/user/settings/general",
                security: "/app/user/settings/security",
            },
        },
    },

    utils: {
        whatsAppGroup: "https://chat.whatsapp.com/HDhT0o5JXtO8dq5OmiEqVU",
        admin: "https://wa.me/+233539971202?text=Hi%20Wondamart%20Data%20Solutions.",
        support: "https://chat.whatsapp.com/HDhT0o5JXtO8dq5OmiEqVU",
    }
};

export {R};
