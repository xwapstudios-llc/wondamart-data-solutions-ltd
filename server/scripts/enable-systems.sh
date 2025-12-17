#!/bin/bash

# Enable Nginx service
echo ""
echo ""
echo " Enabling Nginx service..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
echo "Nginx service enabled."

# Enable SSH service
echo ""
echo ""
echo " Enabling SSH service..."
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
echo "SSH service enabled."

# Enable WireGuard service
echo ""
echo ""
echo " Enabling WireGuard service..."
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
sudo systemctl status wg-quick@wg0
echo "WireGuard service enabled."

# Enable pm2 startup script
echo ""
echo ""
echo " Enabling pm2 startup script..."
sudo pm2 startup systemd -u $USER --hp $HOME
echo "pm2 startup script enabled."
echo "Saving current pm2 process list..."
pm2 save
echo "pm2 process list saved."