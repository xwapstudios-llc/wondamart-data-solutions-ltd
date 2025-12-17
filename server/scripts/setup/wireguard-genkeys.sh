#!/bin/bash

# Setup wireguard configuration
echo "Setting up WireGuard configuration..."
WG_CONFIG_DIR="/etc/wireguard"

# Create WireGuard configuration directory if it doesn't exist
if [ ! -d "$WG_CONFIG_DIR" ]; then
    echo ""
echo ""
echo " Creating WireGuard configuration directory..."
    sudo mkdir -p "$WG_CONFIG_DIR"
fi

# Generate WireGuard keys if they don't exist
if [ ! -f "$WG_CONFIG_DIR/privatekey" ] || [ ! -f "$WG_CONFIG_DIR/publickey" ]; then
    echo ""
echo ""
echo " Generating WireGuard keys..."
    sudo wg genkey | sudo tee "$WG_CONFIG_DIR/privatekey" | sudo wg pubkey | sudo tee "$WG_CONFIG_DIR/publickey"


    # Set appropriate permissions for the keys
    echo "Setting permissions for WireGuard keys..."
    if [ -f "$WG_CONFIG_DIR/privatekey" ]; then
        sudo chmod 600 "$WG_CONFIG_DIR/privatekey"
    fi
    if [ -f "$WG_CONFIG_DIR/publickey" ]; then
        sudo chmod 600 "$WG_CONFIG_DIR/publickey"
    fi

    # Read the generated keys
    echo ""
echo ""
echo " Reading WireGuard keys..."
    PRIVATE_KEY=$(sudo cat "$WG_CONFIG_DIR/privatekey")
    PUBLIC_KEY=$(sudo cat "$WG_CONFIG_DIR/publickey")

    echo "private key >>> $PRIVATE_KEY"
    echo "public key >>> $PUBLIC_KEY"
fi