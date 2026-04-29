const R = {
    index: "/",
    login: "/login",
    signup: "/signup",

    // Terms and Conditions
    termsAndConditions: "/terms-and-conditions",

    help: "/help",
    about: "/about",
    faq: "/faq",

    auth: {
        action: "/auth/action",
        forgotPassword: "/auth/forgot-password",
        otp: (txID: string) => `/auth/otp/${txID}`,
    },

    client: {
        store: (storeId: string): string => `/store/${storeId}`,
        bundles: (storeId: string, network: string): string => `/store/${storeId}/${network}`,
        checkout: (storeId: string): string => `/store/${storeId}/checkout`,
        track: "/tracker"
    },

    app: {
        index: "/app",
        dashboard: "/app/dashboard",

        purchase: {
            index: "/app/purchase",

            // data bundle purchase
            dataBundle: {
                index: "/app/purchase/data-bundle",
                mtn: "/app/purchase/data-bundle?network=mtn",
                telecel: "/app/purchase/data-bundle?network=telecel",
                airtelTigo: "/app/purchase/data-bundle?network=airteltigo",
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
        // Terms and Conditions
        termsAndConditions: "/app/terms-and-conditions",

        help: "/app/help",
        about: "/app/about",
        faq: "/app/faq",
    },

    utils: {
        whatsAppGroup: "https://chat.whatsapp.com/FnCGfrUiJnh2c2L5Ffdnl5",
        admin: "https://wa.me/+233539971202?text=Hi%20Wondamart%20Data%20Solutions.",
        ernest: "https://wa.me/+233539971202?text=Hello%20I%20need%20help%20with%20my%20data%20purchase.",
        support: "https://chat.whatsapp.com/FnCGfrUiJnh2c2L5Ffdnl5",
        mail: "mailto:wondamartgh@gmail.com"
    }
};

export {R};
