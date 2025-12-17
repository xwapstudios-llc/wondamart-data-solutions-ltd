import chalk from "chalk";
import {cmd} from "./cmd";

const command = {
    "install": "sudo npm install -g pm2",
    "startup": "pm2 startup systemd",
    "stop": (name: string) => `pm2 stop ${name}`,
    "start": (name: string, path: string) => `pm2 start ${path} --name ${name} --time`,
    "delete": (name: string) => `pm2 delete ${name}`,
    "restart": (name: string) => `pm2 restart ${name}`,
    "status": "pm2 status",
    "logs": (name: string) => `pm2 logs ${name} --lines 100`,
    "save": "pm2 save"
}

const setup_site = (name: string, path: string) => {
    console.log(chalk.blue(`Starting setup for ${name}...`));
    cmd(command.start(name, path))
        .then(async () => {
            console.log(chalk.green(`Started ${name} successfully.`));
            await cmd(command.save);
        })
        .catch((err) => {
            console.log(chalk.red(`Failed to start ${name}: ${err}`));
            throw err;
        })
}

export {command, setup_site};