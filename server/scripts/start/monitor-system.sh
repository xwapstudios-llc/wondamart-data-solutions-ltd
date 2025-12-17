#!/usr/bin/env bash

echo "Enter wondamart-data-solutions-ltd root dir"
if [ ! "$USER" == "nketsiah000" ]; then
    # shellcheck disable=SC2034
    export WONDAMART_ROOT=$HOME/wondamart-data-solutions-ltd
fi
if [ ! -d "$WONDAMART_ROOT" ]; then
    echo "Directory '$WONDAMART_ROOT' does not exist"
    echo "Exiting..."
    exit 1
fi

export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-cd38c56ffa.json
# shellcheck disable=SC2164
cd $WONDAMART_ROOT
echo "Starting app"
pnpm run start:monitor-system
