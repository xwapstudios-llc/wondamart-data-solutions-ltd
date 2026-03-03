const R = {
    login: '/',
    dashboard: '/dashboard',

    providers: {
        index: '/providers',
        mnotify: {
            index: '/providers/mnotify',
            edit: '/providers/mnotify?edit=true',
        },
        hendyLinks: {
            index: '/providers/hendy-links',
            edit: '/providers/hendy-links?edit=true',
        },
        datamart: {
            index: '/providers/datamart',
            edit: '/providers/datamart?edit=true',
        },
        wondamart: {
            index: '/providers/wondamart',
            edit: '/providers/wondamart?edit=true',
        }
    },
    payments: {
        index: '/payments',
        paystack: {
            index: '/payments/paystack',
            edit: '/payments/paystack?edit=true',
        },
        send: {
            index: '/payments/send',
            edit: '/payments/send?edit=true',
        },
        momo: {
            index: '/payments/momo',
            edit: '/payments/momo?edit=true',
        }
    },
    stock: {
        index: '/stock',
        dataBundle: {
            index: '/stock/data-bundles',
            id: (id: string) => {
                return `/stock/data-bundles/${id}`
            },
            edit: (id: string) => {
                return `/stock/data-bundles/${id}?edit=true`
            },
        },
        afaBundles: '/stock/afa-bundles',
        resultCheckers: {
            index: '/stock/result-checkers',
            edit: `/stock/result-checkers?edit=true`,
        }
    },
    servers: {
        index: '/servers',
        id: (id: string) => {
            return `/server/${id}`
        },
    },
    users: {
        index: '/users',
        id: (id: string) => {
            return `/user/${id}`
        },
        edit: (id: string) => {
            return `/user/${id}?edit=true`
        },
    },
    transactions: {
        index: '/transactions',
        id: (id: string) => {
            return `/transaction/${id}`
        },
        edit: (id: string) => {
            return `/transaction/${id}?edit=true`
        },
    },
    commissions: {
        index: '/commissions',
        id: (id: string) => {
            return `/commission/${id}`
        },
    },
    messaging: {
        index: '/messaging',
        new: '/messaging/new',
    },
    modem: '/modem',
    admins: {
        index: '/admins',
        id: (id: string) => {
            return `/admin/${id}`
        },
        edit: (id: string) => {
            return `/admin/${id}?edit=true`
        },
    }
}

export {
    R
};
