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

# This was made to run on the cloud where GOOGLE_APPLICATION_CREDENTIALS is available.
# However we resolved to use it on the wondamart vps as google services says insufficient access scopes.
# For the rest, we export it.
if [ "$USER" == "nketsiah000" ] || [ "$USER" == "wondamart-server" ] || [ "$USER" == "xwapstudios" ]; then
    export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-d418aa8130.json
fi
# shellcheck disable=SC2164
cd "$WONDAMART_ROOT"
echo "Starting app"
pnpm run start:express-pay
