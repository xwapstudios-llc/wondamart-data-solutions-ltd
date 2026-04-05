import { txTypes, type TxType } from "@common/tx";

const R = {
    index: "/",
    login: "/login",

    app: {
        index: "/app",
        dashboard: "/app/dashboard",
        
        // Purchase section
        purchase: {
            index: "/app/purchase",
            dataBundle: {
                index: "/app/purchase/data-bundles",
                mtn: "/app/purchase/data-bundles/mtn",
                telecel: "/app/purchase/data-bundles/telecel",
                airtelTigo: "/app/purchase/data-bundles/airteltigo",
            },
            afaBundle: "/app/purchase/afa-bundles",
            resultChecker: "/app/purchase/result-checkers",
        },

        // History section
        history: {
            index: "/app/history",
            purchases: {
                index: "/app/history/purchases",
                dataBundles: "/app/history/purchases/data-bundles",
                afaBundles: "/app/history/purchases/afa-bundles",
                resultCheckers: "/app/history/purchases/result-checkers",
            },
            deposits: "/app/history/deposits",
        },

        // User section
        user: {
            index: "/app/user",
            profile: "/app/user/profile",
            settings: {
                general: "/app/user/settings/general",
                security: "/app/user/settings/security",
            },
            activate: "/app/user/activation-verification",
        },

        // Legal & Info section
        termsAndConditions: "/app/legal/terms-conditions",
        help: "/app/legal/help",
        about: "/app/legal/about",
        faq: "/app/legal/faq",

        // Utility pages
        registerAgent: "/app/register-agent",
        commissions: {
            index: "/app/commissions",
        },
        deposit: "/app/deposit",

        // Admin specific pages
        agentStore: "/app/agent-store",
        settings: "/app/settings",
        stock: {
            index: "/app/stock",
            bundles: "/app/stock/bundles",
            afa: "/app/stock/afa",
            checker: "/app/stock/checker",
        },
        transactions: {
            index: "/app/transactions",
            types: Object.fromEntries(txTypes.map(type => [type, `/app/transactions/${type}`])) as Record<TxType, string>,
        },
        users: "/app/users",
    }
};

export {R};
