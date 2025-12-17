#!/bin/bash

# build
npx tsc -b

# export
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/wondamart/wondamart-data-solutions-firebase-adminsdk-fbsvc-cd38c56ffa.json

# run
node dist/index.js
