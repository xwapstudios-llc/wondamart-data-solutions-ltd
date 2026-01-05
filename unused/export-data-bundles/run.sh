#!/bin/bash

# build
npx tsc -b

# export
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-ltd-firebase-adminsdk-fbsvc-d418aa8130.json

# run
node dist/index.js
