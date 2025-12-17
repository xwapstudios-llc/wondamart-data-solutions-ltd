#!/usr/bin/env python3
"""Nginx utility ported from the TS scripts/nginx.ts

Provides setup_site(site_name, domain, port) which writes a site config and enables it.
This script will try to write directly to /etc/nginx; if permissions are insufficient it falls back
to using `sudo tee`.
"""
import os
import textwrap
import argparse
from typing import Dict

from cmd import run_cmd

commands: Dict[str, str] = {
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


def config(domain: str, port: int) -> str:
    return textwrap.dedent(f"""
    server {{
      listen 80;
      server_name {domain};

      location / {{
          proxy_pass http://localhost:{port};
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;

          add_header X-Frame-Options "SAMEORIGIN";
          add_header X-Content-Type-Options "nosniff";
          add_header Referrer-Policy "no-referrer-when-downgrade";
          add_header X-XSS-Protection "1; mode=block";
      }}

        client_max_body_size 10M;
    }}
    """)

paths = {
    "sitesAvailable": "/etc/nginx/sites-available/",
    "sitesEnabled": "/etc/nginx/sites-enabled/",
}

logs = {
    "access_log": "/var/log/nginx/access.log",
    "error_log": "/var/log/nginx/error.log"
}


def get_site_config_path(site_name: str) -> str:
    return os.path.join(paths["sitesAvailable"], f"{site_name}.conf")


def enable_site_cmd(site_name: str) -> str:
    return f"sudo ln -s {get_site_config_path(site_name)} {paths['sitesEnabled']}"


def disable_site_cmd(site_name: str) -> str:
    return f"sudo rm {os.path.join(paths['sitesEnabled'], site_name + '.conf')}"


def delete_site_cmd(site_name: str) -> str:
    return f"{disable_site_cmd(site_name)} && sudo rm {get_site_config_path(site_name)}"


def setup_site(site_name: str, domain: str, port: int) -> None:
    print(f"Setting up Nginx site for {domain}...")
    site_config = config(domain, port)
    path = get_site_config_path(site_name)

    # try writing directly; if it fails (permission), try sudo tee fallback
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(site_config)
        print(f"Config file created at {path}")
    except PermissionError:
        # fallback with sudo tee using heredoc
        print("Permission denied writing to /etc/nginx -- attempting to write using sudo tee")
        heredoc = """sudo tee {path} > /dev/null <<'EOF'
{config}
EOF
""".format(path=path, config=site_config)
        run_cmd(heredoc)
        print(f"Config file created at {path} (via sudo)")

    try:
        run_cmd(enable_site_cmd(site_name))
        print(f"Site enabled: {site_name}")
        print("Reloading nginx...")
        run_cmd(commands["reload"])
        print(f"Nginx site for {domain} set up successfully.")
    except Exception as err:
        print(f"Error enabling/reloading site: {err}")
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='nginx.py')
    sub = parser.add_subparsers(dest='cmd')

    p_setup = sub.add_parser('setup-site')
    p_setup.add_argument('site_name')
    p_setup.add_argument('domain')
    p_setup.add_argument('port', type=int)

    p_cmd = sub.add_parser('run')
    p_cmd.add_argument('command')

    args = parser.parse_args()
    if args.cmd == 'setup-site':
        setup_site(args.site_name, args.domain, args.port)
    elif args.cmd == 'run':
        # expose direct command names from `commands`
        if args.command in commands:
            run_cmd(commands[args.command])
        else:
            run_cmd(args.command)
    else:
        parser.print_help()

