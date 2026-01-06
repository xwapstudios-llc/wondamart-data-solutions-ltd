const user = "wondamart-server";

module.exports = {
    apps: [
        {
            name: "monit-system",
            script: "pnpm",
            args: "run start:monit-system",

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
            max_restarts: 20,
            restart_delay: 3000,
        },


        {
            name: "monit-modem",
            script: "pnpm",
            args: "run start:monit-modem",

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
            max_restarts: 2,
            restart_delay: 3000,
        },


        {
            name: "server",
            script: "pnpm",
            args: "run start:server",

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
            max_restarts: 30,
            restart_delay: 3000,
        },
    ],
};
