#!/bin/bash

# Update package lists
echo "Updating package lists..."
sudo apt update -y

# Install Nginx web server
echo ""
echo ""
echo " Installing Nginx web server..."
sudo apt install nginx -y
echo "Nginx installation complete."

# Install Certbot
echo ""
echo ""
echo " Installing Certbot for Let's Encrypt..."
sudo apt install -y certbot python3-certbot-nginx
echo "Certbot installation is complete."

# Install Git version control system and GitHub
echo ""
echo ""
echo " Installing Git version control system..."
sudo apt install git -y
echo "Git installation complete."
# GitHub
echo ""
echo ""
echo " Installing GitHub version control platform..."
sudo apt install gh -y
echo "GitHub installation complete."

sudo apt install curl -y

# Install Node.js, npm, pnpm, and pm2
echo ""
echo ""
echo " Installing Node.js and pnpm..."
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify the Node.js version:
node -v

# Download and install pnpm:
corepack enable pnpm

corepack use pnpm@latest

# Verify pnpm version:
pnpm -v

# Setup pnpm globally
pnpm setup
# shellcheck disable=SC1090
source ~/.bashrc

echo "Node.js and npm installation complete."

# Install pm2 process manager
echo ""
echo ""
echo " Installing pm2 process manager..."
sudo pnpm install -g pm2
echo "pm2 installation complete."

# Install wireguard VPN
echo ""
echo ""
echo " Installing WireGuard VPN..."
sudo apt install wireguard -y
echo "WireGuard installation complete."