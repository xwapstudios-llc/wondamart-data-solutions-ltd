#!/usr/bin/env python3
"""SSL/certbot helper ported from scripts/ssl.ts
"""
import argparse
from cmd import run_cmd

commands = {
    "installCertbot": "sudo apt update && sudo apt install -y certbot python3-certbot-nginx",
    "obtainCert": lambda domain, email: f"sudo certbot --nginx -d {domain} --non-interactive --agree-tos -m {email}",
    "renewCert": "sudo certbot renew",
    "revokeCert": lambda domain: f"sudo certbot revoke --cert-path /etc/letsencrypt/live/{domain}/fullchain.pem --non-interactive --agree-tos",
}


def setup_site(domain: str, email: str) -> None:
    print(f"Obtaining SSL Certification for {domain}")
    try:
        run_cmd(commands['obtainCert'](domain, email))
        print(f"Successfully obtained SSL Certificate for {domain}")
    except Exception as err:
        print(f"Error obtaining SSL Certificate for {domain}: {err}")
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='ssl.py')
    sub = parser.add_subparsers(dest='cmd')

    p_setup = sub.add_parser('setup-site')
    p_setup.add_argument('domain')
    p_setup.add_argument('email')

    p_cmd = sub.add_parser('run')
    p_cmd.add_argument('command')
    p_cmd.add_argument('args', nargs='*')

    args = parser.parse_args()
    if args.cmd == 'setup-site':
        setup_site(args.domain, args.email)
    elif args.cmd == 'run':
        cmd = args.command
        if cmd in commands:
            fn = commands[cmd]
            if callable(fn):
                run_cmd(fn(*args.args))
            else:
                run_cmd(fn)
        else:
            run_cmd(cmd + (' ' + ' '.join(args.args) if args.args else ''))
    else:
        parser.print_help()

