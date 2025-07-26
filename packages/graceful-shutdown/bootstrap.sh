#!/bin/bash
set -ex

# bash bootstrap.sh
# npx pm2 list
# npx pm2 delete all
# kill -INT $(pgrep pm2)

export PORT=3000

npx tsc --project tsconfig.json

# npx pm2 start ./dist/index.js -i 2 -p $PORT

export PATH="$PWD/node_modules/.bin:$PATH"
exec pm2 start ./dist/index.js -i 2 -p $PORT --kill-timeout 5000
