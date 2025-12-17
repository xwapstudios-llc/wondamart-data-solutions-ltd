import {cmd} from "./cmd";
import chalk from "chalk";

const commands = {
    "installCertbot": "sudo apt update && sudo apt install -y certbot python3-certbot-nginx",
    "obtainCert": (domain: string, email: string) => `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${email}`,
    "renewCert": "sudo certbot renew",
    "revokeCert": (domain: string) => `sudo certbot revoke --cert-path /etc/letsencrypt/live/${domain}/fullchain.pem --non-interactive --agree-tos`,
}

const setup_site = async (domain: string, email: string) => {
    console.log(chalk.blue(`Obtaining SSL Certification for ${domain}`));
    cmd(commands.obtainCert(domain, email))
        .then(() => {
            console.log(chalk.green(`Successfully obtained SSL Certificate for ${domain}`));
        })
        .catch((err) => {
            console.error(`Error obtaining SSL Certificate for ${domain}:`, err);
            throw err;
        })
}

export {commands, setup_site};