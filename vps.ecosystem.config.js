const user = "xwapstudios";

module.exports = {
    apps: [
        {
            name: "pay",
            script: "pnpm",
            args: "run start:pay",

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
