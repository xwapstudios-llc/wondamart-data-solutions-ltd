#!/bin/bash

# Setup nginx configurations for multiple sites
SITE_NAMES=("pay" "api" "server")
LOCAL_HOSTS=("localhost" "10.8.0.2" "10.8.0.2")
PORTS=("3170" "3180" "3181")

SITES_AVAILABLE_DIR=/etc/nginx/sites-available
SITES_ENABLED_DIR=/etc/nginx/sites-enabled

for i in "${!SITE_NAMES[@]}"; do
    SITE_NAME=${SITE_NAMES[$i]}
    LOCAL_HOST=${LOCAL_HOSTS[$i]}
    PORT=${PORTS[$i]}
    DOMAIN=$SITE_NAME.wondamartgh.com
    FILE_NAME=$SITE_NAME.conf

    CONFIG="
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://$LOCAL_HOST:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass \$http_upgrade;

        add_header X-Frame-Options \"SAMEORIGIN\";
        add_header X-Content-Type-Options \"nosniff\";
        add_header Referrer-Policy \"no-referrer-when-downgrade\";
        add_header X-XSS-Protection \"1; mode=block\";
    }

    client_max_body_size 10M;
}
"

echo ""
echo ""
echo " Starting nginx config for $DOMAIN ...."

    # Create file
    sudo echo "$CONFIG" | sudo tee $SITES_AVAILABLE_DIR/$FILE_NAME
    echo "Created config file $SITES_AVAILABLE_DIR/$FILE_NAME"
    
    if [ ! -f "$SITES_AVAILABLE_DIR/$FILE_NAME" ]; then
        echo ""
        echo ""
        echo " Failed to create $SITES_AVAILABLE_DIR/$FILE_NAME !"
        exit 1
    fi

    # Setup link to sites-enabled
    echo "Enabling $DOMAIN"
    sudo ln -s $SITES_AVAILABLE_DIR/$FILE_NAME $SITES_ENABLED_DIR

    # Test nginx config
    echo "Testing nginx config after adding $DOMAIN ...."
    sudo nginx -t

    # Restart nginx
    echo "Restarting nginx..."
    sudo systemctl reload nginx

    # Final Message
    echo "Setup for $DOMAIN at $SITES_AVAILABLE_DIR/$FILE_NAME is done..."
done