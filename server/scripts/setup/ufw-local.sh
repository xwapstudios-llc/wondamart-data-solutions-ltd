#!/bin/bash

## Setting up UFW (Uncomplicated Firewall) on Local server
echo "Setting up UFW (Uncomplicated Firewall)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow in on wg0
sudo ufw allow 22/tcp

sudo ufw enable

echo ""
echo ""
echo " UFW setup complete. Current status:"
sudo ufw status verbose
