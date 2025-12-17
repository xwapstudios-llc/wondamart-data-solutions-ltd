import chalk from 'chalk';
import {writeFile} from 'fs/promises';
import path from "path";
import {cmd} from "./cmd";

const commands = {
    "install": "sudo apt update && sudo apt install -y nginx",
    "start": "sudo systemctl start nginx",
    "stop": "sudo systemctl stop nginx",
    "restart": "sudo systemctl restart nginx",
    "status": "sudo systemctl status nginx",
    "enable": "sudo systemctl enable nginx",
    "disable": "sudo systemctl disable nginx",
    "reload": "sudo systemctl reload nginx",
    "configTest": "sudo nginx -t"
}

const config = (domain:string, port: number) => {
    return `
    server {
      listen 80;
      server_name ${domain};

      location / {
          proxy_pass http://localhost:${port};
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;

          add_header X-Frame-Options "SAMEORIGIN";
          add_header X-Content-Type-Options "nosniff";
          add_header Referrer-Policy "no-referrer-when-downgrade";
          add_header X-XSS-Protection "1; mode=block";
      }
      
        client_max_body_size 10M;
    }`
}

const paths = {
    "sitesAvailable": "/etc/nginx/sites-available/",
    "sitesEnabled": "/etc/nginx/sites-enabled/",
}

const logs = {
    "access_log": "/var/log/nginx/access.log",
    "error_log": "/var/log/nginx/error.log"
}

const getSiteConfigPath = (siteName: string) => {
    return path.join(paths.sitesAvailable, `${siteName}.conf`);
}
const cmd_util = {
    enable_site: (siteName: string) => `sudo ln -s ${getSiteConfigPath(siteName)} ${paths.sitesEnabled}`,
    disable_site: (siteName: string) => `sudo rm ${paths.sitesEnabled}${siteName}.conf`,
    delete_site: (siteName: string) => `${cmd_util.disable_site(siteName)} && sudo rm ${getSiteConfigPath(siteName)}`,
}

const setup_site = async (siteName: string, domain: string, port: number) => {
    console.log(chalk.blue(`Setting up Nginx site for ${domain}...`));

    console.log(`Creating config...`);
    const siteConfig = config(domain, port);
    writeFile(`${getSiteConfigPath(siteName)}`, siteConfig)
        .then(async () => {
            console.log(chalk.green(`Config file created at ${getSiteConfigPath(siteName)}`));
            cmd(cmd_util.enable_site(siteName+".cong"))
                .then(async () => {
                    console.log(chalk.green(`Site enabled: ${siteName}`));
                    console.log(`Reloading nginx...`);
                    await cmd(commands.reload);
                    console.log(chalk.green(`Nginx site for ${domain} set up successfully.`));
                })
                .catch((err) => {
                    console.error(chalk.red(`Error enabling site: ${err}`));
                    throw err;
                })
        })
        .catch((err) => {
            console.error(chalk.red(`Error creating config file: ${err}`));
            throw err;
        })
}

export { commands, config, paths, logs, cmd_util, setup_site };