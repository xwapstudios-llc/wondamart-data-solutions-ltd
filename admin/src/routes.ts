const R = {
    login: '/',
    dashboard: '/dashboard',
    bundles: '/bundles',
    bundle: (id?: string) => {
        if (id) return `/bundle/${id}`
        return '/bundle/:id'
    },
    bundleEdit: (id?: string) => {
        if (id) return `/bundle/${id}/edit`
        return '/bundle/:id/edit'
    },

    transactions: '/tx',
    tx: (id?: string) => {
        if (id) return `/tx/${id}`
        return '/tx/:id'
    },

    commissions: '/commissions',

    users: '/users',
    user: (id?: string) => {
        if (id) return `/user/${id}`
        return '/user/:id'
    },
    userEdit: (id?: string) => {
        if (id) return `/user/${id}/edit`
        return '/user/:id/edit'
    },

    settings: '/settings',
    accounts: '/accounts', // To manage the accounts we buy data from (AirtelTigo, MTN, Telecel, WondaMart, Paystack)
}

export default R;