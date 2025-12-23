const user = "wondamart-server";

module.exports = {
    apps: [
        {
            name: "monitor-system",
            script: "pnpm",
            args: "run start:monitor-system",

            // Hard requirements
            cwd: `/home/${user}/wondamart-data-solutions-ltd`,

            interpreter: "none",

            env: {
                WONDAMART_ROOT:
                    `/home/${user}/wondamart-data-solutions-ltd`,
                GOOGLE_APPLICATION_CREDENTIALS:
                    `/home/${user}/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-d418aa8130.json`,
            },

            // Ops hygiene
            autorestart: true,
            watch: false,
            max_restarts: 12,
            restart_delay: 3000,
        },


        {
            name: "monitor-modem",
            script: "pnpm",
            args: "run start:monitor-modem",

            // Hard requirements
            cwd: `/home/${user}/wondamart-data-solutions-ltd`,

            interpreter: "none",

            env: {
                WONDAMART_ROOT:
                    `/home/${user}/wondamart-data-solutions-ltd`,
                GOOGLE_APPLICATION_CREDENTIALS:
                    `/home/${user}/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-d418aa8130.json`,
            },

            // Ops hygiene
            autorestart: true,
            watch: false,
            max_restarts: 12,
            restart_delay: 3000,
        },
    ],
};
