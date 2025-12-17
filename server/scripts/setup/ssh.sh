#!/bin/bash

echo "Setting up SSH..."
sudo echo "
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
" | tee /etc/ssh/sshd_config

echo ""
echo ""
echo " Restarting SSH service to apply changes..."
sudo systemctl restart sshd

echo ""
echo ""
echo " SSH setup complete."