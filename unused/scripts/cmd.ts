import {execa} from "execa";

const cmd = async (command: string) => {
    try {
        await execa(command, { shell: true, stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command "${command}":`, error);
        throw error;
    }
}

const cmds = async (commands: string[]) => {
    for (const command of commands) {
        await cmd(command);
    }
}

export { cmds, cmd }