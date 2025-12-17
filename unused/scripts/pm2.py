#!/usr/bin/env python3
"""PM2 utility ported from scripts/pm2.ts

Provides setup_site(name, entry_path) which starts the given node entry with pm2 and saves the process list.
"""
from typing import Dict
import argparse

from cmd import run_cmd

command: Dict[str, object] = {
    "install": "sudo npm install -g pm2",
    "startup": "pm2 startup systemd",
    "stop": lambda name: f"pm2 stop {name}",
    "start": lambda name, path: f"pm2 start {path} --name {name} --time",
    "delete": lambda name: f"pm2 delete {name}",
    "restart": lambda name: f"pm2 restart {name}",
    "status": "pm2 status",
    "logs": lambda name: f"pm2 logs {name} --lines 100",
    "save": "pm2 save"
}


def setup_site(name: str, path: str) -> None:
    print(f"Starting setup for {name}...")
    try:
        run_cmd(command['start'](name, path))
        print(f"Started {name} successfully.")
        run_cmd(command['save'])
    except Exception as err:
        print(f"Failed to start {name}: {err}")
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='pm2.py')
    sub = parser.add_subparsers(dest='cmd')

    p_setup = sub.add_parser('setup-site')
    p_setup.add_argument('name')
    p_setup.add_argument('path')

    p_cmd = sub.add_parser('run')
    p_cmd.add_argument('command')
    p_cmd.add_argument('args', nargs='*')

    args = parser.parse_args()
    if args.cmd == 'setup-site':
        setup_site(args.name, args.path)
    elif args.cmd == 'run':
        cmd = args.command
        if cmd in command:
            fn = command[cmd]
            if callable(fn):
                run_cmd(fn(*args.args))
            else:
                run_cmd(fn)
        else:
            run_cmd(cmd + (' ' + ' '.join(args.args) if args.args else ''))
    else:
        parser.print_help()

