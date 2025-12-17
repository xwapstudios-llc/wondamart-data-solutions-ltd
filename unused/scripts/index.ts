import * as pm2 from "./pm2";
import * as nginx from "./nginx";
import * as ssl from "./ssl";
import chalk from "chalk";

const main = async () => {
    const name = "wondamart-api";
    const domain = "api.wondamartgh.com";
    const email = "xwapstudios@gmail.com";
    const entry = "./compute-server/dist/server.js";
    const port = 3180;

    try {
        // start express server with pm2
        pm2.setup_site(name, entry);

        // set up a reverse proxy with nginx
        await nginx.setup_site(name, domain, port);

        // Obtain SSL certificate with certbot
        await ssl.setup_site(domain, email);
    } catch (err) {
        console.log(chalk.red(`Setup failed: ${err}`));
    }
}

await main();