#!/usr/bin/env bash

echo "Enter wondamart-data-solutions root dir"
if [ ! "$USER" == "nketsiah000" ]; then
    # shellcheck disable=SC2034
    export WONDAMART_ROOT=$HOME/wondamart-data-solutions
fi
if [ ! -d "$WONDAMART_ROOT" ]; then
    echo "Directory '$WONDAMART_ROOT' does not exist"
    echo "Exiting..."
    exit 1
fi

# This was ment to run on the cloud where GOOGLE_APPLICATION_CREDENTIALS is available
# For the rest, we export it.
if [ "$USER" == "nketsiah000" ] || [ "$USER" == "wondamart-server" ]; then
    export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-firebase-adminsdk-fbsvc-cd38c56ffa.json
fi
# shellcheck disable=SC2164
cd $WONDAMART_ROOT
echo "Starting app"
pnpm run start:express-pay
