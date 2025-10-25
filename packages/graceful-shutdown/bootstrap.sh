#!/bin/bash
# set -ex

# bash bootstrap.sh
# npx pm2 list
# npx pm2 kill
# npx pm2 delete all
# ps -A -o pid,ppid,comm,args > ps.txt
# kill -INT $(pgrep pm2)

export PORT=3000
echo "bootstrap.sh PID-PPID $$,$PPID"

npx tsc --project tsconfig.json

# npx pm2 start ./dist/index.js -i 2 --kill-timeout 5000

export PATH="$PWD/node_modules/.bin:$PATH"
# exec pm2-runtime start pm2.config.js --env production
exec pm2 start ./dist/index.js -i 2 --kill-timeout 5000 --log-date-format="YYYY-MM-DD HH:mm:ss" --log ./output.log

# pm2 start xxxxxxx
# forward_signal() {
#     pm2_pid=$(pgrep pm2)
#     kill -INT $pm2_pid
#     exit 0
# }
# trap forward_signal SIGINT
# while true; do
#     sleep 1
# done
