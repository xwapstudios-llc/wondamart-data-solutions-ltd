#!/bin/bash

## Setting up UFW (Uncomplicated Firewall)
echo "Setting up UFW (Uncomplicated Firewall)..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 51820/udp

sudo ufw enable

echo ""
echo ""
echo " UFW setup complete. Current status:"
sudo ufw status verbose