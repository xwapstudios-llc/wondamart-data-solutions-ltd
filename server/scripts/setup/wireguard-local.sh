#!/bin/bash

# Setup wireguard configuration
echo "Setting up WireGuard configuration..."
WG_CONFIG_DIR="/etc/wireguard"
WG_CONFIG_FILE="$WG_CONFIG_DIR/wg0.conf"

GCP_PUBLIC_KEY="/AdtcG1U0wWmWucvZGtDgf+hwmF5atJwOATrw9BvESE="
GCP_ENDPOINT="136.111.11.216:51820"
WG_INTERNAL_IP="10.8.0.2"
WG_PEER_IP="10.8.0.1"


# If WG keys do not exist, Quit and ask user to run wireguard-genkeys.sh first
if [ ! -f "$WG_CONFIG_DIR/privatekey" ] || [ ! -f "$WG_CONFIG_DIR/publickey" ]; then
    echo ""
    echo ""
    echo " WireGuard keys not found! Please run wireguard-genkeys.sh first."
    exit 1
fi

# Read the generated keys
echo ""
echo ""
echo " Reading WireGuard keys..."
PRIVATE_KEY=$(sudo cat "$WG_CONFIG_DIR/privatekey")
PUBLIC_KEY=$(sudo cat "$WG_CONFIG_DIR/publickey")

# Create a basic WireGuard configuration file if it doesn't exist
if [ ! -f "$WG_CONFIG_FILE" ]; then
echo ""
echo ""
echo " Creating WireGuard configuration file..."
    sudo echo "
[Interface]
Address = $WG_INTERNAL_IP/24
PrivateKey = $PRIVATE_KEY
DNS = 1.1.1.1/0.0.0.0

[Peer]
PublicKey = $GCP_PUBLIC_KEY
Endpoint = $GCP_ENDPOINT
AllowedIPs = $WG_PEER_IP/32
PersistentKeepalive = 25
" | sudo tee "$WG_CONFIG_FILE"

sudo chmod 600 "$WG_CONFIG_FILE"
fi

#
echo ""
echo ""
echo " WireGuard configuration setup complete."

# Enable IP forwarding
echo ""
echo ""
echo " Enabling IP forwarding..."
sudo sysctl -w net.ipv4.ip_forward=1
sudo echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
echo "IP forwarding enabled."


# Enable and start WireGuard service
echo ""
echo ""
echo " Enabling and starting WireGuard service..."
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
echo "WireGuard service started."

# Final
echo ""
echo ""
echo " WireGuard setup on GCP complete."

# Running status check
echo ""
echo ""
echo " Checking WireGuard status..."
sudo wg show

# Running ping test
echo ""
echo ""
echo " Running ping test to WireGuard interface..."
ping $WG_PEER_IP -c 4
