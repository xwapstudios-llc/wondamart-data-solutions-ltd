#!/bin/bash

## Setting up UFW (Uncomplicated Firewall)
echo "Setting up UFW (Uncomplicated Firewall)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow in on wg0

sudo ufw enable

echo ""
echo ""
echo " UFW setup complete. Current status:"
sudo ufw status verbose