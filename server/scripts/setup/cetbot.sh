#!/bin/bash

# Apply certbot to multiple sub-domains
SITE_NAMES=("api" "server")

for SITE_NAME in "${SITE_NAMES[@]}"; do
    DOMAIN=$SITE_NAME.wondamartgh.com

    echo ""
echo ""
echo " Certifying $DOMAIN ..."
    sudo certbot --nginx -d $DOMAIN
    echo "Certification for $DOMAIN complete"
done
