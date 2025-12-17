#!/usr/bin/env python3
"""Entry point that mirrors scripts/index.ts behavior: starts pm2 process, sets up nginx, and obtains SSL via certbot.
"""
import argparse
import sys

# import local utilities
from pm2 import setup_site as pm2_setup
from nginx import setup_site as nginx_setup
from ssl import setup_site as ssl_setup


def main():
    name = "wondamart-api"
    domain = "api.wondamartgh.com"
    email = "xwapstudios@gmail.com"
    entry = "./compute-server/dist/server.js"
    port = 3180

    try:
        # start express server with pm2
        pm2_setup(name, entry)

        # set up a reverse proxy with nginx
        nginx_setup(name, domain, port)

        # Obtain SSL certificate with certbot
        ssl_setup(domain, email)
    except Exception as err:
        print(f"Setup failed: {err}")
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())