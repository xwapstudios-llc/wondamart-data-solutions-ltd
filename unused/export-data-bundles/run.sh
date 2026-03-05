#!/bin/bash

# build
pnpm run build

# export
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-d418aa8130.json

# run
pnpm run start
